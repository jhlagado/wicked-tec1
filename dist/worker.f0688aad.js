// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/worker/z80.ts":[function(require,module,exports) {
"use strict"; ///////////////////////////////////////////////////////////////////////////////
/// @file Z80.js
///
/// @brief Emulator for the Zilog Z80 microprocessor
///
/// @author Matthew Howell
///
/// @remarks
///  This module is a simple, straightforward instruction interpreter.
///   There is no fancy dynamic recompilation or cycle-accurate emulation.
///   The author believes that this should be sufficient for any emulator that
///   would be feasible to write in JavaScript anyway.
///  The code and the comments in this file assume that the reader is familiar
///   with the Z80 architecture. If you're not, here are some references I use:
///  http://clrhome.org/table/ - Z80 instruction set tables
///  http://www.zilog.com/docs/z80/um0080.pdf - The official manual
///  http://www.myquest.nl/z80undocumented/z80-documented-v0.91.pdf
///   - The Undocumented Z80, Documented
///
/// @copyright (c) 2013 Matthew Howell
///  This code is released under the MIT license,
///  a copy of which is available in the associated README.md file,
///  or at http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});

function Z80(coreParameter) {
  // Obviously we'll be needing the core object's functions again.
  let core = coreParameter; // The argument to this constructor should be an object containing 4 functions:
  // mem_read(address) should return the byte at the given memory address,
  // mem_write(address, value) should write the given value to the given memory address,
  // io_read(port) should read a return a byte read from the given I/O port,
  // io_write(port, value) should write the given byte to the given I/O port.
  // If any of those functions is missing, this module cannot run.

  if (!core || typeof core.mem_read !== "function" || typeof core.mem_write !== "function" || typeof core.io_read !== "function" || typeof core.io_write !== "function") throw "Z80: Core object is missing required functions."; // All right, let's initialize the registers.
  // First, the standard 8080 registers.

  let a = 0x00;
  let b = 0x00;
  let c = 0x00;
  let d = 0x00;
  let e = 0x00;
  let h = 0x00;
  let l = 0x00; // Now the special Z80 copies of the 8080 registers
  //  (the ones used for the SWAP instruction and such).

  let a_prime = 0x00;
  let b_prime = 0x00;
  let c_prime = 0x00;
  let d_prime = 0x00;
  let e_prime = 0x00;
  let h_prime = 0x00;
  let l_prime = 0x00; // And now the Z80 index registers.

  let ix = 0x0000;
  let iy = 0x0000; // Then the "utility" registers: the interrupt vector,
  //  the memory refresh, the stack pointer, and the program counter.

  let i = 0x00;
  let r = 0x00;
  let sp = 0xdff0;
  let pc = 0x0000; // We don't keep an F register for the flags,
  //  because most of the time we're only accessing a single flag,
  //  so we optimize for that case and use utility functions
  //  for the rarer occasions when we need to access the whole register.

  let flags = {
    S: 0,
    Z: 0,
    Y: 0,
    H: 0,
    X: 0,
    P: 0,
    N: 0,
    C: 0
  };
  let flags_prime = {
    S: 0,
    Z: 0,
    Y: 0,
    H: 0,
    X: 0,
    P: 0,
    N: 0,
    C: 0
  }; // And finally we have the interrupt mode and flip-flop registers.

  let imode = 0;
  let iff1 = 0;
  let iff2 = 0; // These are all specific to this implementation, not Z80 features.
  // Keep track of whether we've had a HALT instruction called.

  let halted = false; // EI and DI wait one instruction before they take effect;
  //  these flags tell us when we're in that wait state.

  let do_delayed_di = false;
  let do_delayed_ei = false; // This tracks the number of cycles spent in a single instruction run,
  //  including processing any prefixes and handling interrupts.

  let cycle_counter = 0;

  function getState() {
    return {
      b: b,
      a: a,
      c: c,
      d: d,
      e: e,
      h: h,
      l: l,
      a_prime: a_prime,
      b_prime: b_prime,
      c_prime: c_prime,
      d_prime: d_prime,
      e_prime: e_prime,
      h_prime: h_prime,
      l_prime: l_prime,
      ix: ix,
      iy: iy,
      i: i,
      r: r,
      sp: sp,
      pc: pc,
      flags: {
        S: flags.S,
        Z: flags.Z,
        Y: flags.Y,
        H: flags.H,
        X: flags.X,
        P: flags.P,
        N: flags.N,
        C: flags.C
      },
      flags_prime: {
        S: flags_prime.S,
        Z: flags_prime.Z,
        Y: flags_prime.Y,
        H: flags_prime.H,
        X: flags_prime.X,
        P: flags_prime.P,
        N: flags_prime.N,
        C: flags_prime.C
      },
      imode: imode,
      iff1: iff1,
      iff2: iff2,
      halted: halted,
      do_delayed_di: do_delayed_di,
      do_delayed_ei: do_delayed_ei,
      cycle_counter: cycle_counter
    };
  }

  function setState(state) {
    b = state.b;
    a = state.a;
    c = state.c;
    d = state.d;
    e = state.e;
    h = state.h;
    l = state.l;
    a_prime = state.a_prime;
    b_prime = state.b_prime;
    c_prime = state.c_prime;
    d_prime = state.d_prime;
    e_prime = state.e_prime;
    h_prime = state.h_prime;
    l_prime = state.l_prime;
    ix = state.ix;
    iy = state.iy;
    i = state.i;
    r = state.r;
    sp = state.sp;
    pc = state.pc;
    flags.S = state.flags.S;
    flags.Z = state.flags.Z;
    flags.Y = state.flags.Y;
    flags.H = state.flags.H;
    flags.X = state.flags.X;
    flags.P = state.flags.P;
    flags.N = state.flags.N;
    flags.C = state.flags.C;
    flags_prime.S = state.flags_prime.S;
    flags_prime.Z = state.flags_prime.Z;
    flags_prime.Y = state.flags_prime.Y;
    flags_prime.H = state.flags_prime.H;
    flags_prime.X = state.flags_prime.X;
    flags_prime.P = state.flags_prime.P;
    flags_prime.N = state.flags_prime.N;
    flags_prime.C = state.flags_prime.C;
    imode = state.imode;
    iff1 = state.iff1;
    iff2 = state.iff2;
    halted = state.halted;
    do_delayed_di = state.do_delayed_di;
    do_delayed_ei = state.do_delayed_ei;
    cycle_counter = state.cycle_counter;
  } ///////////////////////////////////////////////////////////////////////////////
  /// @public reset
  ///
  /// @brief Re-initialize the processor as if a reset or power on had occured
  ///////////////////////////////////////////////////////////////////////////////


  let reset = function () {
    // These registers are the ones that have predictable states
    //  immediately following a power-on or a reset.
    // The others are left alone, because their states are unpredictable.
    sp = 0xdff0;
    pc = 0x0000;
    a = 0x00;
    r = 0x00;
    set_flags_register(0); // Start up with interrupts disabled.

    imode = 0;
    iff1 = 0;
    iff2 = 0; // Don't start halted or in a delayed DI or EI.

    halted = false;
    do_delayed_di = false;
    do_delayed_ei = false; // Obviously we've not used any cycles yet.

    cycle_counter = 0;
  };

  let reset1 = function () {
    sp = 0xdff0;
    pc = 0x0000;
    halted = false;
  }; ///////////////////////////////////////////////////////////////////////////////
  /// @public run_instruction
  ///
  /// @brief Runs a single instruction
  ///
  /// @return The number of T cycles the instruction took to run,
  ///          plus any time that went into handling interrupts that fired
  ///          while this instruction was executing
  ///////////////////////////////////////////////////////////////////////////////


  let run_instruction = function () {
    if (!halted) {
      // If the previous instruction was a DI or an EI,
      //  we'll need to disable or enable interrupts
      //  after whatever instruction we're about to run is finished.
      var doing_delayed_di = false,
          doing_delayed_ei = false;

      if (do_delayed_di) {
        do_delayed_di = false;
        doing_delayed_di = true;
      } else if (do_delayed_ei) {
        do_delayed_ei = false;
        doing_delayed_ei = true;
      } // R is incremented at the start of every instruction cycle,
      //  before the instruction actually runs.
      // The high bit of R is not affected by this increment,
      //  it can only be changed using the LD R, A instruction.


      r = r & 0x80 | (r & 0x7f) + 1 & 0x7f; // Read the byte at the PC and run the instruction it encodes.

      var opcode = core.mem_read(pc);

      try {
        decode_instruction(opcode);
      } catch (e) {
        console.log(`Illegal opcode ${opcode} at ${pc}`, e);
        halted = true;
      }

      pc = pc + 1 & 0xffff; // Actually do the delayed interrupt disable/enable if we have one.

      if (doing_delayed_di) {
        iff1 = 0;
        iff2 = 0;
      } else if (doing_delayed_ei) {
        iff1 = 1;
        iff2 = 1;
      } // And finally clear out the cycle counter for the next instruction
      //  before returning it to the emulator core.


      var retval = cycle_counter;
      cycle_counter = 0;
      return retval;
    } else {
      // While we're halted, claim that we spent a cycle doing nothing,
      //  so that the rest of the emulator can still proceed.
      return 1;
    }
  }; ///////////////////////////////////////////////////////////////////////////////
  /// @public interrupt
  ///
  /// @brief Simulates pulsing the processor's INT (or NMI) pin
  ///
  /// @param non_maskable - true if this is a non-maskable interrupt
  /// @param data - the value to be placed on the data bus, if needed
  ///////////////////////////////////////////////////////////////////////////////


  let interrupt = function (non_maskable, data) {
    if (non_maskable) {
      // The high bit of R is not affected by this increment,
      //  it can only be changed using the LD R, A instruction.
      r = r & 0x80 | (r & 0x7f) + 1 & 0x7f; // Non-maskable interrupts are always handled the same way;
      //  clear IFF1 and then do a CALL 0x0066.
      // Also, all interrupts reset the HALT state.

      halted = false;
      iff2 = iff1;
      iff1 = 0;
      push_word(pc);
      pc = 0x66;
      cycle_counter += 11;
    } else if (iff1) {
      // The high bit of R is not affected by this increment,
      //  it can only be changed using the LD R, A instruction.
      r = r & 0x80 | (r & 0x7f) + 1 & 0x7f;
      halted = false;
      iff1 = 0;
      iff2 = 0;

      if (imode === 0) {
        // In the 8080-compatible interrupt mode,
        //  decode the content of the data bus as an instruction and run it.
        decode_instruction(data);
        cycle_counter += 2;
      } else if (imode === 1) {
        // Mode 1 is always just RST 0x38.
        push_word(pc);
        pc = 0x38;
        cycle_counter += 13;
      } else if (imode === 2) {
        // Mode 2 uses the value on the data bus as in index
        //  into the vector table pointer to by the I register.
        push_word(pc); // The Z80 manual says that this address must be 2-byte aligned,
        //  but it doesn't appear that this is actually the case on the hardware,
        //  so we don't attempt to enforce that here.

        var vector_address = i << 8 | data;
        pc = core.mem_read(vector_address) | core.mem_read(vector_address + 1 & 0xffff) << 8;
        cycle_counter += 19;
      }
    }
  }; ///////////////////////////////////////////////////////////////////////////////
  /// The public API functions end here.
  ///
  /// What begins here are just general utility functions, used variously.
  ///////////////////////////////////////////////////////////////////////////////


  let decode_instruction = function (opcode) {
    // The register-to-register loads and ALU instructions
    //  are all so uniform that we can decode them directly
    //  instead of going into the instruction array for them.
    // This function gets the operand for all of these instructions.
    var get_operand = function (opcode) {
      return (opcode & 0x07) === 0 ? b : (opcode & 0x07) === 1 ? c : (opcode & 0x07) === 2 ? d : (opcode & 0x07) === 3 ? e : (opcode & 0x07) === 4 ? h : (opcode & 0x07) === 5 ? l : (opcode & 0x07) === 6 ? core.mem_read(l | h << 8) : a;
    }; // Handle HALT right up front, because it fouls up our LD decoding
    //  by falling where LD (HL), (HL) ought to be.


    if (opcode === 0x76) {
      halted = true;
    } else if (opcode >= 0x40 && opcode < 0x80) {
      // This entire range is all 8-bit register loads.
      // Get the operand and assign it to the correct destination.
      var operand = get_operand(opcode);
      if ((opcode & 0x38) >>> 3 === 0) b = operand;else if ((opcode & 0x38) >>> 3 === 1) c = operand;else if ((opcode & 0x38) >>> 3 === 2) d = operand;else if ((opcode & 0x38) >>> 3 === 3) e = operand;else if ((opcode & 0x38) >>> 3 === 4) h = operand;else if ((opcode & 0x38) >>> 3 === 5) l = operand;else if ((opcode & 0x38) >>> 3 === 6) core.mem_write(l | h << 8, operand);else if ((opcode & 0x38) >>> 3 === 7) a = operand;
    } else if (opcode >= 0x80 && opcode < 0xc0) {
      // These are the 8-bit register ALU instructions.
      // We'll get the operand and then use this "jump table"
      //  to call the correct utility function for the instruction.
      var operand = get_operand(opcode),
          op_array = [do_add, do_adc, do_sub, do_sbc, do_and, do_xor, do_or, do_cp];
      op_array[(opcode & 0x38) >>> 3](operand);
    } else {
      // This is one of the less formulaic instructions;
      //  we'll get the specific function for it from our array.
      var func = instructions[opcode];
      func();
    } // Update the cycle counter with however many cycles
    //  the base instruction took.
    // If this was a prefixed instruction, then
    //  the prefix handler has added its extra cycles already.


    cycle_counter += cycle_counts[opcode];
  };

  let get_signed_offset_byte = function (value) {
    // This function requires some explanation.
    // We just use JavaScript Number variables for our registers,
    //  not like a typed array or anything.
    // That means that, when we have a byte value that's supposed
    //  to represent a signed offset, the value we actually see
    //  isn't signed at all, it's just a small integer.
    // So, this function converts that byte into something JavaScript
    //  will recognize as signed, so we can easily do arithmetic with it.
    // First, we clamp the value to a single byte, just in case.
    value &= 0xff; // We don't have to do anything if the value is positive.

    if (value & 0x80) {
      // But if the value is negative, we need to manually un-two's-compliment it.
      // I'm going to assume you can figure out what I meant by that,
      //  because I don't know how else to explain it.
      // We could also just do value |= 0xffffff00, but I prefer
      //  not caring how many bits are in the integer representation
      //  of a JavaScript number in the currently running browser.
      value = -((0xff & ~value) + 1);
    }

    return value;
  };

  let get_flags_register = function () {
    // We need the whole F register for some reason.
    //  probably a PUSH AF instruction,
    //  so make the F register out of our separate flags.
    return flags.S << 7 | flags.Z << 6 | flags.Y << 5 | flags.H << 4 | flags.X << 3 | flags.P << 2 | flags.N << 1 | flags.C;
  };

  let get_flags_prime = function () {
    // This is the same as the above for the F' register.
    return flags_prime.S << 7 | flags_prime.Z << 6 | flags_prime.Y << 5 | flags_prime.H << 4 | flags_prime.X << 3 | flags_prime.P << 2 | flags_prime.N << 1 | flags_prime.C;
  };

  let set_flags_register = function (operand) {
    // We need to set the F register, probably for a POP AF,
    //  so break out the given value into our separate flags.
    flags.S = (operand & 0x80) >>> 7;
    flags.Z = (operand & 0x40) >>> 6;
    flags.Y = (operand & 0x20) >>> 5;
    flags.H = (operand & 0x10) >>> 4;
    flags.X = (operand & 0x08) >>> 3;
    flags.P = (operand & 0x04) >>> 2;
    flags.N = (operand & 0x02) >>> 1;
    flags.C = operand & 0x01;
  };

  let set_flags_prime = function (operand) {
    // Again, this is the same as the above for F'.
    flags_prime.S = (operand & 0x80) >>> 7;
    flags_prime.Z = (operand & 0x40) >>> 6;
    flags_prime.Y = (operand & 0x20) >>> 5;
    flags_prime.H = (operand & 0x10) >>> 4;
    flags_prime.X = (operand & 0x08) >>> 3;
    flags_prime.P = (operand & 0x04) >>> 2;
    flags_prime.N = (operand & 0x02) >>> 1;
    flags_prime.C = operand & 0x01;
  };

  let update_xy_flags = function (result) {
    // Most of the time, the undocumented flags
    //  (sometimes called X and Y, or 3 and 5),
    //  take their values from the corresponding bits
    //  of the result of the instruction,
    //  or from some other related value.
    // This is a utility function to set those flags based on those bits.
    flags.Y = (result & 0x20) >>> 5;
    flags.X = (result & 0x08) >>> 3;
  };

  let get_parity = function (value) {
    // We could try to actually calculate the parity every time,
    //  but why calculate what you can pre-calculate?
    var parity_bits = [1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1];
    return parity_bits[value];
  };

  let push_word = function (operand) {
    // Pretty obvious what this function does; given a 16-bit value,
    //  decrement the stack pointer, write the high byte to the new
    //  stack pointer location, then repeat for the low byte.
    sp = sp - 1 & 0xffff;
    core.mem_write(sp, (operand & 0xff00) >>> 8);
    sp = sp - 1 & 0xffff;
    core.mem_write(sp, operand & 0x00ff);
  };

  let pop_word = function () {
    // Again, not complicated; read a byte off the top of the stack,
    //  increment the stack pointer, rinse and repeat.
    var retval = core.mem_read(sp) & 0xff;
    sp = sp + 1 & 0xffff;
    retval |= core.mem_read(sp) << 8;
    sp = sp + 1 & 0xffff;
    return retval;
  }; ///////////////////////////////////////////////////////////////////////////////
  /// Now, the way most instructions work in this emulator is that they set up
  ///  their operands according to their addressing mode, and then they call a
  ///  utility function that handles all variations of that instruction.
  /// Those utility functions begin here.
  ///////////////////////////////////////////////////////////////////////////////


  let do_conditional_absolute_jump = function (condition) {
    // This function implements the JP [condition],nn instructions.
    if (condition) {
      // We're taking this jump, so write the new PC,
      //  and then decrement the thing we just wrote,
      //  because the instruction decoder increments the PC
      //  unconditionally at the end of every instruction
      //  and we need to counteract that so we end up at the jump target.
      pc = core.mem_read(pc + 1 & 0xffff) | core.mem_read(pc + 2 & 0xffff) << 8;
      pc = pc - 1 & 0xffff;
    } else {
      // We're not taking this jump, just move the PC past the operand.
      pc = pc + 2 & 0xffff;
    }
  };

  let do_conditional_relative_jump = function (condition) {
    // This function implements the JR [condition],n instructions.
    if (condition) {
      // We need a few more cycles to actually take the jump.
      cycle_counter += 5; // Calculate the offset specified by our operand.

      var offset = get_signed_offset_byte(core.mem_read(pc + 1 & 0xffff)); // Add the offset to the PC, also skipping past this instruction.

      pc = pc + offset + 1 & 0xffff;
    } else {
      // No jump happening, just skip the operand.
      pc = pc + 1 & 0xffff;
    }
  };

  let do_conditional_call = function (condition) {
    // This function is the CALL [condition],nn instructions.
    // If you've seen the previous functions, you know this drill.
    if (condition) {
      cycle_counter += 7;
      push_word(pc + 3 & 0xffff);
      pc = core.mem_read(pc + 1 & 0xffff) | core.mem_read(pc + 2 & 0xffff) << 8;
      pc = pc - 1 & 0xffff;
    } else {
      pc = pc + 2 & 0xffff;
    }
  };

  let do_conditional_return = function (condition) {
    if (condition) {
      cycle_counter += 6;
      pc = pop_word() - 1 & 0xffff;
    }
  };

  let do_reset = function (address) {
    // The RST [address] instructions go through here.
    push_word(pc + 1 & 0xffff);
    pc = address - 1 & 0xffff;
  };

  let do_add = function (operand) {
    // This is the ADD A, [operand] instructions.
    // We'll do the literal addition, which includes any overflow,
    //  so that we can more easily figure out whether we had
    //  an overflow or a carry and set the flags accordingly.
    var result = a + operand; // The great majority of the work for the arithmetic instructions
    //  turns out to be setting the flags rather than the actual operation.

    flags.S = result & 0x80 ? 1 : 0;
    flags.Z = !(result & 0xff) ? 1 : 0;
    flags.H = (operand & 0x0f) + (a & 0x0f) & 0x10 ? 1 : 0; // An overflow has happened if the sign bits of the accumulator and the operand
    //  don't match the sign bit of the result value.

    flags.P = (a & 0x80) === (operand & 0x80) && (a & 0x80) !== (result & 0x80) ? 1 : 0;
    flags.N = 0;
    flags.C = result & 0x100 ? 1 : 0;
    a = result & 0xff;
    update_xy_flags(a);
  };

  let do_adc = function (operand) {
    var result = a + operand + flags.C;
    flags.S = result & 0x80 ? 1 : 0;
    flags.Z = !(result & 0xff) ? 1 : 0;
    flags.H = (operand & 0x0f) + (a & 0x0f) + flags.C & 0x10 ? 1 : 0;
    flags.P = (a & 0x80) === (operand & 0x80) && (a & 0x80) !== (result & 0x80) ? 1 : 0;
    flags.N = 0;
    flags.C = result & 0x100 ? 1 : 0;
    a = result & 0xff;
    update_xy_flags(a);
  };

  let do_sub = function (operand) {
    var result = a - operand;
    flags.S = result & 0x80 ? 1 : 0;
    flags.Z = !(result & 0xff) ? 1 : 0;
    flags.H = (a & 0x0f) - (operand & 0x0f) & 0x10 ? 1 : 0;
    flags.P = (a & 0x80) !== (operand & 0x80) && (a & 0x80) !== (result & 0x80) ? 1 : 0;
    flags.N = 1;
    flags.C = result & 0x100 ? 1 : 0;
    a = result & 0xff;
    update_xy_flags(a);
  };

  let do_sbc = function (operand) {
    var result = a - operand - flags.C;
    flags.S = result & 0x80 ? 1 : 0;
    flags.Z = !(result & 0xff) ? 1 : 0;
    flags.H = (a & 0x0f) - (operand & 0x0f) - flags.C & 0x10 ? 1 : 0;
    flags.P = (a & 0x80) !== (operand & 0x80) && (a & 0x80) !== (result & 0x80) ? 1 : 0;
    flags.N = 1;
    flags.C = result & 0x100 ? 1 : 0;
    a = result & 0xff;
    update_xy_flags(a);
  };

  let do_cp = function (operand) {
    // A compare instruction is just a subtraction that doesn't save the value,
    //  so we implement it as... a subtraction that doesn't save the value.
    var temp = a;
    do_sub(operand);
    a = temp; // Since this instruction has no "result" value, the undocumented flags
    //  are set based on the operand instead.

    update_xy_flags(operand);
  };

  let do_and = function (operand) {
    // The logic instructions are all pretty straightforward.
    a &= operand & 0xff;
    flags.S = a & 0x80 ? 1 : 0;
    flags.Z = !a ? 1 : 0;
    flags.H = 1;
    flags.P = get_parity(a);
    flags.N = 0;
    flags.C = 0;
    update_xy_flags(a);
  };

  let do_or = function (operand) {
    a = (operand | a) & 0xff;
    flags.S = a & 0x80 ? 1 : 0;
    flags.Z = !a ? 1 : 0;
    flags.H = 0;
    flags.P = get_parity(a);
    flags.N = 0;
    flags.C = 0;
    update_xy_flags(a);
  };

  let do_xor = function (operand) {
    a = (operand ^ a) & 0xff;
    flags.S = a & 0x80 ? 1 : 0;
    flags.Z = !a ? 1 : 0;
    flags.H = 0;
    flags.P = get_parity(a);
    flags.N = 0;
    flags.C = 0;
    update_xy_flags(a);
  };

  let do_inc = function (operand) {
    var result = operand + 1;
    flags.S = result & 0x80 ? 1 : 0;
    flags.Z = !(result & 0xff) ? 1 : 0;
    flags.H = (operand & 0x0f) === 0x0f ? 1 : 0; // It's a good deal easier to detect overflow for an increment/decrement.

    flags.P = operand === 0x7f ? 1 : 0;
    flags.N = 0;
    result &= 0xff;
    update_xy_flags(result);
    return result;
  };

  let do_dec = function (operand) {
    var result = operand - 1;
    flags.S = result & 0x80 ? 1 : 0;
    flags.Z = !(result & 0xff) ? 1 : 0;
    flags.H = (operand & 0x0f) === 0x00 ? 1 : 0;
    flags.P = operand === 0x80 ? 1 : 0;
    flags.N = 1;
    result &= 0xff;
    update_xy_flags(result);
    return result;
  };

  let do_hl_add = function (operand) {
    // The HL arithmetic instructions are the same as the A ones,
    //  just with twice as many bits happening.
    var hl = l | h << 8,
        result = hl + operand;
    flags.N = 0;
    flags.C = result & 0x10000 ? 1 : 0;
    flags.H = (hl & 0x0fff) + (operand & 0x0fff) & 0x1000 ? 1 : 0;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    update_xy_flags(h);
  };

  let do_hl_adc = function (operand) {
    operand += flags.C;
    var hl = l | h << 8,
        result = hl + operand;
    flags.S = result & 0x8000 ? 1 : 0;
    flags.Z = !(result & 0xffff) ? 1 : 0;
    flags.H = (hl & 0x0fff) + (operand & 0x0fff) & 0x1000 ? 1 : 0;
    flags.P = (hl & 0x8000) === (operand & 0x8000) && (result & 0x8000) !== (hl & 0x8000) ? 1 : 0;
    flags.N = 0;
    flags.C = result & 0x10000 ? 1 : 0;
    l = result & 0xff;
    h = result >>> 8 & 0xff;
    update_xy_flags(h);
  };

  let do_hl_sbc = function (operand) {
    operand += flags.C;
    var hl = l | h << 8,
        result = hl - operand;
    flags.S = result & 0x8000 ? 1 : 0;
    flags.Z = !(result & 0xffff) ? 1 : 0;
    flags.H = (hl & 0x0fff) - (operand & 0x0fff) & 0x1000 ? 1 : 0;
    flags.P = (hl & 0x8000) !== (operand & 0x8000) && (result & 0x8000) !== (hl & 0x8000) ? 1 : 0;
    flags.N = 1;
    flags.C = result & 0x10000 ? 1 : 0;
    l = result & 0xff;
    h = result >>> 8 & 0xff;
    update_xy_flags(h);
  };

  let do_in = function (port) {
    var result = core.io_read(port);
    flags.S = result & 0x80 ? 1 : 0;
    flags.Z = result ? 0 : 1;
    flags.H = 0;
    flags.P = get_parity(result) ? 1 : 0;
    flags.N = 0;
    update_xy_flags(result);
    return result;
  };

  let do_neg = function () {
    // This instruction is defined to not alter the register if it === 0x80.
    if (a !== 0x80) {
      // This is a signed operation, so convert A to a signed value.
      a = get_signed_offset_byte(a);
      a = -a & 0xff;
    }

    flags.S = a & 0x80 ? 1 : 0;
    flags.Z = !a ? 1 : 0;
    flags.H = (-a & 0x0f) > 0 ? 1 : 0;
    flags.P = a === 0x80 ? 1 : 0;
    flags.N = 1;
    flags.C = a ? 1 : 0;
    update_xy_flags(a);
  };

  let do_ldi = function () {
    // Copy the value that we're supposed to copy.
    var read_value = core.mem_read(l | h << 8);
    core.mem_write(e | d << 8, read_value); // Increment DE and HL, and decrement BC.

    var result = (e | d << 8) + 1;
    e = result & 0xff;
    d = (result & 0xff00) >>> 8;
    result = (l | h << 8) + 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    result = (c | b << 8) - 1;
    c = result & 0xff;
    b = (result & 0xff00) >>> 8;
    flags.H = 0;
    flags.P = c || b ? 1 : 0;
    flags.N = 0;
    flags.Y = (a + read_value & 0x02) >>> 1;
    flags.X = (a + read_value & 0x08) >>> 3;
  };

  let do_cpi = function () {
    var temp_carry = flags.C;
    var read_value = core.mem_read(l | h << 8);
    do_cp(read_value);
    flags.C = temp_carry;
    flags.Y = (a - read_value - flags.H & 0x02) >>> 1;
    flags.X = (a - read_value - flags.H & 0x08) >>> 3;
    var result = (l | h << 8) + 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    result = (c | b << 8) - 1;
    c = result & 0xff;
    b = (result & 0xff00) >>> 8;
    flags.P = result ? 1 : 0;
  };

  let do_ini = function () {
    b = do_dec(b);
    core.mem_write(l | h << 8, core.io_read(b << 8 | c));
    var result = (l | h << 8) + 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    flags.N = 1;
  };

  let do_outi = function () {
    core.io_write(b << 8 | c, core.mem_read(l | h << 8));
    var result = (l | h << 8) + 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    b = do_dec(b);
    flags.N = 1;
  };

  let do_ldd = function () {
    flags.N = 0;
    flags.H = 0;
    var read_value = core.mem_read(l | h << 8);
    core.mem_write(e | d << 8, read_value);
    var result = (e | d << 8) - 1;
    e = result & 0xff;
    d = (result & 0xff00) >>> 8;
    result = (l | h << 8) - 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    result = (c | b << 8) - 1;
    c = result & 0xff;
    b = (result & 0xff00) >>> 8;
    flags.P = c || b ? 1 : 0;
    flags.Y = (a + read_value & 0x02) >>> 1;
    flags.X = (a + read_value & 0x08) >>> 3;
  };

  let do_cpd = function () {
    var temp_carry = flags.C;
    var read_value = core.mem_read(l | h << 8);
    do_cp(read_value);
    flags.C = temp_carry;
    flags.Y = (a - read_value - flags.H & 0x02) >>> 1;
    flags.X = (a - read_value - flags.H & 0x08) >>> 3;
    var result = (l | h << 8) - 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    result = (c | b << 8) - 1;
    c = result & 0xff;
    b = (result & 0xff00) >>> 8;
    flags.P = result ? 1 : 0;
  };

  let do_ind = function () {
    b = do_dec(b);
    core.mem_write(l | h << 8, core.io_read(b << 8 | c));
    var result = (l | h << 8) - 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    flags.N = 1;
  };

  let do_outd = function () {
    core.io_write(b << 8 | c, core.mem_read(l | h << 8));
    var result = (l | h << 8) - 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
    b = do_dec(b);
    flags.N = 1;
  };

  let do_rlc = function (operand) {
    flags.N = 0;
    flags.H = 0;
    flags.C = (operand & 0x80) >>> 7;
    operand = (operand << 1 | flags.C) & 0xff;
    flags.Z = !operand ? 1 : 0;
    flags.P = get_parity(operand);
    flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);
    return operand;
  };

  let do_rrc = function (operand) {
    flags.N = 0;
    flags.H = 0;
    flags.C = operand & 1;
    operand = operand >>> 1 & 0x7f | flags.C << 7;
    flags.Z = !(operand & 0xff) ? 1 : 0;
    flags.P = get_parity(operand);
    flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);
    return operand & 0xff;
  };

  let do_rl = function (operand) {
    flags.N = 0;
    flags.H = 0;
    var temp = flags.C;
    flags.C = (operand & 0x80) >>> 7;
    operand = (operand << 1 | temp) & 0xff;
    flags.Z = !operand ? 1 : 0;
    flags.P = get_parity(operand);
    flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);
    return operand;
  };

  let do_rr = function (operand) {
    flags.N = 0;
    flags.H = 0;
    var temp = flags.C;
    flags.C = operand & 1;
    operand = operand >>> 1 & 0x7f | temp << 7;
    flags.Z = !operand ? 1 : 0;
    flags.P = get_parity(operand);
    flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);
    return operand;
  };

  let do_sla = function (operand) {
    flags.N = 0;
    flags.H = 0;
    flags.C = (operand & 0x80) >>> 7;
    operand = operand << 1 & 0xff;
    flags.Z = !operand ? 1 : 0;
    flags.P = get_parity(operand);
    flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);
    return operand;
  };

  let do_sra = function (operand) {
    flags.N = 0;
    flags.H = 0;
    flags.C = operand & 1;
    operand = operand >>> 1 & 0x7f | operand & 0x80;
    flags.Z = !operand ? 1 : 0;
    flags.P = get_parity(operand);
    flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);
    return operand;
  };

  let do_sll = function (operand) {
    flags.N = 0;
    flags.H = 0;
    flags.C = (operand & 0x80) >>> 7;
    operand = operand << 1 & 0xff | 1;
    flags.Z = !operand ? 1 : 0;
    flags.P = get_parity(operand);
    flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);
    return operand;
  };

  let do_srl = function (operand) {
    flags.N = 0;
    flags.H = 0;
    flags.C = operand & 1;
    operand = operand >>> 1 & 0x7f;
    flags.Z = !operand ? 1 : 0;
    flags.P = get_parity(operand);
    flags.S = 0;
    update_xy_flags(operand);
    return operand;
  };

  let do_ix_add = function (operand) {
    flags.N = 0;
    var result = ix + operand;
    flags.C = result & 0x10000 ? 1 : 0;
    flags.H = (ix & 0xfff) + (operand & 0xfff) & 0x1000 ? 1 : 0;
    update_xy_flags((result & 0xff00) >>> 8);
    ix = result;
  }; ///////////////////////////////////////////////////////////////////////////////
  /// This table contains the implementations for the instructions that weren't
  ///  implemented directly in the decoder function (everything but the 8-bit
  ///  register loads and the accumulator ALU instructions, in other words).
  /// Similar tables for the ED and DD/FD prefixes follow this one.
  ///////////////////////////////////////////////////////////////////////////////


  let instructions = []; // 0x00 : NOP

  instructions[0x00] = function () {}; // 0x01 : LD BC, nn


  instructions[0x01] = function () {
    pc = pc + 1 & 0xffff;
    c = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    b = core.mem_read(pc);
  }; // 0x02 : LD (BC), A


  instructions[0x02] = function () {
    core.mem_write(c | b << 8, a);
  }; // 0x03 : INC BC


  instructions[0x03] = function () {
    var result = c | b << 8;
    result += 1;
    c = result & 0xff;
    b = (result & 0xff00) >>> 8;
  }; // 0x04 : INC B


  instructions[0x04] = function () {
    b = do_inc(b);
  }; // 0x05 : DEC B


  instructions[0x05] = function () {
    b = do_dec(b);
  }; // 0x06 : LD B, n


  instructions[0x06] = function () {
    pc = pc + 1 & 0xffff;
    b = core.mem_read(pc);
  }; // 0x07 : RLCA


  instructions[0x07] = function () {
    // This instruction is implemented as a special case of the
    //  more general Z80-specific RLC instruction.
    // Specifially, RLCA is a version of RLC A that affects fewer flags.
    // The same applies to RRCA, RLA, and RRA.
    var temp_s = flags.S,
        temp_z = flags.Z,
        temp_p = flags.P;
    a = do_rlc(a);
    flags.S = temp_s;
    flags.Z = temp_z;
    flags.P = temp_p;
  }; // 0x08 : EX AF, AF'


  instructions[0x08] = function () {
    var temp = a;
    a = a_prime;
    a_prime = temp;
    temp = get_flags_register();
    set_flags_register(get_flags_prime());
    set_flags_prime(temp);
  }; // 0x09 : ADD HL, BC


  instructions[0x09] = function () {
    do_hl_add(c | b << 8);
  }; // 0x0a : LD A, (BC)


  instructions[0x0a] = function () {
    a = core.mem_read(c | b << 8);
  }; // 0x0b : DEC BC


  instructions[0x0b] = function () {
    var result = c | b << 8;
    result -= 1;
    c = result & 0xff;
    b = (result & 0xff00) >>> 8;
  }; // 0x0c : INC C


  instructions[0x0c] = function () {
    c = do_inc(c);
  }; // 0x0d : DEC C


  instructions[0x0d] = function () {
    c = do_dec(c);
  }; // 0x0e : LD C, n


  instructions[0x0e] = function () {
    pc = pc + 1 & 0xffff;
    c = core.mem_read(pc);
  }; // 0x0f : RRCA


  instructions[0x0f] = function () {
    var temp_s = flags.S,
        temp_z = flags.Z,
        temp_p = flags.P;
    a = do_rrc(a);
    flags.S = temp_s;
    flags.Z = temp_z;
    flags.P = temp_p;
  }; // 0x10 : DJNZ nn


  instructions[0x10] = function () {
    b = b - 1 & 0xff;
    do_conditional_relative_jump(b !== 0);
  }; // 0x11 : LD DE, nn


  instructions[0x11] = function () {
    pc = pc + 1 & 0xffff;
    e = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    d = core.mem_read(pc);
  }; // 0x12 : LD (DE), A


  instructions[0x12] = function () {
    core.mem_write(e | d << 8, a);
  }; // 0x13 : INC DE


  instructions[0x13] = function () {
    var result = e | d << 8;
    result += 1;
    e = result & 0xff;
    d = (result & 0xff00) >>> 8;
  }; // 0x14 : INC D


  instructions[0x14] = function () {
    d = do_inc(d);
  }; // 0x15 : DEC D


  instructions[0x15] = function () {
    d = do_dec(d);
  }; // 0x16 : LD D, n


  instructions[0x16] = function () {
    pc = pc + 1 & 0xffff;
    d = core.mem_read(pc);
  }; // 0x17 : RLA


  instructions[0x17] = function () {
    var temp_s = flags.S,
        temp_z = flags.Z,
        temp_p = flags.P;
    a = do_rl(a);
    flags.S = temp_s;
    flags.Z = temp_z;
    flags.P = temp_p;
  }; // 0x18 : JR n


  instructions[0x18] = function () {
    var offset = get_signed_offset_byte(core.mem_read(pc + 1 & 0xffff));
    pc = pc + offset + 1 & 0xffff;
  }; // 0x19 : ADD HL, DE


  instructions[0x19] = function () {
    do_hl_add(e | d << 8);
  }; // 0x1a : LD A, (DE)


  instructions[0x1a] = function () {
    a = core.mem_read(e | d << 8);
  }; // 0x1b : DEC DE


  instructions[0x1b] = function () {
    var result = e | d << 8;
    result -= 1;
    e = result & 0xff;
    d = (result & 0xff00) >>> 8;
  }; // 0x1c : INC E


  instructions[0x1c] = function () {
    e = do_inc(e);
  }; // 0x1d : DEC E


  instructions[0x1d] = function () {
    e = do_dec(e);
  }; // 0x1e : LD E, n


  instructions[0x1e] = function () {
    pc = pc + 1 & 0xffff;
    e = core.mem_read(pc);
  }; // 0x1f : RRA


  instructions[0x1f] = function () {
    var temp_s = flags.S,
        temp_z = flags.Z,
        temp_p = flags.P;
    a = do_rr(a);
    flags.S = temp_s;
    flags.Z = temp_z;
    flags.P = temp_p;
  }; // 0x20 : JR NZ, n


  instructions[0x20] = function () {
    do_conditional_relative_jump(!flags.Z);
  }; // 0x21 : LD HL, nn


  instructions[0x21] = function () {
    pc = pc + 1 & 0xffff;
    l = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    h = core.mem_read(pc);
  }; // 0x22 : LD (nn), HL


  instructions[0x22] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    core.mem_write(address, l);
    core.mem_write(address + 1 & 0xffff, h);
  }; // 0x23 : INC HL


  instructions[0x23] = function () {
    var result = l | h << 8;
    result += 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
  }; // 0x24 : INC H


  instructions[0x24] = function () {
    h = do_inc(h);
  }; // 0x25 : DEC H


  instructions[0x25] = function () {
    h = do_dec(h);
  }; // 0x26 : LD H, n


  instructions[0x26] = function () {
    pc = pc + 1 & 0xffff;
    h = core.mem_read(pc);
  }; // 0x27 : DAA


  instructions[0x27] = function () {
    var temp = a;

    if (!flags.N) {
      if (flags.H || (a & 0x0f) > 9) temp += 0x06;
      if (flags.C || a > 0x99) temp += 0x60;
    } else {
      if (flags.H || (a & 0x0f) > 9) temp -= 0x06;
      if (flags.C || a > 0x99) temp -= 0x60;
    }

    flags.S = temp & 0x80 ? 1 : 0;
    flags.Z = !(temp & 0xff) ? 1 : 0;
    flags.H = a & 0x10 ^ temp & 0x10 ? 1 : 0;
    flags.P = get_parity(temp & 0xff); // DAA never clears the carry flag if it was already set,
    //  but it is able to set the carry flag if it was clear.
    // Don't ask me, I don't know.
    // Note also that we check for a BCD carry, instead of the usual.

    flags.C = flags.C || a > 0x99 ? 1 : 0;
    a = temp & 0xff;
    update_xy_flags(a);
  }; // 0x28 : JR Z, n


  instructions[0x28] = function () {
    do_conditional_relative_jump(!!flags.Z);
  }; // 0x29 : ADD HL, HL


  instructions[0x29] = function () {
    do_hl_add(l | h << 8);
  }; // 0x2a : LD HL, (nn)


  instructions[0x2a] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    l = core.mem_read(address);
    h = core.mem_read(address + 1 & 0xffff);
  }; // 0x2b : DEC HL


  instructions[0x2b] = function () {
    var result = l | h << 8;
    result -= 1;
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
  }; // 0x2c : INC L


  instructions[0x2c] = function () {
    l = do_inc(l);
  }; // 0x2d : DEC L


  instructions[0x2d] = function () {
    l = do_dec(l);
  }; // 0x2e : LD L, n


  instructions[0x2e] = function () {
    pc = pc + 1 & 0xffff;
    l = core.mem_read(pc);
  }; // 0x2f : CPL


  instructions[0x2f] = function () {
    a = ~a & 0xff;
    flags.N = 1;
    flags.H = 1;
    update_xy_flags(a);
  }; // 0x30 : JR NC, n


  instructions[0x30] = function () {
    do_conditional_relative_jump(!flags.C);
  }; // 0x31 : LD SP, nn


  instructions[0x31] = function () {
    sp = core.mem_read(pc + 1 & 0xffff) | core.mem_read(pc + 2 & 0xffff) << 8;
    pc = pc + 2 & 0xffff;
  }; // 0x32 : LD (nn), A


  instructions[0x32] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    core.mem_write(address, a);
  }; // 0x33 : INC SP


  instructions[0x33] = function () {
    sp = sp + 1 & 0xffff;
  }; // 0x34 : INC (HL)


  instructions[0x34] = function () {
    var address = l | h << 8;
    core.mem_write(address, do_inc(core.mem_read(address)));
  }; // 0x35 : DEC (HL)


  instructions[0x35] = function () {
    var address = l | h << 8;
    core.mem_write(address, do_dec(core.mem_read(address)));
  }; // 0x36 : LD (HL), n


  instructions[0x36] = function () {
    pc = pc + 1 & 0xffff;
    core.mem_write(l | h << 8, core.mem_read(pc));
  }; // 0x37 : SCF


  instructions[0x37] = function () {
    flags.N = 0;
    flags.H = 0;
    flags.C = 1;
    update_xy_flags(a);
  }; // 0x38 : JR C, n


  instructions[0x38] = function () {
    do_conditional_relative_jump(!!flags.C);
  }; // 0x39 : ADD HL, SP


  instructions[0x39] = function () {
    do_hl_add(sp);
  }; // 0x3a : LD A, (nn)


  instructions[0x3a] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    a = core.mem_read(address);
  }; // 0x3b : DEC SP


  instructions[0x3b] = function () {
    sp = sp - 1 & 0xffff;
  }; // 0x3c : INC A


  instructions[0x3c] = function () {
    a = do_inc(a);
  }; // 0x3d : DEC A


  instructions[0x3d] = function () {
    a = do_dec(a);
  }; // 0x3e : LD A, n


  instructions[0x3e] = function () {
    a = core.mem_read(pc + 1 & 0xffff);
    pc = pc + 1 & 0xffff;
  }; // 0x3f : CCF


  instructions[0x3f] = function () {
    flags.N = 0;
    flags.H = flags.C;
    flags.C = flags.C ? 0 : 1;
    update_xy_flags(a);
  }; // 0xc0 : RET NZ


  instructions[0xc0] = function () {
    do_conditional_return(!flags.Z);
  }; // 0xc1 : POP BC


  instructions[0xc1] = function () {
    var result = pop_word();
    c = result & 0xff;
    b = (result & 0xff00) >>> 8;
  }; // 0xc2 : JP NZ, nn


  instructions[0xc2] = function () {
    do_conditional_absolute_jump(!flags.Z);
  }; // 0xc3 : JP nn


  instructions[0xc3] = function () {
    pc = core.mem_read(pc + 1 & 0xffff) | core.mem_read(pc + 2 & 0xffff) << 8;
    pc = pc - 1 & 0xffff;
  }; // 0xc4 : CALL NZ, nn


  instructions[0xc4] = function () {
    do_conditional_call(!flags.Z);
  }; // 0xc5 : PUSH BC


  instructions[0xc5] = function () {
    push_word(c | b << 8);
  }; // 0xc6 : ADD A, n


  instructions[0xc6] = function () {
    pc = pc + 1 & 0xffff;
    do_add(core.mem_read(pc));
  }; // 0xc7 : RST 00h


  instructions[0xc7] = function () {
    do_reset(0x00);
  }; // 0xc8 : RET Z


  instructions[0xc8] = function () {
    do_conditional_return(!!flags.Z);
  }; // 0xc9 : RET


  instructions[0xc9] = function () {
    pc = pop_word() - 1 & 0xffff;
  }; // 0xca : JP Z, nn


  instructions[0xca] = function () {
    do_conditional_absolute_jump(!!flags.Z);
  }; // 0xcb : CB Prefix


  instructions[0xcb] = function () {
    // R is incremented at the start of the second instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    r = r & 0x80 | (r & 0x7f) + 1 & 0x7f; // We don't have a table for this prefix,
    //  the instructions are all so uniform that we can directly decode them.

    pc = pc + 1 & 0xffff;
    var opcode = core.mem_read(pc),
        bit_number = (opcode & 0x38) >>> 3,
        reg_code = opcode & 0x07;

    if (opcode < 0x40) {
      // Shift/rotate instructions
      var op_array = [do_rlc, do_rrc, do_rl, do_rr, do_sla, do_sra, do_sll, do_srl];
      if (reg_code === 0) b = op_array[bit_number](b);else if (reg_code === 1) c = op_array[bit_number](c);else if (reg_code === 2) d = op_array[bit_number](d);else if (reg_code === 3) e = op_array[bit_number](e);else if (reg_code === 4) h = op_array[bit_number](h);else if (reg_code === 5) l = op_array[bit_number](l);else if (reg_code === 6) core.mem_write(l | h << 8, op_array[bit_number](core.mem_read(l | h << 8)));else if (reg_code === 7) a = op_array[bit_number](a);
    } else if (opcode < 0x80) {
      // BIT instructions
      if (reg_code === 0) flags.Z = !(b & 1 << bit_number) ? 1 : 0;else if (reg_code === 1) flags.Z = !(c & 1 << bit_number) ? 1 : 0;else if (reg_code === 2) flags.Z = !(d & 1 << bit_number) ? 1 : 0;else if (reg_code === 3) flags.Z = !(e & 1 << bit_number) ? 1 : 0;else if (reg_code === 4) flags.Z = !(h & 1 << bit_number) ? 1 : 0;else if (reg_code === 5) flags.Z = !(l & 1 << bit_number) ? 1 : 0;else if (reg_code === 6) flags.Z = !(core.mem_read(l | h << 8) & 1 << bit_number) ? 1 : 0;else if (reg_code === 7) flags.Z = !(a & 1 << bit_number) ? 1 : 0;
      flags.N = 0;
      flags.H = 1;
      flags.P = flags.Z;
      flags.S = bit_number === 7 && !flags.Z ? 1 : 0; // For the BIT n, (HL) instruction, the X and Y flags are obtained
      //  from what is apparently an internal temporary register used for
      //  some of the 16-bit arithmetic instructions.
      // I haven't implemented that register here,
      //  so for now we'll set X and Y the same way for every BIT opcode,
      //  which means that they will usually be wrong for BIT n, (HL).

      flags.Y = bit_number === 5 && !flags.Z ? 1 : 0;
      flags.X = bit_number === 3 && !flags.Z ? 1 : 0;
    } else if (opcode < 0xc0) {
      // RES instructions
      if (reg_code === 0) b &= 0xff & ~(1 << bit_number);else if (reg_code === 1) c &= 0xff & ~(1 << bit_number);else if (reg_code === 2) d &= 0xff & ~(1 << bit_number);else if (reg_code === 3) e &= 0xff & ~(1 << bit_number);else if (reg_code === 4) h &= 0xff & ~(1 << bit_number);else if (reg_code === 5) l &= 0xff & ~(1 << bit_number);else if (reg_code === 6) core.mem_write(l | h << 8, core.mem_read(l | h << 8) & ~(1 << bit_number));else if (reg_code === 7) a &= 0xff & ~(1 << bit_number);
    } else {
      // SET instructions
      if (reg_code === 0) b |= 1 << bit_number;else if (reg_code === 1) c |= 1 << bit_number;else if (reg_code === 2) d |= 1 << bit_number;else if (reg_code === 3) e |= 1 << bit_number;else if (reg_code === 4) h |= 1 << bit_number;else if (reg_code === 5) l |= 1 << bit_number;else if (reg_code === 6) core.mem_write(l | h << 8, core.mem_read(l | h << 8) | 1 << bit_number);else if (reg_code === 7) a |= 1 << bit_number;
    }

    cycle_counter += cycle_counts_cb[opcode];
  }; // 0xcc : CALL Z, nn


  instructions[0xcc] = function () {
    do_conditional_call(!!flags.Z);
  }; // 0xcd : CALL nn


  instructions[0xcd] = function () {
    push_word(pc + 3 & 0xffff);
    pc = core.mem_read(pc + 1 & 0xffff) | core.mem_read(pc + 2 & 0xffff) << 8;
    pc = pc - 1 & 0xffff;
  }; // 0xce : ADC A, n


  instructions[0xce] = function () {
    pc = pc + 1 & 0xffff;
    do_adc(core.mem_read(pc));
  }; // 0xcf : RST 08h


  instructions[0xcf] = function () {
    do_reset(0x08);
  }; // 0xd0 : RET NC


  instructions[0xd0] = function () {
    do_conditional_return(!flags.C);
  }; // 0xd1 : POP DE


  instructions[0xd1] = function () {
    var result = pop_word();
    e = result & 0xff;
    d = (result & 0xff00) >>> 8;
  }; // 0xd2 : JP NC, nn


  instructions[0xd2] = function () {
    do_conditional_absolute_jump(!flags.C);
  }; // 0xd3 : OUT (n), A


  instructions[0xd3] = function () {
    pc = pc + 1 & 0xffff;
    core.io_write(a << 8 | core.mem_read(pc), a);
  }; // 0xd4 : CALL NC, nn


  instructions[0xd4] = function () {
    do_conditional_call(!flags.C);
  }; // 0xd5 : PUSH DE


  instructions[0xd5] = function () {
    push_word(e | d << 8);
  }; // 0xd6 : SUB n


  instructions[0xd6] = function () {
    pc = pc + 1 & 0xffff;
    do_sub(core.mem_read(pc));
  }; // 0xd7 : RST 10h


  instructions[0xd7] = function () {
    do_reset(0x10);
  }; // 0xd8 : RET C


  instructions[0xd8] = function () {
    do_conditional_return(!!flags.C);
  }; // 0xd9 : EXX


  instructions[0xd9] = function () {
    var temp = b;
    b = b_prime;
    b_prime = temp;
    temp = c;
    c = c_prime;
    c_prime = temp;
    temp = d;
    d = d_prime;
    d_prime = temp;
    temp = e;
    e = e_prime;
    e_prime = temp;
    temp = h;
    h = h_prime;
    h_prime = temp;
    temp = l;
    l = l_prime;
    l_prime = temp;
  }; // 0xda : JP C, nn


  instructions[0xda] = function () {
    do_conditional_absolute_jump(!!flags.C);
  }; // 0xdb : IN A, (n)


  instructions[0xdb] = function () {
    pc = pc + 1 & 0xffff;
    a = core.io_read(a << 8 | core.mem_read(pc));
  }; // 0xdc : CALL C, nn


  instructions[0xdc] = function () {
    do_conditional_call(!!flags.C);
  }; // 0xdd : DD Prefix (IX instructions)


  instructions[0xdd] = function () {
    // R is incremented at the start of the second instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    r = r & 0x80 | (r & 0x7f) + 1 & 0x7f;
    pc = pc + 1 & 0xffff;
    var opcode = core.mem_read(pc),
        func = dd_instructions[opcode];

    if (func) {
      //func = func.bind(this);
      func();
      cycle_counter += cycle_counts_dd[opcode];
    } else {
      // Apparently if a DD opcode doesn't exist,
      //  it gets treated as an unprefixed opcode.
      // What we'll do to handle that is just back up the
      //  program counter, so that this byte gets decoded
      //  as a normal instruction.
      pc = pc - 1 & 0xffff; // And we'll add in the cycle count for a NOP.

      cycle_counter += cycle_counts[0];
    }
  }; // 0xde : SBC n


  instructions[0xde] = function () {
    pc = pc + 1 & 0xffff;
    do_sbc(core.mem_read(pc));
  }; // 0xdf : RST 18h


  instructions[0xdf] = function () {
    do_reset(0x18);
  }; // 0xe0 : RET PO


  instructions[0xe0] = function () {
    do_conditional_return(!flags.P);
  }; // 0xe1 : POP HL


  instructions[0xe1] = function () {
    var result = pop_word();
    l = result & 0xff;
    h = (result & 0xff00) >>> 8;
  }; // 0xe2 : JP PO, (nn)


  instructions[0xe2] = function () {
    do_conditional_absolute_jump(!flags.P);
  }; // 0xe3 : EX (SP), HL


  instructions[0xe3] = function () {
    var temp = core.mem_read(sp);
    core.mem_write(sp, l);
    l = temp;
    temp = core.mem_read(sp + 1 & 0xffff);
    core.mem_write(sp + 1 & 0xffff, h);
    h = temp;
  }; // 0xe4 : CALL PO, nn


  instructions[0xe4] = function () {
    do_conditional_call(!flags.P);
  }; // 0xe5 : PUSH HL


  instructions[0xe5] = function () {
    push_word(l | h << 8);
  }; // 0xe6 : AND n


  instructions[0xe6] = function () {
    pc = pc + 1 & 0xffff;
    do_and(core.mem_read(pc));
  }; // 0xe7 : RST 20h


  instructions[0xe7] = function () {
    do_reset(0x20);
  }; // 0xe8 : RET PE


  instructions[0xe8] = function () {
    do_conditional_return(!!flags.P);
  }; // 0xe9 : JP (HL)


  instructions[0xe9] = function () {
    pc = l | h << 8;
    pc = pc - 1 & 0xffff;
  }; // 0xea : JP PE, nn


  instructions[0xea] = function () {
    do_conditional_absolute_jump(!!flags.P);
  }; // 0xeb : EX DE, HL


  instructions[0xeb] = function () {
    var temp = d;
    d = h;
    h = temp;
    temp = e;
    e = l;
    l = temp;
  }; // 0xec : CALL PE, nn


  instructions[0xec] = function () {
    do_conditional_call(!!flags.P);
  }; // 0xed : ED Prefix


  instructions[0xed] = function () {
    // R is incremented at the start of the second instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    r = r & 0x80 | (r & 0x7f) + 1 & 0x7f;
    pc = pc + 1 & 0xffff;
    var opcode = core.mem_read(pc),
        func = ed_instructions[opcode];

    if (func) {
      //func = func.bind(this);
      func();
      cycle_counter += cycle_counts_ed[opcode];
    } else {
      // If the opcode didn't exist, the whole thing is a two-byte NOP.
      cycle_counter += cycle_counts[0];
    }
  }; // 0xee : XOR n


  instructions[0xee] = function () {
    pc = pc + 1 & 0xffff;
    do_xor(core.mem_read(pc));
  }; // 0xef : RST 28h


  instructions[0xef] = function () {
    do_reset(0x28);
  }; // 0xf0 : RET P


  instructions[0xf0] = function () {
    do_conditional_return(!flags.S);
  }; // 0xf1 : POP AF


  instructions[0xf1] = function () {
    var result = pop_word();
    set_flags_register(result & 0xff);
    a = (result & 0xff00) >>> 8;
  }; // 0xf2 : JP P, nn


  instructions[0xf2] = function () {
    do_conditional_absolute_jump(!flags.S);
  }; // 0xf3 : DI


  instructions[0xf3] = function () {
    // DI doesn't actually take effect until after the next instruction.
    do_delayed_di = true;
  }; // 0xf4 : CALL P, nn


  instructions[0xf4] = function () {
    do_conditional_call(!flags.S);
  }; // 0xf5 : PUSH AF


  instructions[0xf5] = function () {
    push_word(get_flags_register() | a << 8);
  }; // 0xf6 : OR n


  instructions[0xf6] = function () {
    pc = pc + 1 & 0xffff;
    do_or(core.mem_read(pc));
  }; // 0xf7 : RST 30h


  instructions[0xf7] = function () {
    do_reset(0x30);
  }; // 0xf8 : RET M


  instructions[0xf8] = function () {
    do_conditional_return(!!flags.S);
  }; // 0xf9 : LD SP, HL


  instructions[0xf9] = function () {
    sp = l | h << 8;
  }; // 0xfa : JP M, nn


  instructions[0xfa] = function () {
    do_conditional_absolute_jump(!!flags.S);
  }; // 0xfb : EI


  instructions[0xfb] = function () {
    // EI doesn't actually take effect until after the next instruction.
    do_delayed_ei = true;
  }; // 0xfc : CALL M, nn


  instructions[0xfc] = function () {
    do_conditional_call(!!flags.S);
  }; // 0xfd : FD Prefix (IY instructions)


  instructions[0xfd] = function () {
    // R is incremented at the start of the second instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    r = r & 0x80 | (r & 0x7f) + 1 & 0x7f;
    pc = pc + 1 & 0xffff;
    var opcode = core.mem_read(pc),
        func = dd_instructions[opcode];

    if (func) {
      // Rather than copy and paste all the IX instructions into IY instructions,
      //  what we'll do is sneakily copy IY into IX, run the IX instruction,
      //  and then copy the result into IY and restore the old IX.
      var temp = ix;
      ix = iy; //func = func.bind(this);

      func();
      iy = ix;
      ix = temp;
      cycle_counter += cycle_counts_dd[opcode];
    } else {
      // Apparently if an FD opcode doesn't exist,
      //  it gets treated as an unprefixed opcode.
      // What we'll do to handle that is just back up the
      //  program counter, so that this byte gets decoded
      //  as a normal instruction.
      pc = pc - 1 & 0xffff; // And we'll add in the cycle count for a NOP.

      cycle_counter += cycle_counts[0];
    }
  }; // 0xfe : CP n


  instructions[0xfe] = function () {
    pc = pc + 1 & 0xffff;
    do_cp(core.mem_read(pc));
  }; // 0xff : RST 38h


  instructions[0xff] = function () {
    do_reset(0x38);
  }; ///////////////////////////////////////////////////////////////////////////////
  /// This table of ED opcodes is pretty sparse;
  ///  there are not very many valid ED-prefixed opcodes in the Z80,
  ///  and many of the ones that are valid are not documented.
  ///////////////////////////////////////////////////////////////////////////////


  let ed_instructions = []; // 0x40 : IN B, (C)

  ed_instructions[0x40] = function () {
    b = do_in(b << 8 | c);
  }; // 0x41 : OUT (C), B


  ed_instructions[0x41] = function () {
    core.io_write(b << 8 | c, b);
  }; // 0x42 : SBC HL, BC


  ed_instructions[0x42] = function () {
    do_hl_sbc(c | b << 8);
  }; // 0x43 : LD (nn), BC


  ed_instructions[0x43] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    core.mem_write(address, c);
    core.mem_write(address + 1 & 0xffff, b);
  }; // 0x44 : NEG


  ed_instructions[0x44] = function () {
    do_neg();
  }; // 0x45 : RETN


  ed_instructions[0x45] = function () {
    pc = pop_word() - 1 & 0xffff;
    iff1 = iff2;
  }; // 0x46 : IM 0


  ed_instructions[0x46] = function () {
    imode = 0;
  }; // 0x47 : LD I, A


  ed_instructions[0x47] = function () {
    i = a;
  }; // 0x48 : IN C, (C)


  ed_instructions[0x48] = function () {
    c = do_in(b << 8 | c);
  }; // 0x49 : OUT (C), C


  ed_instructions[0x49] = function () {
    core.io_write(b << 8 | c, c);
  }; // 0x4a : ADC HL, BC


  ed_instructions[0x4a] = function () {
    do_hl_adc(c | b << 8);
  }; // 0x4b : LD BC, (nn)


  ed_instructions[0x4b] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    c = core.mem_read(address);
    b = core.mem_read(address + 1 & 0xffff);
  }; // 0x4c : NEG (Undocumented)


  ed_instructions[0x4c] = function () {
    do_neg();
  }; // 0x4d : RETI


  ed_instructions[0x4d] = function () {
    pc = pop_word() - 1 & 0xffff;
  }; // 0x4e : IM 0 (Undocumented)


  ed_instructions[0x4e] = function () {
    imode = 0;
  }; // 0x4f : LD R, A


  ed_instructions[0x4f] = function () {
    r = a;
  }; // 0x50 : IN D, (C)


  ed_instructions[0x50] = function () {
    d = do_in(b << 8 | c);
  }; // 0x51 : OUT (C), D


  ed_instructions[0x51] = function () {
    core.io_write(b << 8 | c, d);
  }; // 0x52 : SBC HL, DE


  ed_instructions[0x52] = function () {
    do_hl_sbc(e | d << 8);
  }; // 0x53 : LD (nn), DE


  ed_instructions[0x53] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    core.mem_write(address, e);
    core.mem_write(address + 1 & 0xffff, d);
  }; // 0x54 : NEG (Undocumented)


  ed_instructions[0x54] = function () {
    do_neg();
  }; // 0x55 : RETN


  ed_instructions[0x55] = function () {
    pc = pop_word() - 1 & 0xffff;
    iff1 = iff2;
  }; // 0x56 : IM 1


  ed_instructions[0x56] = function () {
    imode = 1;
  }; // 0x57 : LD A, I


  ed_instructions[0x57] = function () {
    a = i;
    flags.S = i & 0x80 ? 1 : 0;
    flags.Z = i ? 0 : 1;
    flags.H = 0;
    flags.P = iff2;
    flags.N = 0;
  }; // 0x58 : IN E, (C)


  ed_instructions[0x58] = function () {
    e = do_in(b << 8 | c);
  }; // 0x59 : OUT (C), E


  ed_instructions[0x59] = function () {
    core.io_write(b << 8 | c, e);
  }; // 0x5a : ADC HL, DE


  ed_instructions[0x5a] = function () {
    do_hl_adc(e | d << 8);
  }; // 0x5b : LD DE, (nn)


  ed_instructions[0x5b] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    e = core.mem_read(address);
    d = core.mem_read(address + 1 & 0xffff);
  }; // 0x5c : NEG (Undocumented)


  ed_instructions[0x5c] = function () {
    do_neg();
  }; // 0x5d : RETN


  ed_instructions[0x5d] = function () {
    pc = pop_word() - 1 & 0xffff;
    iff1 = iff2;
  }; // 0x5e : IM 2


  ed_instructions[0x5e] = function () {
    imode = 2;
  }; // 0x5f : LD A, R


  ed_instructions[0x5f] = function () {
    a = r;
    flags.P = iff2;
  }; // 0x60 : IN H, (C)


  ed_instructions[0x60] = function () {
    h = do_in(b << 8 | c);
  }; // 0x61 : OUT (C), H


  ed_instructions[0x61] = function () {
    core.io_write(b << 8 | c, h);
  }; // 0x62 : SBC HL, HL


  ed_instructions[0x62] = function () {
    do_hl_sbc(l | h << 8);
  }; // 0x63 : LD (nn), HL (Undocumented)


  ed_instructions[0x63] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    core.mem_write(address, l);
    core.mem_write(address + 1 & 0xffff, h);
  }; // 0x64 : NEG (Undocumented)


  ed_instructions[0x64] = function () {
    do_neg();
  }; // 0x65 : RETN


  ed_instructions[0x65] = function () {
    pc = pop_word() - 1 & 0xffff;
    iff1 = iff2;
  }; // 0x66 : IM 0


  ed_instructions[0x66] = function () {
    imode = 0;
  }; // 0x67 : RRD


  ed_instructions[0x67] = function () {
    var hl_value = core.mem_read(l | h << 8);
    var temp1 = hl_value & 0x0f,
        temp2 = a & 0x0f;
    hl_value = (hl_value & 0xf0) >>> 4 | temp2 << 4;
    a = a & 0xf0 | temp1;
    core.mem_write(l | h << 8, hl_value);
    flags.S = a & 0x80 ? 1 : 0;
    flags.Z = a ? 0 : 1;
    flags.H = 0;
    flags.P = get_parity(a) ? 1 : 0;
    flags.N = 0;
    update_xy_flags(a);
  }; // 0x68 : IN L, (C)


  ed_instructions[0x68] = function () {
    l = do_in(b << 8 | c);
  }; // 0x69 : OUT (C), L


  ed_instructions[0x69] = function () {
    core.io_write(b << 8 | c, l);
  }; // 0x6a : ADC HL, HL


  ed_instructions[0x6a] = function () {
    do_hl_adc(l | h << 8);
  }; // 0x6b : LD HL, (nn) (Undocumented)


  ed_instructions[0x6b] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    l = core.mem_read(address);
    h = core.mem_read(address + 1 & 0xffff);
  }; // 0x6c : NEG (Undocumented)


  ed_instructions[0x6c] = function () {
    do_neg();
  }; // 0x6d : RETN


  ed_instructions[0x6d] = function () {
    pc = pop_word() - 1 & 0xffff;
    iff1 = iff2;
  }; // 0x6e : IM 0 (Undocumented)


  ed_instructions[0x6e] = function () {
    imode = 0;
  }; // 0x6f : RLD


  ed_instructions[0x6f] = function () {
    var hl_value = core.mem_read(l | h << 8);
    var temp1 = hl_value & 0xf0,
        temp2 = a & 0x0f;
    hl_value = (hl_value & 0x0f) << 4 | temp2;
    a = a & 0xf0 | temp1 >>> 4;
    core.mem_write(l | h << 8, hl_value);
    flags.S = a & 0x80 ? 1 : 0;
    flags.Z = a ? 0 : 1;
    flags.H = 0;
    flags.P = get_parity(a) ? 1 : 0;
    flags.N = 0;
    update_xy_flags(a);
  }; // 0x70 : IN (C) (Undocumented)


  ed_instructions[0x70] = function () {
    do_in(b << 8 | c);
  }; // 0x71 : OUT (C), 0 (Undocumented)


  ed_instructions[0x71] = function () {
    core.io_write(b << 8 | c, 0);
  }; // 0x72 : SBC HL, SP


  ed_instructions[0x72] = function () {
    do_hl_sbc(sp);
  }; // 0x73 : LD (nn), SP


  ed_instructions[0x73] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    core.mem_write(address, sp & 0xff);
    core.mem_write(address + 1 & 0xffff, sp >>> 8 & 0xff);
  }; // 0x74 : NEG (Undocumented)


  ed_instructions[0x74] = function () {
    do_neg();
  }; // 0x75 : RETN


  ed_instructions[0x75] = function () {
    pc = pop_word() - 1 & 0xffff;
    iff1 = iff2;
  }; // 0x76 : IM 1


  ed_instructions[0x76] = function () {
    imode = 1;
  }; // 0x78 : IN A, (C)


  ed_instructions[0x78] = function () {
    a = do_in(b << 8 | c);
  }; // 0x79 : OUT (C), A


  ed_instructions[0x79] = function () {
    core.io_write(b << 8 | c, a);
  }; // 0x7a : ADC HL, SP


  ed_instructions[0x7a] = function () {
    do_hl_adc(sp);
  }; // 0x7b : LD SP, (nn)


  ed_instructions[0x7b] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    sp = core.mem_read(address);
    sp |= core.mem_read(address + 1 & 0xffff) << 8;
  }; // 0x7c : NEG (Undocumented)


  ed_instructions[0x7c] = function () {
    do_neg();
  }; // 0x7d : RETN


  ed_instructions[0x7d] = function () {
    pc = pop_word() - 1 & 0xffff;
    iff1 = iff2;
  }; // 0x7e : IM 2


  ed_instructions[0x7e] = function () {
    imode = 2;
  }; // 0xa0 : LDI


  ed_instructions[0xa0] = function () {
    do_ldi();
  }; // 0xa1 : CPI


  ed_instructions[0xa1] = function () {
    do_cpi();
  }; // 0xa2 : INI


  ed_instructions[0xa2] = function () {
    do_ini();
  }; // 0xa3 : OUTI


  ed_instructions[0xa3] = function () {
    do_outi();
  }; // 0xa8 : LDD


  ed_instructions[0xa8] = function () {
    do_ldd();
  }; // 0xa9 : CPD


  ed_instructions[0xa9] = function () {
    do_cpd();
  }; // 0xaa : IND


  ed_instructions[0xaa] = function () {
    do_ind();
  }; // 0xab : OUTD


  ed_instructions[0xab] = function () {
    do_outd();
  }; // 0xb0 : LDIR


  ed_instructions[0xb0] = function () {
    do_ldi();

    if (b || c) {
      cycle_counter += 5;
      pc = pc - 2 & 0xffff;
    }
  }; // 0xb1 : CPIR


  ed_instructions[0xb1] = function () {
    do_cpi();

    if (!flags.Z && (b || c)) {
      cycle_counter += 5;
      pc = pc - 2 & 0xffff;
    }
  }; // 0xb2 : INIR


  ed_instructions[0xb2] = function () {
    do_ini();

    if (b) {
      cycle_counter += 5;
      pc = pc - 2 & 0xffff;
    }
  }; // 0xb3 : OTIR


  ed_instructions[0xb3] = function () {
    do_outi();

    if (b) {
      cycle_counter += 5;
      pc = pc - 2 & 0xffff;
    }
  }; // 0xb8 : LDDR


  ed_instructions[0xb8] = function () {
    do_ldd();

    if (b || c) {
      cycle_counter += 5;
      pc = pc - 2 & 0xffff;
    }
  }; // 0xb9 : CPDR


  ed_instructions[0xb9] = function () {
    do_cpd();

    if (!flags.Z && (b || c)) {
      cycle_counter += 5;
      pc = pc - 2 & 0xffff;
    }
  }; // 0xba : INDR


  ed_instructions[0xba] = function () {
    do_ind();

    if (b) {
      cycle_counter += 5;
      pc = pc - 2 & 0xffff;
    }
  }; // 0xbb : OTDR


  ed_instructions[0xbb] = function () {
    do_outd();

    if (b) {
      cycle_counter += 5;
      pc = pc - 2 & 0xffff;
    }
  }; ///////////////////////////////////////////////////////////////////////////////
  /// Like ED, this table is quite sparse,
  ///  and many of the opcodes here are also undocumented.
  /// The undocumented instructions here are those that deal with only one byte
  ///  of the two-byte IX register; the bytes are designed IXH and IXL here.
  ///////////////////////////////////////////////////////////////////////////////


  let dd_instructions = []; // 0x09 : ADD IX, BC

  dd_instructions[0x09] = function () {
    do_ix_add(c | b << 8);
  }; // 0x19 : ADD IX, DE


  dd_instructions[0x19] = function () {
    do_ix_add(e | d << 8);
  }; // 0x21 : LD IX, nn


  dd_instructions[0x21] = function () {
    pc = pc + 1 & 0xffff;
    ix = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    ix |= core.mem_read(pc) << 8;
  }; // 0x22 : LD (nn), IX


  dd_instructions[0x22] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    core.mem_write(address, ix & 0xff);
    core.mem_write(address + 1 & 0xffff, ix >>> 8 & 0xff);
  }; // 0x23 : INC IX


  dd_instructions[0x23] = function () {
    ix = ix + 1 & 0xffff;
  }; // 0x24 : INC IXH (Undocumented)


  dd_instructions[0x24] = function () {
    ix = do_inc(ix >>> 8) << 8 | ix & 0xff;
  }; // 0x25 : DEC IXH (Undocumented)


  dd_instructions[0x25] = function () {
    ix = do_dec(ix >>> 8) << 8 | ix & 0xff;
  }; // 0x26 : LD IXH, n (Undocumented)


  dd_instructions[0x26] = function () {
    pc = pc + 1 & 0xffff;
    ix = core.mem_read(pc) << 8 | ix & 0xff;
  }; // 0x29 : ADD IX, IX


  dd_instructions[0x29] = function () {
    do_ix_add(ix);
  }; // 0x2a : LD IX, (nn)


  dd_instructions[0x2a] = function () {
    pc = pc + 1 & 0xffff;
    var address = core.mem_read(pc);
    pc = pc + 1 & 0xffff;
    address |= core.mem_read(pc) << 8;
    ix = core.mem_read(address);
    ix |= core.mem_read(address + 1 & 0xffff) << 8;
  }; // 0x2b : DEC IX


  dd_instructions[0x2b] = function () {
    ix = ix - 1 & 0xffff;
  }; // 0x2c : INC IXL (Undocumented)


  dd_instructions[0x2c] = function () {
    ix = do_inc(ix & 0xff) | ix & 0xff00;
  }; // 0x2d : DEC IXL (Undocumented)


  dd_instructions[0x2d] = function () {
    ix = do_dec(ix & 0xff) | ix & 0xff00;
  }; // 0x2e : LD IXL, n (Undocumented)


  dd_instructions[0x2e] = function () {
    pc = pc + 1 & 0xffff;
    ix = core.mem_read(pc) & 0xff | ix & 0xff00;
  }; // 0x34 : INC (IX+n)


  dd_instructions[0x34] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc)),
        value = core.mem_read(offset + ix & 0xffff);
    core.mem_write(offset + ix & 0xffff, do_inc(value));
  }; // 0x35 : DEC (IX+n)


  dd_instructions[0x35] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc)),
        value = core.mem_read(offset + ix & 0xffff);
    core.mem_write(offset + ix & 0xffff, do_dec(value));
  }; // 0x36 : LD (IX+n), n


  dd_instructions[0x36] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    pc = pc + 1 & 0xffff;
    core.mem_write(ix + offset & 0xffff, core.mem_read(pc));
  }; // 0x39 : ADD IX, SP


  dd_instructions[0x39] = function () {
    do_ix_add(sp);
  }; // 0x44 : LD B, IXH (Undocumented)


  dd_instructions[0x44] = function () {
    b = ix >>> 8 & 0xff;
  }; // 0x45 : LD B, IXL (Undocumented)


  dd_instructions[0x45] = function () {
    b = ix & 0xff;
  }; // 0x46 : LD B, (IX+n)


  dd_instructions[0x46] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    b = core.mem_read(ix + offset & 0xffff);
  }; // 0x4c : LD C, IXH (Undocumented)


  dd_instructions[0x4c] = function () {
    c = ix >>> 8 & 0xff;
  }; // 0x4d : LD C, IXL (Undocumented)


  dd_instructions[0x4d] = function () {
    c = ix & 0xff;
  }; // 0x4e : LD C, (IX+n)


  dd_instructions[0x4e] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    c = core.mem_read(ix + offset & 0xffff);
  }; // 0x54 : LD D, IXH (Undocumented)


  dd_instructions[0x54] = function () {
    d = ix >>> 8 & 0xff;
  }; // 0x55 : LD D, IXL (Undocumented)


  dd_instructions[0x55] = function () {
    d = ix & 0xff;
  }; // 0x56 : LD D, (IX+n)


  dd_instructions[0x56] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    d = core.mem_read(ix + offset & 0xffff);
  }; // 0x5c : LD E, IXH (Undocumented)


  dd_instructions[0x5c] = function () {
    e = ix >>> 8 & 0xff;
  }; // 0x5d : LD E, IXL (Undocumented)


  dd_instructions[0x5d] = function () {
    e = ix & 0xff;
  }; // 0x5e : LD E, (IX+n)


  dd_instructions[0x5e] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    e = core.mem_read(ix + offset & 0xffff);
  }; // 0x60 : LD IXH, B (Undocumented)


  dd_instructions[0x60] = function () {
    ix = ix & 0xff | b << 8;
  }; // 0x61 : LD IXH, C (Undocumented)


  dd_instructions[0x61] = function () {
    ix = ix & 0xff | c << 8;
  }; // 0x62 : LD IXH, D (Undocumented)


  dd_instructions[0x62] = function () {
    ix = ix & 0xff | d << 8;
  }; // 0x63 : LD IXH, E (Undocumented)


  dd_instructions[0x63] = function () {
    ix = ix & 0xff | e << 8;
  }; // 0x64 : LD IXH, IXH (Undocumented)


  dd_instructions[0x64] = function () {// No-op.
  }; // 0x65 : LD IXH, IXL (Undocumented)


  dd_instructions[0x65] = function () {
    ix = ix & 0xff | (ix & 0xff) << 8;
  }; // 0x66 : LD H, (IX+n)


  dd_instructions[0x66] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    h = core.mem_read(ix + offset & 0xffff);
  }; // 0x67 : LD IXH, A (Undocumented)


  dd_instructions[0x67] = function () {
    ix = ix & 0xff | a << 8;
  }; // 0x68 : LD IXL, B (Undocumented)


  dd_instructions[0x68] = function () {
    ix = ix & 0xff00 | b;
  }; // 0x69 : LD IXL, C (Undocumented)


  dd_instructions[0x69] = function () {
    ix = ix & 0xff00 | c;
  }; // 0x6a : LD IXL, D (Undocumented)


  dd_instructions[0x6a] = function () {
    ix = ix & 0xff00 | d;
  }; // 0x6b : LD IXL, E (Undocumented)


  dd_instructions[0x6b] = function () {
    ix = ix & 0xff00 | e;
  }; // 0x6c : LD IXL, IXH (Undocumented)


  dd_instructions[0x6c] = function () {
    ix = ix & 0xff00 | ix >>> 8;
  }; // 0x6d : LD IXL, IXL (Undocumented)


  dd_instructions[0x6d] = function () {// No-op.
  }; // 0x6e : LD L, (IX+n)


  dd_instructions[0x6e] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    l = core.mem_read(ix + offset & 0xffff);
  }; // 0x6f : LD IXL, A (Undocumented)


  dd_instructions[0x6f] = function () {
    ix = ix & 0xff00 | a;
  }; // 0x70 : LD (IX+n), B


  dd_instructions[0x70] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    core.mem_write(ix + offset & 0xffff, b);
  }; // 0x71 : LD (IX+n), C


  dd_instructions[0x71] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    core.mem_write(ix + offset & 0xffff, c);
  }; // 0x72 : LD (IX+n), D


  dd_instructions[0x72] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    core.mem_write(ix + offset & 0xffff, d);
  }; // 0x73 : LD (IX+n), E


  dd_instructions[0x73] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    core.mem_write(ix + offset & 0xffff, e);
  }; // 0x74 : LD (IX+n), H


  dd_instructions[0x74] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    core.mem_write(ix + offset & 0xffff, h);
  }; // 0x75 : LD (IX+n), L


  dd_instructions[0x75] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    core.mem_write(ix + offset & 0xffff, l);
  }; // 0x77 : LD (IX+n), A


  dd_instructions[0x77] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    core.mem_write(ix + offset & 0xffff, a);
  }; // 0x7c : LD A, IXH (Undocumented)


  dd_instructions[0x7c] = function () {
    a = ix >>> 8 & 0xff;
  }; // 0x7d : LD A, IXL (Undocumented)


  dd_instructions[0x7d] = function () {
    a = ix & 0xff;
  }; // 0x7e : LD A, (IX+n)


  dd_instructions[0x7e] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    a = core.mem_read(ix + offset & 0xffff);
  }; // 0x84 : ADD A, IXH (Undocumented)


  dd_instructions[0x84] = function () {
    do_add(ix >>> 8 & 0xff);
  }; // 0x85 : ADD A, IXL (Undocumented)


  dd_instructions[0x85] = function () {
    do_add(ix & 0xff);
  }; // 0x86 : ADD A, (IX+n)


  dd_instructions[0x86] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    do_add(core.mem_read(ix + offset & 0xffff));
  }; // 0x8c : ADC A, IXH (Undocumented)


  dd_instructions[0x8c] = function () {
    do_adc(ix >>> 8 & 0xff);
  }; // 0x8d : ADC A, IXL (Undocumented)


  dd_instructions[0x8d] = function () {
    do_adc(ix & 0xff);
  }; // 0x8e : ADC A, (IX+n)


  dd_instructions[0x8e] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    do_adc(core.mem_read(ix + offset & 0xffff));
  }; // 0x94 : SUB IXH (Undocumented)


  dd_instructions[0x94] = function () {
    do_sub(ix >>> 8 & 0xff);
  }; // 0x95 : SUB IXL (Undocumented)


  dd_instructions[0x95] = function () {
    do_sub(ix & 0xff);
  }; // 0x96 : SUB A, (IX+n)


  dd_instructions[0x96] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    do_sub(core.mem_read(ix + offset & 0xffff));
  }; // 0x9c : SBC IXH (Undocumented)


  dd_instructions[0x9c] = function () {
    do_sbc(ix >>> 8 & 0xff);
  }; // 0x9d : SBC IXL (Undocumented)


  dd_instructions[0x9d] = function () {
    do_sbc(ix & 0xff);
  }; // 0x9e : SBC A, (IX+n)


  dd_instructions[0x9e] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    do_sbc(core.mem_read(ix + offset & 0xffff));
  }; // 0xa4 : AND IXH (Undocumented)


  dd_instructions[0xa4] = function () {
    do_and(ix >>> 8 & 0xff);
  }; // 0xa5 : AND IXL (Undocumented)


  dd_instructions[0xa5] = function () {
    do_and(ix & 0xff);
  }; // 0xa6 : AND A, (IX+n)


  dd_instructions[0xa6] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    do_and(core.mem_read(ix + offset & 0xffff));
  }; // 0xac : XOR IXH (Undocumented)


  dd_instructions[0xac] = function () {
    do_xor(ix >>> 8 & 0xff);
  }; // 0xad : XOR IXL (Undocumented)


  dd_instructions[0xad] = function () {
    do_xor(ix & 0xff);
  }; // 0xae : XOR A, (IX+n)


  dd_instructions[0xae] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    do_xor(core.mem_read(ix + offset & 0xffff));
  }; // 0xb4 : OR IXH (Undocumented)


  dd_instructions[0xb4] = function () {
    do_or(ix >>> 8 & 0xff);
  }; // 0xb5 : OR IXL (Undocumented)


  dd_instructions[0xb5] = function () {
    do_or(ix & 0xff);
  }; // 0xb6 : OR A, (IX+n)


  dd_instructions[0xb6] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    do_or(core.mem_read(ix + offset & 0xffff));
  }; // 0xbc : CP IXH (Undocumented)


  dd_instructions[0xbc] = function () {
    do_cp(ix >>> 8 & 0xff);
  }; // 0xbd : CP IXL (Undocumented)


  dd_instructions[0xbd] = function () {
    do_cp(ix & 0xff);
  }; // 0xbe : CP A, (IX+n)


  dd_instructions[0xbe] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    do_cp(core.mem_read(ix + offset & 0xffff));
  }; // 0xcb : CB Prefix (IX bit instructions)


  dd_instructions[0xcb] = function () {
    pc = pc + 1 & 0xffff;
    var offset = get_signed_offset_byte(core.mem_read(pc));
    pc = pc + 1 & 0xffff;
    var opcode = core.mem_read(pc),
        value; // As with the "normal" CB prefix, we implement the DDCB prefix
    //  by decoding the opcode directly, rather than using a table.

    if (opcode < 0x40) {
      // Shift and rotate instructions.
      var ddcb_functions = [do_rlc, do_rrc, do_rl, do_rr, do_sla, do_sra, do_sll, do_srl]; // Most of the opcodes in this range are not valid,
      //  so we map this opcode onto one of the ones that is.

      var func = ddcb_functions[(opcode & 0x38) >>> 3];
      value = func(core.mem_read(ix + offset & 0xffff));
      core.mem_write(ix + offset & 0xffff, value);
    } else {
      var bit_number = (opcode & 0x38) >>> 3;

      if (opcode < 0x80) {
        // BIT
        flags.N = 0;
        flags.H = 1;
        flags.Z = !(core.mem_read(ix + offset & 0xffff) & 1 << bit_number) ? 1 : 0;
        flags.P = flags.Z;
        flags.S = bit_number === 7 && !flags.Z ? 1 : 0;
      } else if (opcode < 0xc0) {
        // RES
        value = core.mem_read(ix + offset & 0xffff) & ~(1 << bit_number) & 0xff;
        core.mem_write(ix + offset & 0xffff, value);
      } else {
        // SET
        value = core.mem_read(ix + offset & 0xffff) | 1 << bit_number;
        core.mem_write(ix + offset & 0xffff, value);
      }
    } // This implements the undocumented shift, RES, and SET opcodes,
    //  which write their result to memory and also to an 8080 register.


    if (value !== undefined) {
      if ((opcode & 0x07) === 0) b = value;else if ((opcode & 0x07) === 1) c = value;else if ((opcode & 0x07) === 2) d = value;else if ((opcode & 0x07) === 3) e = value;else if ((opcode & 0x07) === 4) h = value;else if ((opcode & 0x07) === 5) l = value; // 6 is the documented opcode, which doesn't set a register.
      else if ((opcode & 0x07) === 7) a = value;
    }

    cycle_counter += cycle_counts_cb[opcode] + 8;
  }; // 0xe1 : POP IX


  dd_instructions[0xe1] = function () {
    ix = pop_word();
  }; // 0xe3 : EX (SP), IX


  dd_instructions[0xe3] = function () {
    var temp = ix;
    ix = core.mem_read(sp);
    ix |= core.mem_read(sp + 1 & 0xffff) << 8;
    core.mem_write(sp, temp & 0xff);
    core.mem_write(sp + 1 & 0xffff, temp >>> 8 & 0xff);
  }; // 0xe5 : PUSH IX


  dd_instructions[0xe5] = function () {
    push_word(ix);
  }; // 0xe9 : JP (IX)


  dd_instructions[0xe9] = function () {
    pc = ix - 1 & 0xffff;
  }; // 0xf9 : LD SP, IX


  dd_instructions[0xf9] = function () {
    sp = ix;
  }; ///////////////////////////////////////////////////////////////////////////////
  /// These tables contain the number of T cycles used for each instruction.
  /// In a few special cases, such as conditional control flow instructions,
  ///  additional cycles might be added to these values.
  /// The total number of cycles is the return value of run_instruction().
  ///////////////////////////////////////////////////////////////////////////////


  let cycle_counts = [4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4, 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4, 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4, 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11, 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11];
  let cycle_counts_ed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 0, 12, 12, 15, 20, 8, 14, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 16, 16, 16, 0, 0, 0, 0, 16, 16, 16, 16, 0, 0, 0, 0, 16, 16, 16, 16, 0, 0, 0, 0, 16, 16, 16, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let cycle_counts_cb = [8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8];
  let cycle_counts_dd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 14, 20, 10, 8, 8, 11, 0, 0, 15, 20, 10, 8, 8, 11, 0, 0, 0, 0, 0, 23, 23, 19, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8, 8, 8, 8, 8, 19, 8, 19, 19, 19, 19, 19, 19, 0, 19, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 8, 8, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 23, 0, 15, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0]; // There's tons of stuff in this object,
  //  but only these three functions are the public API.

  return {
    getState,
    setState,
    reset,
    reset1,
    run_instruction,
    interrupt
  };
}

exports.Z80 = Z80;
},{}],"node_modules/nrf-intel-hex/intel-hex.browser.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.MemoryMap = factory();
})(this, function () {
  'use strict';
  /**
   * Parser/writer for the "Intel hex" format.
   */

  /*
   * A regexp that matches lines in a .hex file.
   *
   * One hexadecimal character is matched by "[0-9A-Fa-f]".
   * Two hex characters are matched by "[0-9A-Fa-f]{2}"
   * Eight or more hex characters are matched by "[0-9A-Fa-f]{8,}"
   * A capture group of two hex characters is "([0-9A-Fa-f]{2})"
   *
   * Record mark         :
   * 8 or more hex chars  ([0-9A-Fa-f]{8,})
   * Checksum                              ([0-9A-Fa-f]{2})
   * Optional newline                                      (?:\r\n|\r|\n|)
   */

  var hexLineRegexp = /:([0-9A-Fa-f]{8,})([0-9A-Fa-f]{2})(?:\r\n|\r|\n|)/g; // Takes a Uint8Array as input,
  // Returns an integer in the 0-255 range.

  function checksum(bytes) {
    return -bytes.reduce(function (sum, v) {
      return sum + v;
    }, 0) & 0xFF;
  } // Takes two Uint8Arrays as input,
  // Returns an integer in the 0-255 range.


  function checksumTwo(array1, array2) {
    var partial1 = array1.reduce(function (sum, v) {
      return sum + v;
    }, 0);
    var partial2 = array2.reduce(function (sum, v) {
      return sum + v;
    }, 0);
    return -(partial1 + partial2) & 0xFF;
  } // Trivial utility. Converts a number to hex and pads with zeroes up to 2 characters.


  function hexpad(number) {
    return number.toString(16).toUpperCase().padStart(2, '0');
  } // Polyfill as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger


  Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };
  /**
   * @class MemoryMap
   *
   * Represents the contents of a memory layout, with main focus into (possibly sparse) blocks of data.
   *<br/>
   * A {@linkcode MemoryMap} acts as a subclass of
   * {@linkcode https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map|Map}.
   * In every entry of it, the key is the starting address of a data block (an integer number),
   * and the value is the <tt>Uint8Array</tt> with the data for that block.
   *<br/>
   * The main rationale for this is that a .hex file can contain a single block of contiguous
   * data starting at memory address 0 (and it's the common case for simple .hex files),
   * but complex files with several non-contiguous data blocks are also possible, thus
   * the need for a data structure on top of the <tt>Uint8Array</tt>s.
   *<br/>
   * In order to parse <tt>.hex</tt> files, use the {@linkcode MemoryMap.fromHex} <em>static</em> factory
   * method. In order to write <tt>.hex</tt> files, create a new {@linkcode MemoryMap} and call
   * its {@linkcode MemoryMap.asHexString} method.
   *
   * @extends Map
   * @example
   * import MemoryMap from 'nrf-intel-hex';
   *
   * let memMap1 = new MemoryMap();
   * let memMap2 = new MemoryMap([[0, new Uint8Array(1,2,3,4)]]);
   * let memMap3 = new MemoryMap({0: new Uint8Array(1,2,3,4)});
   * let memMap4 = new MemoryMap({0xCF0: new Uint8Array(1,2,3,4)});
   */


  var MemoryMap = function MemoryMap(blocks) {
    var this$1 = this;
    this._blocks = new Map();

    if (blocks && typeof blocks[Symbol.iterator] === 'function') {
      for (var tuple of blocks) {
        if (!(tuple instanceof Array) || tuple.length !== 2) {
          throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
        }

        this$1.set(tuple[0], tuple[1]);
      }
    } else if (typeof blocks === 'object') {
      // Try iterating through the object's keys
      var addrs = Object.keys(blocks);

      for (var addr of addrs) {
        this$1.set(parseInt(addr), blocks[addr]);
      }
    } else if (blocks !== undefined && blocks !== null) {
      throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
    }
  };

  var prototypeAccessors = {
    size: {
      configurable: true
    }
  };

  MemoryMap.prototype.set = function set(addr, value) {
    if (!Number.isInteger(addr)) {
      throw new Error('Address passed to MemoryMap is not an integer');
    }

    if (addr < 0) {
      throw new Error('Address passed to MemoryMap is negative');
    }

    if (!(value instanceof Uint8Array)) {
      throw new Error('Bytes passed to MemoryMap are not an Uint8Array');
    }

    return this._blocks.set(addr, value);
  }; // Delegate the following to the 'this._blocks' Map:


  MemoryMap.prototype.get = function get(addr) {
    return this._blocks.get(addr);
  };

  MemoryMap.prototype.clear = function clear() {
    return this._blocks.clear();
  };

  MemoryMap.prototype.delete = function delete$1(addr) {
    return this._blocks.delete(addr);
  };

  MemoryMap.prototype.entries = function entries() {
    return this._blocks.entries();
  };

  MemoryMap.prototype.forEach = function forEach(callback, that) {
    return this._blocks.forEach(callback, that);
  };

  MemoryMap.prototype.has = function has(addr) {
    return this._blocks.has(addr);
  };

  MemoryMap.prototype.keys = function keys() {
    return this._blocks.keys();
  };

  MemoryMap.prototype.values = function values() {
    return this._blocks.values();
  };

  prototypeAccessors.size.get = function () {
    return this._blocks.size;
  };

  MemoryMap.prototype[Symbol.iterator] = function () {
    return this._blocks[Symbol.iterator]();
  };
  /**
   * Parses a string containing data formatted in "Intel HEX" format, and
   * returns an instance of {@linkcode MemoryMap}.
   *<br/>
   * The insertion order of keys in the {@linkcode MemoryMap} is guaranteed to be strictly
   * ascending. In other words, when iterating through the {@linkcode MemoryMap}, the addresses
   * will be ordered in ascending order.
   *<br/>
   * The parser has an opinionated behaviour, and will throw a descriptive error if it
   * encounters some malformed input. Check the project's
   * {@link https://github.com/NordicSemiconductor/nrf-intel-hex#Features|README file} for details.
   *<br/>
   * If <tt>maxBlockSize</tt> is given, any contiguous data block larger than that will
   * be split in several blocks.
   *
   * @param {String} hexText The contents of a .hex file.
   * @param {Number} [maxBlockSize=Infinity] Maximum size of the returned <tt>Uint8Array</tt>s.
   *
   * @return {MemoryMap}
   *
   * @example
   * import MemoryMap from 'nrf-intel-hex';
   *
   * let intelHexString =
   * ":100000000102030405060708090A0B0C0D0E0F1068\n" +
   * ":00000001FF";
   *
   * let memMap = MemoryMap.fromHex(intelHexString);
   *
   * for (let [address, dataBlock] of memMap) {
   * console.log('Data block at ', address, ', bytes: ', dataBlock);
   * }
   */


  MemoryMap.fromHex = function fromHex(hexText, maxBlockSize) {
    if (maxBlockSize === void 0) maxBlockSize = Infinity;
    var blocks = new MemoryMap();
    var lastCharacterParsed = 0;
    var matchResult;
    var recordCount = 0; // Upper Linear Base Address, the 16 most significant bits (2 bytes) of
    // the current 32-bit (4-byte) address
    // In practice this is a offset that is summed to the "load offset" of the
    // data records

    var ulba = 0;
    hexLineRegexp.lastIndex = 0; // Reset the regexp, if not it would skip content when called twice

    while ((matchResult = hexLineRegexp.exec(hexText)) !== null) {
      recordCount++; // By default, a regexp loop ignores gaps between matches, but
      // we want to be aware of them.

      if (lastCharacterParsed !== matchResult.index) {
        throw new Error('Malformed hex file: Could not parse between characters ' + lastCharacterParsed + ' and ' + matchResult.index + ' ("' + hexText.substring(lastCharacterParsed, Math.min(matchResult.index, lastCharacterParsed + 16)).trim() + '")');
      }

      lastCharacterParsed = hexLineRegexp.lastIndex; // Give pretty names to the match's capture groups

      var recordStr = matchResult[1];
      var recordChecksum = matchResult[2]; // String to Uint8Array - https://stackoverflow.com/questions/43131242/how-to-convert-a-hexademical-string-of-data-to-an-arraybuffer-in-javascript

      var recordBytes = new Uint8Array(recordStr.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
      }));
      var recordLength = recordBytes[0];

      if (recordLength + 4 !== recordBytes.length) {
        throw new Error('Mismatched record length at record ' + recordCount + ' (' + matchResult[0].trim() + '), expected ' + recordLength + ' data bytes but actual length is ' + (recordBytes.length - 4));
      }

      var cs = checksum(recordBytes);

      if (parseInt(recordChecksum, 16) !== cs) {
        throw new Error('Checksum failed at record ' + recordCount + ' (' + matchResult[0].trim() + '), should be ' + cs.toString(16));
      }

      var offset = (recordBytes[1] << 8) + recordBytes[2];
      var recordType = recordBytes[3];
      var data = recordBytes.subarray(4);

      if (recordType === 0) {
        // Data record, contains data
        // Create a new block, at (upper linear base address + offset)
        if (blocks.has(ulba + offset)) {
          throw new Error('Duplicated data at record ' + recordCount + ' (' + matchResult[0].trim() + ')');
        }

        if (offset + data.length > 0x10000) {
          throw new Error('Data at record ' + recordCount + ' (' + matchResult[0].trim() + ') wraps over 0xFFFF. This would trigger ambiguous behaviour. Please restructure your data so that for every record the data offset plus the data length do not exceed 0xFFFF.');
        }

        blocks.set(ulba + offset, data);
      } else {
        // All non-data records must have a data offset of zero
        if (offset !== 0) {
          throw new Error('Record ' + recordCount + ' (' + matchResult[0].trim() + ') must have 0000 as data offset.');
        }

        switch (recordType) {
          case 1:
            // EOF
            if (lastCharacterParsed !== hexText.length) {
              // This record should be at the very end of the string
              throw new Error('There is data after an EOF record at record ' + recordCount);
            }

            return blocks.join(maxBlockSize);

          case 2:
            // Extended Segment Address Record
            // Sets the 16 most significant bits of the 20-bit Segment Base
            // Address for the subsequent data.
            ulba = (data[0] << 8) + data[1] << 4;
            break;

          case 3:
            // Start Segment Address Record
            // Do nothing. Record type 3 only applies to 16-bit Intel CPUs,
            // where it should reset the program counter (CS+IP CPU registers)
            break;

          case 4:
            // Extended Linear Address Record
            // Sets the 16 most significant (upper) bits of the 32-bit Linear Address
            // for the subsequent data
            ulba = (data[0] << 8) + data[1] << 16;
            break;

          case 5:
            // Start Linear Address Record
            // Do nothing. Record type 5 only applies to 32-bit Intel CPUs,
            // where it should reset the program counter (EIP CPU register)
            // It might have meaning for other CPU architectures
            // (see http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.faqs/ka9903.html )
            // but will be ignored nonetheless.
            break;

          default:
            throw new Error('Invalid record type 0x' + hexpad(recordType) + ' at record ' + recordCount + ' (should be between 0x00 and 0x05)');
        }
      }
    }

    if (recordCount) {
      throw new Error('No EOF record at end of file');
    } else {
      throw new Error('Malformed .hex file, could not parse any registers');
    }
  };
  /**
   * Returns a <strong>new</strong> instance of {@linkcode MemoryMap}, containing
   * the same data, but concatenating together those memory blocks that are adjacent.
   *<br/>
   * The insertion order of keys in the {@linkcode MemoryMap} is guaranteed to be strictly
   * ascending. In other words, when iterating through the {@linkcode MemoryMap}, the addresses
   * will be ordered in ascending order.
   *<br/>
   * If <tt>maxBlockSize</tt> is given, blocks will be concatenated together only
   * until the joined block reaches this size in bytes. This means that the output
   * {@linkcode MemoryMap} might have more entries than the input one.
   *<br/>
   * If there is any overlap between blocks, an error will be thrown.
   *<br/>
   * The returned {@linkcode MemoryMap} will use newly allocated memory.
   *
   * @param {Number} [maxBlockSize=Infinity] Maximum size of the <tt>Uint8Array</tt>s in the
   * returned {@linkcode MemoryMap}.
   *
   * @return {MemoryMap}
   */


  MemoryMap.prototype.join = function join(maxBlockSize) {
    var this$1 = this;
    if (maxBlockSize === void 0) maxBlockSize = Infinity; // First pass, create a Map of address→length of contiguous blocks

    var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
      return a - b;
    });
    var blockSizes = new Map();
    var lastBlockAddr = -1;
    var lastBlockEndAddr = -1;

    for (var i = 0, l = sortedKeys.length; i < l; i++) {
      var blockAddr = sortedKeys[i];
      var blockLength = this$1.get(sortedKeys[i]).length;

      if (lastBlockEndAddr === blockAddr && lastBlockEndAddr - lastBlockAddr < maxBlockSize) {
        // Grow when the previous end address equals the current,
        // and we don't go over the maximum block size.
        blockSizes.set(lastBlockAddr, blockSizes.get(lastBlockAddr) + blockLength);
        lastBlockEndAddr += blockLength;
      } else if (lastBlockEndAddr <= blockAddr) {
        // Else mark a new block.
        blockSizes.set(blockAddr, blockLength);
        lastBlockAddr = blockAddr;
        lastBlockEndAddr = blockAddr + blockLength;
      } else {
        throw new Error('Overlapping data around address 0x' + blockAddr.toString(16));
      }
    } // Second pass: allocate memory for the contiguous blocks and copy data around.


    var mergedBlocks = new MemoryMap();
    var mergingBlock;
    var mergingBlockAddr = -1;

    for (var i$1 = 0, l$1 = sortedKeys.length; i$1 < l$1; i$1++) {
      var blockAddr$1 = sortedKeys[i$1];

      if (blockSizes.has(blockAddr$1)) {
        mergingBlock = new Uint8Array(blockSizes.get(blockAddr$1));
        mergedBlocks.set(blockAddr$1, mergingBlock);
        mergingBlockAddr = blockAddr$1;
      }

      mergingBlock.set(this$1.get(blockAddr$1), blockAddr$1 - mergingBlockAddr);
    }

    return mergedBlocks;
  };
  /**
   * Given a {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map|<tt>Map</tt>}
   * of {@linkcode MemoryMap}s, indexed by a alphanumeric ID,
   * returns a <tt>Map</tt> of address to tuples (<tt>Arrays</tt>s of length 2) of the form
   * <tt>(id, Uint8Array)</tt>s.
   *<br/>
   * The scenario for using this is having several {@linkcode MemoryMap}s, from several calls to
   * {@link module:nrf-intel-hex~hexToArrays|hexToArrays}, each having a different identifier.
   * This function locates where those memory block sets overlap, and returns a <tt>Map</tt>
   * containing addresses as keys, and arrays as values. Each array will contain 1 or more
   * <tt>(id, Uint8Array)</tt> tuples: the identifier of the memory block set that has
   * data in that region, and the data itself. When memory block sets overlap, there will
   * be more than one tuple.
   *<br/>
   * The <tt>Uint8Array</tt>s in the output are
   * {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray|subarrays}
   * of the input data; new memory is <strong>not</strong> allocated for them.
   *<br/>
   * The insertion order of keys in the output <tt>Map</tt> is guaranteed to be strictly
   * ascending. In other words, when iterating through the <tt>Map</tt>, the addresses
   * will be ordered in ascending order.
   *<br/>
   * When two blocks overlap, the corresponding array of tuples will have the tuples ordered
   * in the insertion order of the input <tt>Map</tt> of block sets.
   *<br/>
   *
   * @param {Map.MemoryMap} memoryMaps The input memory block sets
   *
   * @example
   * import MemoryMap from 'nrf-intel-hex';
   *
   * let memMap1 = MemoryMap.fromHex( hexdata1 );
   * let memMap2 = MemoryMap.fromHex( hexdata2 );
   * let memMap3 = MemoryMap.fromHex( hexdata3 );
   *
   * let maps = new Map([
   *  ['file A', blocks1],
   *  ['file B', blocks2],
   *  ['file C', blocks3]
   * ]);
   *
   * let overlappings = MemoryMap.overlapMemoryMaps(maps);
   *
   * for (let [address, tuples] of overlappings) {
   * // if 'tuples' has length > 1, there is an overlap starting at 'address'
   *
   * for (let [address, tuples] of overlappings) {
   *     let [id, bytes] = tuple;
   *     // 'id' in this example is either 'file A', 'file B' or 'file C'
   * }
   * }
   * @return {Map.Array<mixed,Uint8Array>} The map of possibly overlapping memory blocks
   */


  MemoryMap.overlapMemoryMaps = function overlapMemoryMaps(memoryMaps) {
    // First pass: create a list of addresses where any block starts or ends.
    var cuts = new Set();

    for (var [, blocks] of memoryMaps) {
      for (var [address, block] of blocks) {
        cuts.add(address);
        cuts.add(address + block.length);
      }
    }

    var orderedCuts = Array.from(cuts.values()).sort(function (a, b) {
      return a - b;
    });
    var overlaps = new Map(); // Second pass: iterate through the cuts, get slices of every intersecting blockset

    var loop = function (i, l) {
      var cut = orderedCuts[i];
      var nextCut = orderedCuts[i + 1];
      var tuples = [];

      for (var [setId, blocks$1] of memoryMaps) {
        // Find the block with the highest address that is equal or lower to
        // the current cut (if any)
        var blockAddr = Array.from(blocks$1.keys()).reduce(function (acc, val) {
          if (val > cut) {
            return acc;
          }

          return Math.max(acc, val);
        }, -1);

        if (blockAddr !== -1) {
          var block$1 = blocks$1.get(blockAddr);
          var subBlockStart = cut - blockAddr;
          var subBlockEnd = nextCut - blockAddr;

          if (subBlockStart < block$1.length) {
            tuples.push([setId, block$1.subarray(subBlockStart, subBlockEnd)]);
          }
        }
      }

      if (tuples.length) {
        overlaps.set(cut, tuples);
      }
    };

    for (var i = 0, l = orderedCuts.length - 1; i < l; i++) loop(i, l);

    return overlaps;
  };
  /**
   * Given the output of the {@linkcode MemoryMap.overlapMemoryMaps|overlapMemoryMaps}
   * (a <tt>Map</tt> of address to an <tt>Array</tt> of <tt>(id, Uint8Array)</tt> tuples),
   * returns a {@linkcode MemoryMap}. This discards the IDs in the process.
   *<br/>
   * The output <tt>Map</tt> contains as many entries as the input one (using the same addresses
   * as keys), but the value for each entry will be the <tt>Uint8Array</tt> of the <b>last</b>
   * tuple for each address in the input data.
   *<br/>
   * The scenario is wanting to join together several parsed .hex files, not worrying about
   * their overlaps.
   *<br/>
   *
   * @param {Map.Array<mixed,Uint8Array>} overlaps The (possibly overlapping) input memory blocks
   * @return {MemoryMap} The flattened memory blocks
   */


  MemoryMap.flattenOverlaps = function flattenOverlaps(overlaps) {
    return new MemoryMap(Array.from(overlaps.entries()).map(function (ref) {
      var address = ref[0];
      var tuples = ref[1];
      return [address, tuples[tuples.length - 1][1]];
    }));
  };
  /**
   * Returns a new instance of {@linkcode MemoryMap}, where:
   *
   * <ul>
   *  <li>Each key (the start address of each <tt>Uint8Array</tt>) is a multiple of
   *<tt>pageSize</tt></li>
   *  <li>The size of each <tt>Uint8Array</tt> is exactly <tt>pageSize</tt></li>
   *  <li>Bytes from the input map to bytes in the output</li>
   *  <li>Bytes not in the input are replaced by a padding value</li>
   * </ul>
   *<br/>
   * The scenario is wanting to prepare pages of bytes for a write operation, where the write
   * operation affects a whole page/sector at once.
   *<br/>
   * The insertion order of keys in the output {@linkcode MemoryMap} is guaranteed
   * to be strictly ascending. In other words, when iterating through the
   * {@linkcode MemoryMap}, the addresses will be ordered in ascending order.
   *<br/>
   * The <tt>Uint8Array</tt>s in the output will be newly allocated.
   *<br/>
   *
   * @param {Number} [pageSize=1024] The size of the output pages, in bytes
   * @param {Number} [pad=0xFF] The byte value to use for padding
   * @return {MemoryMap}
   */


  MemoryMap.prototype.paginate = function paginate(pageSize, pad) {
    var this$1 = this;
    if (pageSize === void 0) pageSize = 1024;
    if (pad === void 0) pad = 0xFF;

    if (pageSize <= 0) {
      throw new Error('Page size must be greater than zero');
    }

    var outPages = new MemoryMap();
    var page;
    var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
      return a - b;
    });

    for (var i = 0, l = sortedKeys.length; i < l; i++) {
      var blockAddr = sortedKeys[i];
      var block = this$1.get(blockAddr);
      var blockLength = block.length;
      var blockEnd = blockAddr + blockLength;

      for (var pageAddr = blockAddr - blockAddr % pageSize; pageAddr < blockEnd; pageAddr += pageSize) {
        page = outPages.get(pageAddr);

        if (!page) {
          page = new Uint8Array(pageSize);
          page.fill(pad);
          outPages.set(pageAddr, page);
        }

        var offset = pageAddr - blockAddr;
        var subBlock = void 0;

        if (offset <= 0) {
          // First page which intersects the block
          subBlock = block.subarray(0, Math.min(pageSize + offset, blockLength));
          page.set(subBlock, -offset);
        } else {
          // Any other page which intersects the block
          subBlock = block.subarray(offset, offset + Math.min(pageSize, blockLength - offset));
          page.set(subBlock, 0);
        }
      }
    }

    return outPages;
  };
  /**
   * Locates the <tt>Uint8Array</tt> which contains the given offset,
   * and returns the four bytes held at that offset, as a 32-bit unsigned integer.
   *
   *<br/>
   * Behaviour is similar to {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint32|DataView.prototype.getUint32},
   * except that this operates over a {@linkcode MemoryMap} instead of
   * over an <tt>ArrayBuffer</tt>, and that this may return <tt>undefined</tt> if
   * the address is not <em>entirely</em> contained within one of the <tt>Uint8Array</tt>s.
   *<br/>
   *
   * @param {Number} offset The memory offset to read the data
   * @param {Boolean} [littleEndian=false] Whether to fetch the 4 bytes as a little- or big-endian integer
   * @return {Number|undefined} An unsigned 32-bit integer number
   */


  MemoryMap.prototype.getUint32 = function getUint32(offset, littleEndian) {
    var this$1 = this;
    var keys = Array.from(this.keys());

    for (var i = 0, l = keys.length; i < l; i++) {
      var blockAddr = keys[i];
      var block = this$1.get(blockAddr);
      var blockLength = block.length;
      var blockEnd = blockAddr + blockLength;

      if (blockAddr <= offset && offset + 4 <= blockEnd) {
        return new DataView(block.buffer, offset - blockAddr, 4).getUint32(0, littleEndian);
      }
    }

    return;
  };
  /**
   * Returns a <tt>String</tt> of text representing a .hex file.
   * <br/>
   * The writer has an opinionated behaviour. Check the project's
   * {@link https://github.com/NordicSemiconductor/nrf-intel-hex#Features|README file} for details.
   *
   * @param {Number} [lineSize=16] Maximum number of bytes to be encoded in each data record.
   * Must have a value between 1 and 255, as per the specification.
   *
   * @return {String} String of text with the .hex representation of the input binary data
   *
   * @example
   * import MemoryMap from 'nrf-intel-hex';
   *
   * let memMap = new MemoryMap();
   * let bytes = new Uint8Array(....);
   * memMap.set(0x0FF80000, bytes); // The block with 'bytes' will start at offset 0x0FF80000
   *
   * let string = memMap.asHexString();
   */


  MemoryMap.prototype.asHexString = function asHexString(lineSize) {
    var this$1 = this;
    if (lineSize === void 0) lineSize = 16;
    var lowAddress = 0; // 16 least significant bits of the current addr

    var highAddress = -1 << 16; // 16 most significant bits of the current addr

    var records = [];

    if (lineSize <= 0) {
      throw new Error('Size of record must be greater than zero');
    } else if (lineSize > 255) {
      throw new Error('Size of record must be less than 256');
    } // Placeholders


    var offsetRecord = new Uint8Array(6);
    var recordHeader = new Uint8Array(4);
    var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
      return a - b;
    });

    for (var i = 0, l = sortedKeys.length; i < l; i++) {
      var blockAddr = sortedKeys[i];
      var block = this$1.get(blockAddr); // Sanity checks

      if (!(block instanceof Uint8Array)) {
        throw new Error('Block at offset ' + blockAddr + ' is not an Uint8Array');
      }

      if (blockAddr < 0) {
        throw new Error('Block at offset ' + blockAddr + ' has a negative thus invalid address');
      }

      var blockSize = block.length;

      if (!blockSize) {
        continue;
      } // Skip zero-length blocks


      if (blockAddr > highAddress + 0xFFFF) {
        // Insert a new 0x04 record to jump to a new 64KiB block
        // Round up the least significant 16 bits - no bitmasks because they trigger
        // base-2 negative numbers, whereas subtracting the modulo maintains precision
        highAddress = blockAddr - blockAddr % 0x10000;
        lowAddress = 0;
        offsetRecord[0] = 2; // Length

        offsetRecord[1] = 0; // Load offset, high byte

        offsetRecord[2] = 0; // Load offset, low byte

        offsetRecord[3] = 4; // Record type

        offsetRecord[4] = highAddress >> 24; // new address offset, high byte

        offsetRecord[5] = highAddress >> 16; // new address offset, low byte

        records.push(':' + Array.prototype.map.call(offsetRecord, hexpad).join('') + hexpad(checksum(offsetRecord)));
      }

      if (blockAddr < highAddress + lowAddress) {
        throw new Error('Block starting at 0x' + blockAddr.toString(16) + ' overlaps with a previous block.');
      }

      lowAddress = blockAddr % 0x10000;
      var blockOffset = 0;
      var blockEnd = blockAddr + blockSize;

      if (blockEnd > 0xFFFFFFFF) {
        throw new Error('Data cannot be over 0xFFFFFFFF');
      } // Loop for every 64KiB memory segment that spans this block


      while (highAddress + lowAddress < blockEnd) {
        if (lowAddress > 0xFFFF) {
          // Insert a new 0x04 record to jump to a new 64KiB block
          highAddress += 1 << 16; // Increase by one

          lowAddress = 0;
          offsetRecord[0] = 2; // Length

          offsetRecord[1] = 0; // Load offset, high byte

          offsetRecord[2] = 0; // Load offset, low byte

          offsetRecord[3] = 4; // Record type

          offsetRecord[4] = highAddress >> 24; // new address offset, high byte

          offsetRecord[5] = highAddress >> 16; // new address offset, low byte

          records.push(':' + Array.prototype.map.call(offsetRecord, hexpad).join('') + hexpad(checksum(offsetRecord)));
        }

        var recordSize = -1; // Loop for every record for that spans the current 64KiB memory segment

        while (lowAddress < 0x10000 && recordSize) {
          recordSize = Math.min(lineSize, // Normal case
          blockEnd - highAddress - lowAddress, // End of block
          0x10000 - lowAddress // End of low addresses
          );

          if (recordSize) {
            recordHeader[0] = recordSize; // Length

            recordHeader[1] = lowAddress >> 8; // Load offset, high byte

            recordHeader[2] = lowAddress; // Load offset, low byte

            recordHeader[3] = 0; // Record type

            var subBlock = block.subarray(blockOffset, blockOffset + recordSize); // Data bytes for this record

            records.push(':' + Array.prototype.map.call(recordHeader, hexpad).join('') + Array.prototype.map.call(subBlock, hexpad).join('') + hexpad(checksumTwo(recordHeader, subBlock)));
            blockOffset += recordSize;
            lowAddress += recordSize;
          }
        }
      }
    }

    records.push(':00000001FF'); // EOF record

    return records.join('\n');
  };
  /**
   * Performs a deep copy of the current {@linkcode MemoryMap}, returning a new one
   * with exactly the same contents, but allocating new memory for each of its
   * <tt>Uint8Array</tt>s.
   *
   * @return {MemoryMap}
   */


  MemoryMap.prototype.clone = function clone() {
    var this$1 = this;
    var cloned = new MemoryMap();

    for (var [addr, value] of this$1) {
      cloned.set(addr, new Uint8Array(value));
    }

    return cloned;
  };
  /**
   * Given one <tt>Uint8Array</tt>, looks through its contents and returns a new
   * {@linkcode MemoryMap}, stripping away those regions where there are only
   * padding bytes.
   * <br/>
   * The start of the input <tt>Uint8Array</tt> is assumed to be offset zero for the output.
   * <br/>
   * The use case here is dumping memory from a working device and try to see the
   * "interesting" memory regions it has. This assumes that there is a constant,
   * predefined padding byte value being used in the "non-interesting" regions.
   * In other words: this will work as long as the dump comes from a flash memory
   * which has been previously erased (thus <tt>0xFF</tt>s for padding), or from a
   * previously blanked HDD (thus <tt>0x00</tt>s for padding).
   * <br/>
   * This method uses <tt>subarray</tt> on the input data, and thus does not allocate memory
   * for the <tt>Uint8Array</tt>s.
   *
   * @param {Uint8Array} bytes The input data
   * @param {Number} [padByte=0xFF] The value of the byte assumed to be used as padding
   * @param {Number} [minPadLength=64] The minimum number of consecutive pad bytes to
   * be considered actual padding
   *
   * @return {MemoryMap}
   */


  MemoryMap.fromPaddedUint8Array = function fromPaddedUint8Array(bytes, padByte, minPadLength) {
    if (padByte === void 0) padByte = 0xFF;
    if (minPadLength === void 0) minPadLength = 64;

    if (!(bytes instanceof Uint8Array)) {
      throw new Error('Bytes passed to fromPaddedUint8Array are not an Uint8Array');
    } // The algorithm used is naïve and checks every byte.
    // An obvious optimization would be to implement Boyer-Moore
    // (see https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string_search_algorithm )
    // or otherwise start skipping up to minPadLength bytes when going through a non-pad
    // byte.
    // Anyway, we could expect a lot of cases where there is a majority of pad bytes,
    // and the algorithm should check most of them anyway, so the perf gain is questionable.


    var memMap = new MemoryMap();
    var consecutivePads = 0;
    var lastNonPad = -1;
    var firstNonPad = 0;
    var skippingBytes = false;
    var l = bytes.length;

    for (var addr = 0; addr < l; addr++) {
      var byte = bytes[addr];

      if (byte === padByte) {
        consecutivePads++;

        if (consecutivePads >= minPadLength) {
          // Edge case: ignore writing a zero-length block when skipping
          // bytes at the beginning of the input
          if (lastNonPad !== -1) {
            /// Add the previous block to the result memMap
            memMap.set(firstNonPad, bytes.subarray(firstNonPad, lastNonPad + 1));
          }

          skippingBytes = true;
        }
      } else {
        if (skippingBytes) {
          skippingBytes = false;
          firstNonPad = addr;
        }

        lastNonPad = addr;
        consecutivePads = 0;
      }
    } // At EOF, add the last block if not skipping bytes already (and input not empty)


    if (!skippingBytes && lastNonPad !== -1) {
      memMap.set(firstNonPad, bytes.subarray(firstNonPad, l));
    }

    return memMap;
  };
  /**
   * Returns a new instance of {@linkcode MemoryMap}, containing only data between
   * the addresses <tt>address</tt> and <tt>address + length</tt>.
   * Behaviour is similar to {@linkcode https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/slice|Array.prototype.slice},
   * in that the return value is a portion of the current {@linkcode MemoryMap}.
   *
   * <br/>
   * The returned {@linkcode MemoryMap} might be empty.
   *
   * <br/>
   * Internally, this uses <tt>subarray</tt>, so new memory is not allocated.
   *
   * @param {Number} address The start address of the slice
   * @param {Number} length The length of memory map to slice out
   * @return {MemoryMap}
   */


  MemoryMap.prototype.slice = function slice(address, length) {
    var this$1 = this;
    if (length === void 0) length = Infinity;

    if (length < 0) {
      throw new Error('Length of the slice cannot be negative');
    }

    var sliced = new MemoryMap();

    for (var [blockAddr, block] of this$1) {
      var blockLength = block.length;

      if (blockAddr + blockLength >= address && blockAddr < address + length) {
        var sliceStart = Math.max(address, blockAddr);
        var sliceEnd = Math.min(address + length, blockAddr + blockLength);
        var sliceLength = sliceEnd - sliceStart;
        var relativeSliceStart = sliceStart - blockAddr;

        if (sliceLength > 0) {
          sliced.set(sliceStart, block.subarray(relativeSliceStart, relativeSliceStart + sliceLength));
        }
      }
    }

    return sliced;
  };
  /**
   * Returns a new instance of {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint32|Uint8Array}, containing only data between
   * the addresses <tt>address</tt> and <tt>address + length</tt>. Any byte without a value
   * in the input {@linkcode MemoryMap} will have a value of <tt>padByte</tt>.
   *
   * <br/>
   * This method allocates new memory.
   *
   * @param {Number} address The start address of the slice
   * @param {Number} length The length of memory map to slice out
   * @param {Number} [padByte=0xFF] The value of the byte assumed to be used as padding
   * @return {MemoryMap}
   */


  MemoryMap.prototype.slicePad = function slicePad(address, length, padByte) {
    var this$1 = this;
    if (padByte === void 0) padByte = 0xFF;

    if (length < 0) {
      throw new Error('Length of the slice cannot be negative');
    }

    var out = new Uint8Array(length).fill(padByte);

    for (var [blockAddr, block] of this$1) {
      var blockLength = block.length;

      if (blockAddr + blockLength >= address && blockAddr < address + length) {
        var sliceStart = Math.max(address, blockAddr);
        var sliceEnd = Math.min(address + length, blockAddr + blockLength);
        var sliceLength = sliceEnd - sliceStart;
        var relativeSliceStart = sliceStart - blockAddr;

        if (sliceLength > 0) {
          out.set(block.subarray(relativeSliceStart, relativeSliceStart + sliceLength), sliceStart - address);
        }
      }
    }

    return out;
  };
  /**
   * Checks whether the current memory map contains the one given as a parameter.
   *
   * <br/>
   * "Contains" means that all the offsets that have a byte value in the given
   * memory map have a value in the current memory map, and that the byte values
   * are the same.
   *
   * <br/>
   * An empty memory map is always contained in any other memory map.
   *
   * <br/>
   * Returns boolean <tt>true</tt> if the memory map is contained, <tt>false</tt>
   * otherwise.
   *
   * @param {MemoryMap} memMap The memory map to check
   * @return {Boolean}
   */


  MemoryMap.prototype.contains = function contains(memMap) {
    var this$1 = this;

    for (var [blockAddr, block] of memMap) {
      var blockLength = block.length;
      var slice = this$1.slice(blockAddr, blockLength).join().get(blockAddr);

      if (!slice || slice.length !== blockLength) {
        return false;
      }

      for (var i in block) {
        if (block[i] !== slice[i]) {
          return false;
        }
      }
    }

    return true;
  };

  Object.defineProperties(MemoryMap.prototype, prototypeAccessors);
  return MemoryMap;
});
},{}],"src/worker/worker.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const z80_1 = require("./z80");

const MemoryMap = __importStar(require("nrf-intel-hex"));

let running = false;
let active = true;
let speed = 30;
let cycles = 0;
const memory = Array(0xFFFF).fill(0xFF);
const inPorts = Array(256).fill(0xFF);
const outPorts = Array(256).fill(0xFF);
const cpu = z80_1.Z80({
  mem_read: addr => memory[addr],
  mem_write: (addr, value) => memory[addr] = value,
  io_read: port => {
    return inPorts[port & 0xFF];
  },
  io_write: (port, value) => {
    const port1 = port & 0xFF;
    outPorts[port1] = value;
    updateDisplay();
    postOutPorts(port1, value);
  }
});
const display = Array(6).fill(0);

self.onmessage = event => {
  if (event.data.type === 'INIT') {
    // updateMemory(ROM);
    cpu.reset();
    running = true;
    run();
  } else if (event.data.type === 'PAUSE') {
    if (active) {
      active = false;
      running = false;
    } else {
      active = true;
      running = true;
      run();
    }
  } else if (event.data.type === 'RESUME') {} else if (event.data.type === 'RESET') {
    console.log('resetting');
    cpu.reset();
    running = true;
    run();
  } else if (event.data.type === 'SET_INPUT_VALUE') {
    const {
      port,
      value
    } = event.data;
    inPorts[port] = value;
  } else if (event.data.type === 'SET_SPEED') {
    speed = Number(event.data.value) / 100;
    console.log('set speed', speed);
  } else if (event.data.type === 'NMI') {
    cpu.interrupt(true, 0);
  } else if (event.data.type === 'UPDATE_MEMORY') {
    updateMemory(event.data.value);
    cpu.reset();
  } else if (event.data.type === 'HIDDEN') {
    let hidden = event.data.value;

    if (hidden) {
      running = false;
    } else if (active) {
      running = true;
      run();
    } else {
      console.log('not active');
    }
  }
};

function* runGen() {
  while (true) {
    for (let i = 0; i < 1000; i++) {
      const count = cpu.run_instruction();
      cycles += count;
    }

    yield cycles;
  }
}

let pending = false;
const iter = runGen();

function run() {
  if (pending) return;
  if (!running) return;
  iter.next();
  const delay = Math.floor((1 - Number(speed)) * 30);

  if (running) {
    pending = true;
    setTimeout(function () {
      pending = false;
      run();
    }, delay);
  }

  ;
}

function updateDisplay() {
  const digits = outPorts[1];
  const segments = outPorts[2];
  let mask = 0x01;

  for (let i = 0; i < 6; i++) {
    if (digits & mask) {
      display[i] = segments;
    }

    mask = mask << 1;
  }
}

function getPortsBuffer() {
  var buffer = new ArrayBuffer(4);
  var view = new Uint8Array(buffer);
  view[0] = outPorts[0];
  view[1] = outPorts[1];
  view[2] = outPorts[2];
  return buffer;
}

function getDisplayBuffer() {
  var buffer = new ArrayBuffer(6);
  var view = new Uint8Array(buffer);

  for (let i = 0; i < 6; i++) {
    view[i] = display[i];
  }

  return buffer;
}

let speaker = 1;
let wavelength = 0;

function postOutPorts(port, value) {
  const buffer = getPortsBuffer();
  const display = getDisplayBuffer();

  if (port === 1 && (value === 0x7F || value === 0xFF)) {
    const speaker1 = value >> 7;

    if (speaker1 === 1 && speaker === 0) {
      wavelength = cycles;
      cycles = 0;
    }

    speaker = speaker1;
  }

  if (cycles > 10000) wavelength = 0;
  self.postMessage({
    type: 'POST_OUTPORTS',
    buffer,
    display,
    speaker,
    wavelength: wavelength
  }, [buffer, display]);
}

function updateMemory(rom) {
  const blocks = MemoryMap.fromHex(rom);

  for (let address of blocks.keys()) {
    const block = blocks.get(address);

    for (let i = address; i < address + block.length; i++) {
      memory[i] = block[i];
    }
  }
}
},{"./z80":"src/worker/z80.ts","nrf-intel-hex":"node_modules/nrf-intel-hex/intel-hex.browser.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49981" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/worker/worker.ts"], null)
//# sourceMappingURL=/worker.f0688aad.map