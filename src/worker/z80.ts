/* eslint-disable max-lines */
/* eslint-disable no-lonely-if */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */

import {
  cycle_counts_cb,
  cycle_counts_dd,
  cycle_counts,
  cycle_counts_ed,
  parity_bits,
} from './z80-constants';

export interface Callbacks {
  mem_read: (addr: number) => any;
  mem_write: (addr: number, value: number) => any;
  io_read: (port: number) => any;
  io_write: (port: number, value: number) => void;
}

export interface Cpu {
  b: number;
  a: number;
  c: number;
  d: number;
  e: number;
  h: number;
  l: number;
  a_prime: number;
  b_prime: number;
  c_prime: number;
  d_prime: number;
  e_prime: number;
  h_prime: number;
  l_prime: number;
  ix: number;
  iy: number;
  i: number;
  r: number;
  sp: number;
  pc: number;
  flags: {
    S: number;
    Z: number;
    Y: number;
    H: number;
    X: number;
    P: number;
    N: number;
    C: number;
  };
  flags_prime: {
    S: number;
    Z: number;
    Y: number;
    H: number;
    X: number;
    P: number;
    N: number;
    C: number;
  };
  imode: number;
  iff1: number;
  iff2: number;
  halted: boolean;
  do_delayed_di: boolean;
  do_delayed_ei: boolean;
  cycle_counter: number;
}

const setFlagsRegister = (cpu: Cpu, operand: number) => {
  // We need to set the F register, probably for a POP AF,
  //  so break out the given value into our separate flags.
  cpu.flags.S = (operand & 0x80) >>> 7;
  cpu.flags.Z = (operand & 0x40) >>> 6;
  cpu.flags.Y = (operand & 0x20) >>> 5;
  cpu.flags.H = (operand & 0x10) >>> 4;
  cpu.flags.X = (operand & 0x08) >>> 3;
  cpu.flags.P = (operand & 0x04) >>> 2;
  cpu.flags.N = (operand & 0x02) >>> 1;
  cpu.flags.C = operand & 0x01;
};

const pushWord = (cpu: Cpu, cb: Callbacks, operand: number) => {
  // Pretty obvious what this function does; given a 16-bit value,
  //  decrement the stack pointer, write the high byte to the new
  //  stack pointer location, then repeat for the low byte.
  cpu.sp = (cpu.sp - 1) & 0xffff;
  cb.mem_write(cpu.sp, (operand & 0xff00) >>> 8);
  cpu.sp = (cpu.sp - 1) & 0xffff;
  cb.mem_write(cpu.sp, operand & 0x00ff);
};

// ////////////////////////////////////////////////////////////////////////////
// The public API functions end here.
//
// What begins here are just general utility functions, used variously.
// ////////////////////////////////////////////////////////////////////////////
const decodeInstruction = (cpu: Cpu, cb: Callbacks, opcode: number) => {
  const get_signed_offset_byte = (value: number) => {
    // This function requires some explanation.
    // We just use JavaScript Number variables for our registers,
    //  not like a typed array or anything.
    // That means that, when we have a byte value that's supposed
    //  to represent a signed offset, the value we actually see
    //  isn't signed at all, it's just a small integer.
    // So, this function converts that byte into something JavaScript
    //  will recognize as signed, so we can easily do arithmetic with it.
    // First, we clamp the value to a single byte, just in case.
    value &= 0xff;
    // We don't have to do anything if the value is positive.
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

  const get_flags_register = () => {
    // We need the whole F register for some reason.
    //  probably a PUSH AF instruction,
    //  so make the F register out of our separate flags.
    return (
      (cpu.flags.S << 7) |
      (cpu.flags.Z << 6) |
      (cpu.flags.Y << 5) |
      (cpu.flags.H << 4) |
      (cpu.flags.X << 3) |
      (cpu.flags.P << 2) |
      (cpu.flags.N << 1) |
      cpu.flags.C
    );
  };

  const get_flags_prime = () => {
    // This is the same as the above for the F' register.
    return (
      (cpu.flags_prime.S << 7) |
      (cpu.flags_prime.Z << 6) |
      (cpu.flags_prime.Y << 5) |
      (cpu.flags_prime.H << 4) |
      (cpu.flags_prime.X << 3) |
      (cpu.flags_prime.P << 2) |
      (cpu.flags_prime.N << 1) |
      cpu.flags_prime.C
    );
  };

  const set_flags_prime = (operand: number) => {
    // Again, this is the same as the above for F'.
    cpu.flags_prime.S = (operand & 0x80) >>> 7;
    cpu.flags_prime.Z = (operand & 0x40) >>> 6;
    cpu.flags_prime.Y = (operand & 0x20) >>> 5;
    cpu.flags_prime.H = (operand & 0x10) >>> 4;
    cpu.flags_prime.X = (operand & 0x08) >>> 3;
    cpu.flags_prime.P = (operand & 0x04) >>> 2;
    cpu.flags_prime.N = (operand & 0x02) >>> 1;
    cpu.flags_prime.C = operand & 0x01;
  };

  const update_xy_flags = (result: number) => {
    // Most of the time, the undocumented flags
    //  (sometimes called X and Y, or 3 and 5),
    //  take their values from the corresponding bits
    //  of the result of the instruction,
    //  or from some other related value.
    // This is a utility function to set those flags based on those bits.
    cpu.flags.Y = (result & 0x20) >>> 5;
    cpu.flags.X = (result & 0x08) >>> 3;
  };

  const pop_word = () => {
    // Again, not complicated; read a byte off the top of the stack,
    //  increment the stack pointer, rinse and repeat.
    let retval = cb.mem_read(cpu.sp) & 0xff;
    cpu.sp = (cpu.sp + 1) & 0xffff;
    retval |= cb.mem_read(cpu.sp) << 8;
    cpu.sp = (cpu.sp + 1) & 0xffff;
    return retval;
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Now, the way most instructions work in this emulator is that they set up
  //  their operands according to their addressing mode, and then they call a
  //  utility function that handles all variations of that instruction.
  // Those utility functions begin here.
  // ////////////////////////////////////////////////////////////////////////////
  const do_conditional_absolute_jump = (condition: boolean) => {
    // This function implements the JP [condition],nn instructions.
    if (condition) {
      // We're taking this jump, so write the new PC,
      //  and then decrement the thing we just wrote,
      //  because the instruction decoder increments the PC
      //  unconditionally at the end of every instruction
      //  and we need to counteract that so we end up at the jump target.
      cpu.pc =
        cb.mem_read((cpu.pc + 1) & 0xffff) |
        (cb.mem_read((cpu.pc + 2) & 0xffff) << 8);
      cpu.pc = (cpu.pc - 1) & 0xffff;
    } else {
      // We're not taking this jump, just move the PC past the operand.
      cpu.pc = (cpu.pc + 2) & 0xffff;
    }
  };

  const do_conditional_relative_jump = (condition: boolean) => {
    // This function implements the JR [condition],n instructions.
    if (condition) {
      // We need a few more cycles to actually take the jump.
      cpu.cycle_counter += 5;
      // Calculate the offset specified by our operand.
      const offset = get_signed_offset_byte(cb.mem_read((cpu.pc + 1) & 0xffff));
      // Add the offset to the PC, also skipping past this instruction.
      cpu.pc = (cpu.pc + offset + 1) & 0xffff;
    } else {
      // No jump happening, just skip the operand.
      cpu.pc = (cpu.pc + 1) & 0xffff;
    }
  };

  const do_conditional_call = (condition: boolean) => {
    // This function is the CALL [condition],nn instructions.
    // If you've seen the previous functions, you know this drill.
    if (condition) {
      cpu.cycle_counter += 7;
      pushWord(cpu, cb, (cpu.pc + 3) & 0xffff);
      cpu.pc =
        cb.mem_read((cpu.pc + 1) & 0xffff) |
        (cb.mem_read((cpu.pc + 2) & 0xffff) << 8);
      cpu.pc = (cpu.pc - 1) & 0xffff;
    } else {
      cpu.pc = (cpu.pc + 2) & 0xffff;
    }
  };

  const do_conditional_return = (condition: boolean) => {
    if (condition) {
      cpu.cycle_counter += 6;
      cpu.pc = (pop_word() - 1) & 0xffff;
    }
  };

  const do_reset = (address: number) => {
    // The RST [address] instructions go through here.
    pushWord(cpu, cb, (cpu.pc + 1) & 0xffff);
    cpu.pc = (address - 1) & 0xffff;
  };

  const do_add = (operand: number) => {
    // This is the ADD A, [operand] instructions.
    // We'll do the literal addition, which includes any overflow,
    //  so that we can more easily figure out whether we had
    //  an overflow or a carry and set the flags accordingly.
    const result = cpu.a + operand;

    // The great majority of the work for the arithmetic instructions
    //  turns out to be setting the flags rather than the actual operation.
    cpu.flags.S = result & 0x80 ? 1 : 0;
    cpu.flags.Z = !(result & 0xff) ? 1 : 0;
    cpu.flags.H = ((operand & 0x0f) + (cpu.a & 0x0f)) & 0x10 ? 1 : 0;
    // An overflow has happened if the sign bits of the accumulator and the operand
    //  don't match the sign bit of the result value.
    cpu.flags.P =
      (cpu.a & 0x80) === (operand & 0x80) && (cpu.a & 0x80) !== (result & 0x80)
        ? 1
        : 0;
    cpu.flags.N = 0;
    cpu.flags.C = result & 0x100 ? 1 : 0;

    cpu.a = result & 0xff;
    update_xy_flags(cpu.a);
  };

  const do_adc = (operand: number) => {
    const result = cpu.a + operand + cpu.flags.C;

    cpu.flags.S = result & 0x80 ? 1 : 0;
    cpu.flags.Z = !(result & 0xff) ? 1 : 0;
    cpu.flags.H =
      ((operand & 0x0f) + (cpu.a & 0x0f) + cpu.flags.C) & 0x10 ? 1 : 0;
    cpu.flags.P =
      (cpu.a & 0x80) === (operand & 0x80) && (cpu.a & 0x80) !== (result & 0x80)
        ? 1
        : 0;
    cpu.flags.N = 0;
    cpu.flags.C = result & 0x100 ? 1 : 0;

    cpu.a = result & 0xff;
    update_xy_flags(cpu.a);
  };

  const do_sub = (operand: number) => {
    const result = cpu.a - operand;

    cpu.flags.S = result & 0x80 ? 1 : 0;
    cpu.flags.Z = !(result & 0xff) ? 1 : 0;
    cpu.flags.H = ((cpu.a & 0x0f) - (operand & 0x0f)) & 0x10 ? 1 : 0;
    cpu.flags.P =
      (cpu.a & 0x80) !== (operand & 0x80) && (cpu.a & 0x80) !== (result & 0x80)
        ? 1
        : 0;
    cpu.flags.N = 1;
    cpu.flags.C = result & 0x100 ? 1 : 0;

    cpu.a = result & 0xff;
    update_xy_flags(cpu.a);
  };

  const do_sbc = (operand: number) => {
    const result = cpu.a - operand - cpu.flags.C;

    cpu.flags.S = result & 0x80 ? 1 : 0;
    cpu.flags.Z = !(result & 0xff) ? 1 : 0;
    cpu.flags.H =
      ((cpu.a & 0x0f) - (operand & 0x0f) - cpu.flags.C) & 0x10 ? 1 : 0;
    cpu.flags.P =
      (cpu.a & 0x80) !== (operand & 0x80) && (cpu.a & 0x80) !== (result & 0x80)
        ? 1
        : 0;
    cpu.flags.N = 1;
    cpu.flags.C = result & 0x100 ? 1 : 0;

    cpu.a = result & 0xff;
    update_xy_flags(cpu.a);
  };

  const do_cp = (operand: number) => {
    // A compare instruction is just a subtraction that doesn't save the value,
    //  so we implement it as... a subtraction that doesn't save the value.
    const temp = cpu.a;
    do_sub(operand);
    cpu.a = temp;
    // Since this instruction has no "result" value, the undocumented flags
    //  are set based on the operand instead.
    update_xy_flags(operand);
  };

  const do_and = (operand: number) => {
    // The logic instructions are all pretty straightforward.
    cpu.a &= operand & 0xff;
    cpu.flags.S = cpu.a & 0x80 ? 1 : 0;
    cpu.flags.Z = !cpu.a ? 1 : 0;
    cpu.flags.H = 1;
    cpu.flags.P = parity_bits[cpu.a];
    cpu.flags.N = 0;
    cpu.flags.C = 0;
    update_xy_flags(cpu.a);
  };

  const do_or = (operand: number) => {
    cpu.a = (operand | cpu.a) & 0xff;
    cpu.flags.S = cpu.a & 0x80 ? 1 : 0;
    cpu.flags.Z = !cpu.a ? 1 : 0;
    cpu.flags.H = 0;
    cpu.flags.P = parity_bits[cpu.a];
    cpu.flags.N = 0;
    cpu.flags.C = 0;
    update_xy_flags(cpu.a);
  };

  const do_xor = (operand: number) => {
    cpu.a = (operand ^ cpu.a) & 0xff;
    cpu.flags.S = cpu.a & 0x80 ? 1 : 0;
    cpu.flags.Z = !cpu.a ? 1 : 0;
    cpu.flags.H = 0;
    cpu.flags.P = parity_bits[cpu.a];
    cpu.flags.N = 0;
    cpu.flags.C = 0;
    update_xy_flags(cpu.a);
  };

  const do_inc = (operand: number) => {
    let result = operand + 1;

    cpu.flags.S = result & 0x80 ? 1 : 0;
    cpu.flags.Z = !(result & 0xff) ? 1 : 0;
    cpu.flags.H = (operand & 0x0f) === 0x0f ? 1 : 0;
    // It's a good deal easier to detect overflow for an increment/decrement.
    cpu.flags.P = operand === 0x7f ? 1 : 0;
    cpu.flags.N = 0;

    result &= 0xff;
    update_xy_flags(result);

    return result;
  };

  const do_dec = (operand: number) => {
    let result = operand - 1;

    cpu.flags.S = result & 0x80 ? 1 : 0;
    cpu.flags.Z = !(result & 0xff) ? 1 : 0;
    cpu.flags.H = (operand & 0x0f) === 0x00 ? 1 : 0;
    cpu.flags.P = operand === 0x80 ? 1 : 0;
    cpu.flags.N = 1;

    result &= 0xff;
    update_xy_flags(result);

    return result;
  };

  const do_hl_add = (operand: number) => {
    // The HL arithmetic instructions are the same as the A ones,
    //  just with twice as many bits happening.
    const hl = cpu.l | (cpu.h << 8);
    const result = hl + operand;

    cpu.flags.N = 0;
    cpu.flags.C = result & 0x10000 ? 1 : 0;
    cpu.flags.H = ((hl & 0x0fff) + (operand & 0x0fff)) & 0x1000 ? 1 : 0;

    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;

    update_xy_flags(cpu.h);
  };

  const do_hl_adc = (operand: number) => {
    operand += cpu.flags.C;
    const hl = cpu.l | (cpu.h << 8);
    const result = hl + operand;

    cpu.flags.S = result & 0x8000 ? 1 : 0;
    cpu.flags.Z = !(result & 0xffff) ? 1 : 0;
    cpu.flags.H = ((hl & 0x0fff) + (operand & 0x0fff)) & 0x1000 ? 1 : 0;
    cpu.flags.P =
      (hl & 0x8000) === (operand & 0x8000) &&
      (result & 0x8000) !== (hl & 0x8000)
        ? 1
        : 0;
    cpu.flags.N = 0;
    cpu.flags.C = result & 0x10000 ? 1 : 0;

    cpu.l = result & 0xff;
    cpu.h = (result >>> 8) & 0xff;

    update_xy_flags(cpu.h);
  };

  const do_hl_sbc = (operand: number) => {
    operand += cpu.flags.C;
    const hl = cpu.l | (cpu.h << 8);
    const result = hl - operand;

    cpu.flags.S = result & 0x8000 ? 1 : 0;
    cpu.flags.Z = !(result & 0xffff) ? 1 : 0;
    cpu.flags.H = ((hl & 0x0fff) - (operand & 0x0fff)) & 0x1000 ? 1 : 0;
    cpu.flags.P =
      (hl & 0x8000) !== (operand & 0x8000) &&
      (result & 0x8000) !== (hl & 0x8000)
        ? 1
        : 0;
    cpu.flags.N = 1;
    cpu.flags.C = result & 0x10000 ? 1 : 0;

    cpu.l = result & 0xff;
    cpu.h = (result >>> 8) & 0xff;

    update_xy_flags(cpu.h);
  };

  const do_in = (port: number) => {
    const result = cb.io_read(port);

    cpu.flags.S = result & 0x80 ? 1 : 0;
    cpu.flags.Z = result ? 0 : 1;
    cpu.flags.H = 0;
    cpu.flags.P = parity_bits[result] ? 1 : 0;
    cpu.flags.N = 0;
    update_xy_flags(result);

    return result;
  };

  const do_neg = () => {
    // This instruction is defined to not alter the register if it === 0x80.
    if (cpu.a !== 0x80) {
      // This is a signed operation, so convert A to a signed value.
      cpu.a = get_signed_offset_byte(cpu.a);

      cpu.a = -cpu.a & 0xff;
    }

    cpu.flags.S = cpu.a & 0x80 ? 1 : 0;
    cpu.flags.Z = !cpu.a ? 1 : 0;
    cpu.flags.H = (-cpu.a & 0x0f) > 0 ? 1 : 0;
    cpu.flags.P = cpu.a === 0x80 ? 1 : 0;
    cpu.flags.N = 1;
    cpu.flags.C = cpu.a ? 1 : 0;
    update_xy_flags(cpu.a);
  };

  const do_ldi = () => {
    // Copy the value that we're supposed to copy.
    const read_value = cb.mem_read(cpu.l | (cpu.h << 8));
    cb.mem_write(cpu.e | (cpu.d << 8), read_value);

    // Increment DE and HL, and decrement BC.
    let result = (cpu.e | (cpu.d << 8)) + 1;
    cpu.e = result & 0xff;
    cpu.d = (result & 0xff00) >>> 8;
    result = (cpu.l | (cpu.h << 8)) + 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;
    result = (cpu.c | (cpu.b << 8)) - 1;
    cpu.c = result & 0xff;
    cpu.b = (result & 0xff00) >>> 8;

    cpu.flags.H = 0;
    cpu.flags.P = cpu.c || cpu.b ? 1 : 0;
    cpu.flags.N = 0;
    cpu.flags.Y = ((cpu.a + read_value) & 0x02) >>> 1;
    cpu.flags.X = ((cpu.a + read_value) & 0x08) >>> 3;
  };

  const do_cpi = () => {
    const temp_carry = cpu.flags.C;
    const read_value = cb.mem_read(cpu.l | (cpu.h << 8));
    do_cp(read_value);
    cpu.flags.C = temp_carry;
    cpu.flags.Y = ((cpu.a - read_value - cpu.flags.H) & 0x02) >>> 1;
    cpu.flags.X = ((cpu.a - read_value - cpu.flags.H) & 0x08) >>> 3;

    let result = (cpu.l | (cpu.h << 8)) + 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;
    result = (cpu.c | (cpu.b << 8)) - 1;
    cpu.c = result & 0xff;
    cpu.b = (result & 0xff00) >>> 8;

    cpu.flags.P = result ? 1 : 0;
  };

  const do_ini = () => {
    cpu.b = do_dec(cpu.b);

    cb.mem_write(cpu.l | (cpu.h << 8), cb.io_read((cpu.b << 8) | cpu.c));

    const result = (cpu.l | (cpu.h << 8)) + 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;

    cpu.flags.N = 1;
  };

  const do_outi = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cb.mem_read(cpu.l | (cpu.h << 8)));

    const result = (cpu.l | (cpu.h << 8)) + 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;

    cpu.b = do_dec(cpu.b);
    cpu.flags.N = 1;
  };

  const do_ldd = () => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    const read_value = cb.mem_read(cpu.l | (cpu.h << 8));
    cb.mem_write(cpu.e | (cpu.d << 8), read_value);

    let result = (cpu.e | (cpu.d << 8)) - 1;
    cpu.e = result & 0xff;
    cpu.d = (result & 0xff00) >>> 8;
    result = (cpu.l | (cpu.h << 8)) - 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;
    result = (cpu.c | (cpu.b << 8)) - 1;
    cpu.c = result & 0xff;
    cpu.b = (result & 0xff00) >>> 8;

    cpu.flags.P = cpu.c || cpu.b ? 1 : 0;
    cpu.flags.Y = ((cpu.a + read_value) & 0x02) >>> 1;
    cpu.flags.X = ((cpu.a + read_value) & 0x08) >>> 3;
  };

  const do_cpd = () => {
    const temp_carry = cpu.flags.C;
    const read_value = cb.mem_read(cpu.l | (cpu.h << 8));
    do_cp(read_value);
    cpu.flags.C = temp_carry;
    cpu.flags.Y = ((cpu.a - read_value - cpu.flags.H) & 0x02) >>> 1;
    cpu.flags.X = ((cpu.a - read_value - cpu.flags.H) & 0x08) >>> 3;

    let result = (cpu.l | (cpu.h << 8)) - 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;
    result = (cpu.c | (cpu.b << 8)) - 1;
    cpu.c = result & 0xff;
    cpu.b = (result & 0xff00) >>> 8;

    cpu.flags.P = result ? 1 : 0;
  };

  const do_ind = () => {
    cpu.b = do_dec(cpu.b);

    cb.mem_write(cpu.l | (cpu.h << 8), cb.io_read((cpu.b << 8) | cpu.c));

    const result = (cpu.l | (cpu.h << 8)) - 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;

    cpu.flags.N = 1;
  };

  const do_outd = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cb.mem_read(cpu.l | (cpu.h << 8)));

    const result = (cpu.l | (cpu.h << 8)) - 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;

    cpu.b = do_dec(cpu.b);
    cpu.flags.N = 1;
  };

  const do_rlc = (operand: number) => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    cpu.flags.C = (operand & 0x80) >>> 7;
    operand = ((operand << 1) | cpu.flags.C) & 0xff;

    cpu.flags.Z = !operand ? 1 : 0;
    cpu.flags.P = parity_bits[operand];
    cpu.flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);

    return operand;
  };

  const do_rrc = (operand: number) => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    cpu.flags.C = operand & 1;
    operand = ((operand >>> 1) & 0x7f) | (cpu.flags.C << 7);

    cpu.flags.Z = !(operand & 0xff) ? 1 : 0;
    cpu.flags.P = parity_bits[operand];
    cpu.flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);

    return operand & 0xff;
  };

  const do_rl = (operand: number) => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    const temp = cpu.flags.C;
    cpu.flags.C = (operand & 0x80) >>> 7;
    operand = ((operand << 1) | temp) & 0xff;

    cpu.flags.Z = !operand ? 1 : 0;
    cpu.flags.P = parity_bits[operand];
    cpu.flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);

    return operand;
  };

  const do_rr = (operand: number) => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    const temp = cpu.flags.C;
    cpu.flags.C = operand & 1;
    operand = ((operand >>> 1) & 0x7f) | (temp << 7);

    cpu.flags.Z = !operand ? 1 : 0;
    cpu.flags.P = parity_bits[operand];
    cpu.flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);

    return operand;
  };

  const do_sla = (operand: number) => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    cpu.flags.C = (operand & 0x80) >>> 7;
    operand = (operand << 1) & 0xff;

    cpu.flags.Z = !operand ? 1 : 0;
    cpu.flags.P = parity_bits[operand];
    cpu.flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);

    return operand;
  };

  const do_sra = (operand: number) => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    cpu.flags.C = operand & 1;
    operand = ((operand >>> 1) & 0x7f) | (operand & 0x80);

    cpu.flags.Z = !operand ? 1 : 0;
    cpu.flags.P = parity_bits[operand];
    cpu.flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);

    return operand;
  };

  const do_sll = (operand: number) => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    cpu.flags.C = (operand & 0x80) >>> 7;
    operand = ((operand << 1) & 0xff) | 1;

    cpu.flags.Z = !operand ? 1 : 0;
    cpu.flags.P = parity_bits[operand];
    cpu.flags.S = operand & 0x80 ? 1 : 0;
    update_xy_flags(operand);

    return operand;
  };

  const do_srl = (operand: number) => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;

    cpu.flags.C = operand & 1;
    operand = (operand >>> 1) & 0x7f;

    cpu.flags.Z = !operand ? 1 : 0;
    cpu.flags.P = parity_bits[operand];
    cpu.flags.S = 0;
    update_xy_flags(operand);

    return operand;
  };

  const do_ix_add = (operand: number) => {
    cpu.flags.N = 0;

    const result = cpu.ix + operand;

    cpu.flags.C = result & 0x10000 ? 1 : 0;
    cpu.flags.H = ((cpu.ix & 0xfff) + (operand & 0xfff)) & 0x1000 ? 1 : 0;
    update_xy_flags((result & 0xff00) >>> 8);

    cpu.ix = result;
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Like ED, this table is quite sparse,
  //  and many of the opcodes here are also undocumented.
  // The undocumented instructions here are those that deal with only one byte
  //  of the two-byte IX register; the bytes are designed IXH and IXL here.
  // ////////////////////////////////////////////////////////////////////////////
  const dd_instructions: (() => void)[] = [];
  // 0x09 : ADD IX, BC
  dd_instructions[0x09] = () => {
    do_ix_add(cpu.c | (cpu.b << 8));
  };
  // 0x19 : ADD IX, DE
  dd_instructions[0x19] = () => {
    do_ix_add(cpu.e | (cpu.d << 8));
  };
  // 0x21 : LD IX, nn
  dd_instructions[0x21] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.ix = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.ix |= cb.mem_read(cpu.pc) << 8;
  };
  // 0x22 : LD (nn), IX
  dd_instructions[0x22] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cb.mem_write(address, cpu.ix & 0xff);
    cb.mem_write((address + 1) & 0xffff, (cpu.ix >>> 8) & 0xff);
  };
  // 0x23 : INC IX
  dd_instructions[0x23] = () => {
    cpu.ix = (cpu.ix + 1) & 0xffff;
  };
  // 0x24 : INC IXH (Undocumented)
  dd_instructions[0x24] = () => {
    cpu.ix = (do_inc(cpu.ix >>> 8) << 8) | (cpu.ix & 0xff);
  };
  // 0x25 : DEC IXH (Undocumented)
  dd_instructions[0x25] = () => {
    cpu.ix = (do_dec(cpu.ix >>> 8) << 8) | (cpu.ix & 0xff);
  };
  // 0x26 : LD IXH, n (Undocumented)
  dd_instructions[0x26] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.ix = (cb.mem_read(cpu.pc) << 8) | (cpu.ix & 0xff);
  };
  // 0x29 : ADD IX, IX
  dd_instructions[0x29] = () => {
    do_ix_add(cpu.ix);
  };
  // 0x2a : LD IX, (nn)
  dd_instructions[0x2a] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cpu.ix = cb.mem_read(address);
    cpu.ix |= cb.mem_read((address + 1) & 0xffff) << 8;
  };
  // 0x2b : DEC IX
  dd_instructions[0x2b] = () => {
    cpu.ix = (cpu.ix - 1) & 0xffff;
  };
  // 0x2c : INC IXL (Undocumented)
  dd_instructions[0x2c] = () => {
    cpu.ix = do_inc(cpu.ix & 0xff) | (cpu.ix & 0xff00);
  };
  // 0x2d : DEC IXL (Undocumented)
  dd_instructions[0x2d] = () => {
    cpu.ix = do_dec(cpu.ix & 0xff) | (cpu.ix & 0xff00);
  };
  // 0x2e : LD IXL, n (Undocumented)
  dd_instructions[0x2e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.ix = (cb.mem_read(cpu.pc) & 0xff) | (cpu.ix & 0xff00);
  };
  // 0x34 : INC (IX+n)
  dd_instructions[0x34] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    const value = cb.mem_read((offset + cpu.ix) & 0xffff);
    cb.mem_write((offset + cpu.ix) & 0xffff, do_inc(value));
  };
  // 0x35 : DEC (IX+n)
  dd_instructions[0x35] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    const value = cb.mem_read((offset + cpu.ix) & 0xffff);
    cb.mem_write((offset + cpu.ix) & 0xffff, do_dec(value));
  };
  // 0x36 : LD (IX+n), n
  dd_instructions[0x36] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cb.mem_write((cpu.ix + offset) & 0xffff, cb.mem_read(cpu.pc));
  };
  // 0x39 : ADD IX, SP
  dd_instructions[0x39] = () => {
    do_ix_add(cpu.sp);
  };
  // 0x44 : LD B, IXH (Undocumented)
  dd_instructions[0x44] = () => {
    cpu.b = (cpu.ix >>> 8) & 0xff;
  };
  // 0x45 : LD B, IXL (Undocumented)
  dd_instructions[0x45] = () => {
    cpu.b = cpu.ix & 0xff;
  };
  // 0x46 : LD B, (IX+n)
  dd_instructions[0x46] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.b = cb.mem_read((cpu.ix + offset) & 0xffff);
  };
  // 0x4c : LD C, IXH (Undocumented)
  dd_instructions[0x4c] = () => {
    cpu.c = (cpu.ix >>> 8) & 0xff;
  };
  // 0x4d : LD C, IXL (Undocumented)
  dd_instructions[0x4d] = () => {
    cpu.c = cpu.ix & 0xff;
  };
  // 0x4e : LD C, (IX+n)
  dd_instructions[0x4e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.c = cb.mem_read((cpu.ix + offset) & 0xffff);
  };
  // 0x54 : LD D, IXH (Undocumented)
  dd_instructions[0x54] = () => {
    cpu.d = (cpu.ix >>> 8) & 0xff;
  };
  // 0x55 : LD D, IXL (Undocumented)
  dd_instructions[0x55] = () => {
    cpu.d = cpu.ix & 0xff;
  };
  // 0x56 : LD D, (IX+n)
  dd_instructions[0x56] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.d = cb.mem_read((cpu.ix + offset) & 0xffff);
  };
  // 0x5c : LD E, IXH (Undocumented)
  dd_instructions[0x5c] = () => {
    cpu.e = (cpu.ix >>> 8) & 0xff;
  };
  // 0x5d : LD E, IXL (Undocumented)
  dd_instructions[0x5d] = () => {
    cpu.e = cpu.ix & 0xff;
  };
  // 0x5e : LD E, (IX+n)
  dd_instructions[0x5e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.e = cb.mem_read((cpu.ix + offset) & 0xffff);
  };
  // 0x60 : LD IXH, B (Undocumented)
  dd_instructions[0x60] = () => {
    cpu.ix = (cpu.ix & 0xff) | (cpu.b << 8);
  };
  // 0x61 : LD IXH, C (Undocumented)
  dd_instructions[0x61] = () => {
    cpu.ix = (cpu.ix & 0xff) | (cpu.c << 8);
  };
  // 0x62 : LD IXH, D (Undocumented)
  dd_instructions[0x62] = () => {
    cpu.ix = (cpu.ix & 0xff) | (cpu.d << 8);
  };
  // 0x63 : LD IXH, E (Undocumented)
  dd_instructions[0x63] = () => {
    cpu.ix = (cpu.ix & 0xff) | (cpu.e << 8);
  };
  // 0x64 : LD IXH, IXH (Undocumented)
  dd_instructions[0x64] = () => {
    // No-op.
  };
  // 0x65 : LD IXH, IXL (Undocumented)
  dd_instructions[0x65] = () => {
    cpu.ix = (cpu.ix & 0xff) | ((cpu.ix & 0xff) << 8);
  };
  // 0x66 : LD H, (IX+n)
  dd_instructions[0x66] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.h = cb.mem_read((cpu.ix + offset) & 0xffff);
  };
  // 0x67 : LD IXH, A (Undocumented)
  dd_instructions[0x67] = () => {
    cpu.ix = (cpu.ix & 0xff) | (cpu.a << 8);
  };
  // 0x68 : LD IXL, B (Undocumented)
  dd_instructions[0x68] = () => {
    cpu.ix = (cpu.ix & 0xff00) | cpu.b;
  };
  // 0x69 : LD IXL, C (Undocumented)
  dd_instructions[0x69] = () => {
    cpu.ix = (cpu.ix & 0xff00) | cpu.c;
  };
  // 0x6a : LD IXL, D (Undocumented)
  dd_instructions[0x6a] = () => {
    cpu.ix = (cpu.ix & 0xff00) | cpu.d;
  };
  // 0x6b : LD IXL, E (Undocumented)
  dd_instructions[0x6b] = () => {
    cpu.ix = (cpu.ix & 0xff00) | cpu.e;
  };
  // 0x6c : LD IXL, IXH (Undocumented)
  dd_instructions[0x6c] = () => {
    cpu.ix = (cpu.ix & 0xff00) | (cpu.ix >>> 8);
  };
  // 0x6d : LD IXL, IXL (Undocumented)
  dd_instructions[0x6d] = () => {
    // No-op.
  };
  // 0x6e : LD L, (IX+n)
  dd_instructions[0x6e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.l = cb.mem_read((cpu.ix + offset) & 0xffff);
  };
  // 0x6f : LD IXL, A (Undocumented)
  dd_instructions[0x6f] = () => {
    cpu.ix = (cpu.ix & 0xff00) | cpu.a;
  };
  // 0x70 : LD (IX+n), B
  dd_instructions[0x70] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cb.mem_write((cpu.ix + offset) & 0xffff, cpu.b);
  };
  // 0x71 : LD (IX+n), C
  dd_instructions[0x71] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cb.mem_write((cpu.ix + offset) & 0xffff, cpu.c);
  };
  // 0x72 : LD (IX+n), D
  dd_instructions[0x72] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cb.mem_write((cpu.ix + offset) & 0xffff, cpu.d);
  };
  // 0x73 : LD (IX+n), E
  dd_instructions[0x73] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cb.mem_write((cpu.ix + offset) & 0xffff, cpu.e);
  };
  // 0x74 : LD (IX+n), H
  dd_instructions[0x74] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cb.mem_write((cpu.ix + offset) & 0xffff, cpu.h);
  };
  // 0x75 : LD (IX+n), L
  dd_instructions[0x75] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cb.mem_write((cpu.ix + offset) & 0xffff, cpu.l);
  };
  // 0x77 : LD (IX+n), A
  dd_instructions[0x77] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cb.mem_write((cpu.ix + offset) & 0xffff, cpu.a);
  };
  // 0x7c : LD A, IXH (Undocumented)
  dd_instructions[0x7c] = () => {
    cpu.a = (cpu.ix >>> 8) & 0xff;
  };
  // 0x7d : LD A, IXL (Undocumented)
  dd_instructions[0x7d] = () => {
    cpu.a = cpu.ix & 0xff;
  };
  // 0x7e : LD A, (IX+n)
  dd_instructions[0x7e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.a = cb.mem_read((cpu.ix + offset) & 0xffff);
  };
  // 0x84 : ADD A, IXH (Undocumented)
  dd_instructions[0x84] = () => {
    do_add((cpu.ix >>> 8) & 0xff);
  };
  // 0x85 : ADD A, IXL (Undocumented)
  dd_instructions[0x85] = () => {
    do_add(cpu.ix & 0xff);
  };
  // 0x86 : ADD A, (IX+n)
  dd_instructions[0x86] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    do_add(cb.mem_read((cpu.ix + offset) & 0xffff));
  };
  // 0x8c : ADC A, IXH (Undocumented)
  dd_instructions[0x8c] = () => {
    do_adc((cpu.ix >>> 8) & 0xff);
  };
  // 0x8d : ADC A, IXL (Undocumented)
  dd_instructions[0x8d] = () => {
    do_adc(cpu.ix & 0xff);
  };
  // 0x8e : ADC A, (IX+n)
  dd_instructions[0x8e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    do_adc(cb.mem_read((cpu.ix + offset) & 0xffff));
  };
  // 0x94 : SUB IXH (Undocumented)
  dd_instructions[0x94] = () => {
    do_sub((cpu.ix >>> 8) & 0xff);
  };
  // 0x95 : SUB IXL (Undocumented)
  dd_instructions[0x95] = () => {
    do_sub(cpu.ix & 0xff);
  };
  // 0x96 : SUB A, (IX+n)
  dd_instructions[0x96] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    do_sub(cb.mem_read((cpu.ix + offset) & 0xffff));
  };
  // 0x9c : SBC IXH (Undocumented)
  dd_instructions[0x9c] = () => {
    do_sbc((cpu.ix >>> 8) & 0xff);
  };
  // 0x9d : SBC IXL (Undocumented)
  dd_instructions[0x9d] = () => {
    do_sbc(cpu.ix & 0xff);
  };
  // 0x9e : SBC A, (IX+n)
  dd_instructions[0x9e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    do_sbc(cb.mem_read((cpu.ix + offset) & 0xffff));
  };
  // 0xa4 : AND IXH (Undocumented)
  dd_instructions[0xa4] = () => {
    do_and((cpu.ix >>> 8) & 0xff);
  };
  // 0xa5 : AND IXL (Undocumented)
  dd_instructions[0xa5] = () => {
    do_and(cpu.ix & 0xff);
  };
  // 0xa6 : AND A, (IX+n)
  dd_instructions[0xa6] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    do_and(cb.mem_read((cpu.ix + offset) & 0xffff));
  };
  // 0xac : XOR IXH (Undocumented)
  dd_instructions[0xac] = () => {
    do_xor((cpu.ix >>> 8) & 0xff);
  };
  // 0xad : XOR IXL (Undocumented)
  dd_instructions[0xad] = () => {
    do_xor(cpu.ix & 0xff);
  };
  // 0xae : XOR A, (IX+n)
  dd_instructions[0xae] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    do_xor(cb.mem_read((cpu.ix + offset) & 0xffff));
  };
  // 0xb4 : OR IXH (Undocumented)
  dd_instructions[0xb4] = () => {
    do_or((cpu.ix >>> 8) & 0xff);
  };
  // 0xb5 : OR IXL (Undocumented)
  dd_instructions[0xb5] = () => {
    do_or(cpu.ix & 0xff);
  };
  // 0xb6 : OR A, (IX+n)
  dd_instructions[0xb6] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    do_or(cb.mem_read((cpu.ix + offset) & 0xffff));
  };
  // 0xbc : CP IXH (Undocumented)
  dd_instructions[0xbc] = () => {
    do_cp((cpu.ix >>> 8) & 0xff);
  };
  // 0xbd : CP IXL (Undocumented)
  dd_instructions[0xbd] = () => {
    do_cp(cpu.ix & 0xff);
  };
  // 0xbe : CP A, (IX+n)
  dd_instructions[0xbe] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    do_cp(cb.mem_read((cpu.ix + offset) & 0xffff));
  };
  // 0xcb : CB Prefix (IX bit instructions)
  dd_instructions[0xcb] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const offset = get_signed_offset_byte(cb.mem_read(cpu.pc));
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const opcode1 = cb.mem_read(cpu.pc);
    let value;

    // As with the "normal" CB prefix, we implement the DDCB prefix
    //  by decoding the opcode directly, rather than using a table.
    if (opcode1 < 0x40) {
      // Shift and rotate instructions.
      const ddcb_functions = [
        do_rlc,
        do_rrc,
        do_rl,
        do_rr,
        do_sla,
        do_sra,
        do_sll,
        do_srl,
      ];

      // Most of the opcodes in this range are not valid,
      //  so we map this opcode onto one of the ones that is.
      const func = ddcb_functions[(opcode1 & 0x38) >>> 3];
      value = func(cb.mem_read((cpu.ix + offset) & 0xffff));

      cb.mem_write((cpu.ix + offset) & 0xffff, value);
    } else {
      const bit_number = (opcode1 & 0x38) >>> 3;

      if (opcode1 < 0x80) {
        // BIT
        cpu.flags.N = 0;
        cpu.flags.H = 1;
        cpu.flags.Z = !(
          cb.mem_read((cpu.ix + offset) & 0xffff) &
          (1 << bit_number)
        )
          ? 1
          : 0;
        cpu.flags.P = cpu.flags.Z;
        cpu.flags.S = bit_number === 7 && !cpu.flags.Z ? 1 : 0;
      } else if (opcode1 < 0xc0) {
        // RES
        value =
          cb.mem_read((cpu.ix + offset) & 0xffff) & ~(1 << bit_number) & 0xff;
        cb.mem_write((cpu.ix + offset) & 0xffff, value);
      } else {
        // SET
        value = cb.mem_read((cpu.ix + offset) & 0xffff) | (1 << bit_number);
        cb.mem_write((cpu.ix + offset) & 0xffff, value);
      }
    }

    // This implements the undocumented shift, RES, and SET opcodes,
    //  which write their result to memory and also to an 8080 register.
    if (value !== undefined) {
      if ((opcode1 & 0x07) === 0) cpu.b = value;
      else if ((opcode1 & 0x07) === 1) cpu.c = value;
      else if ((opcode1 & 0x07) === 2) cpu.d = value;
      else if ((opcode1 & 0x07) === 3) cpu.e = value;
      else if ((opcode1 & 0x07) === 4) cpu.h = value;
      else if ((opcode1 & 0x07) === 5) cpu.l = value;
      // 6 is the documented opcode, which doesn't set a register.
      else if ((opcode1 & 0x07) === 7) cpu.a = value;
    }

    cpu.cycle_counter += cycle_counts_cb[opcode1] + 8;
  };
  // 0xe1 : POP IX
  dd_instructions[0xe1] = () => {
    cpu.ix = pop_word();
  };
  // 0xe3 : EX (SP), IX
  dd_instructions[0xe3] = () => {
    const temp = cpu.ix;
    cpu.ix = cb.mem_read(cpu.sp);
    cpu.ix |= cb.mem_read((cpu.sp + 1) & 0xffff) << 8;
    cb.mem_write(cpu.sp, temp & 0xff);
    cb.mem_write((cpu.sp + 1) & 0xffff, (temp >>> 8) & 0xff);
  };
  // 0xe5 : PUSH IX
  dd_instructions[0xe5] = () => {
    pushWord(cpu, cb, cpu.ix);
  };
  // 0xe9 : JP (IX)
  dd_instructions[0xe9] = () => {
    cpu.pc = (cpu.ix - 1) & 0xffff;
  };
  // 0xf9 : LD SP, IX
  dd_instructions[0xf9] = () => {
    cpu.sp = cpu.ix;
  };

  // ////////////////////////////////////////////////////////////////////////////
  // This table of ED opcodes is pretty sparse;
  //  there are not very many valid ED-prefixed opcodes in the Z80,
  //  and many of the ones that are valid are not documented.
  // ////////////////////////////////////////////////////////////////////////////
  const ed_instructions: any[] = [];
  // 0x40 : IN B, (C)
  ed_instructions[0x40] = () => {
    cpu.b = do_in((cpu.b << 8) | cpu.c);
  };
  // 0x41 : OUT (C), B
  ed_instructions[0x41] = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cpu.b);
  };
  // 0x42 : SBC HL, BC
  ed_instructions[0x42] = () => {
    do_hl_sbc(cpu.c | (cpu.b << 8));
  };
  // 0x43 : LD (nn), BC
  ed_instructions[0x43] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cb.mem_write(address, cpu.c);
    cb.mem_write((address + 1) & 0xffff, cpu.b);
  };
  // 0x44 : NEG
  ed_instructions[0x44] = () => do_neg;
  // 0x45 : RETN
  ed_instructions[0x45] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
    cpu.iff1 = cpu.iff2;
  };
  // 0x46 : IM 0
  ed_instructions[0x46] = () => {
    cpu.imode = 0;
  };
  // 0x47 : LD I, A
  ed_instructions[0x47] = () => {
    cpu.i = cpu.a;
  };
  // 0x48 : IN C, (C)
  ed_instructions[0x48] = () => {
    cpu.c = do_in((cpu.b << 8) | cpu.c);
  };
  // 0x49 : OUT (C), C
  ed_instructions[0x49] = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cpu.c);
  };
  // 0x4a : ADC HL, BC
  ed_instructions[0x4a] = () => {
    do_hl_adc(cpu.c | (cpu.b << 8));
  };
  // 0x4b : LD BC, (nn)
  ed_instructions[0x4b] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cpu.c = cb.mem_read(address);
    cpu.b = cb.mem_read((address + 1) & 0xffff);
  };
  // 0x4c : NEG (Undocumented)
  ed_instructions[0x4c] = () => do_neg;
  // 0x4d : RETI
  ed_instructions[0x4d] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
  };
  // 0x4e : IM 0 (Undocumented)
  ed_instructions[0x4e] = () => {
    cpu.imode = 0;
  };
  // 0x4f : LD R, A
  ed_instructions[0x4f] = () => {
    cpu.r = cpu.a;
  };
  // 0x50 : IN D, (C)
  ed_instructions[0x50] = () => {
    cpu.d = do_in((cpu.b << 8) | cpu.c);
  };
  // 0x51 : OUT (C), D
  ed_instructions[0x51] = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cpu.d);
  };
  // 0x52 : SBC HL, DE
  ed_instructions[0x52] = () => {
    do_hl_sbc(cpu.e | (cpu.d << 8));
  };
  // 0x53 : LD (nn), DE
  ed_instructions[0x53] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cb.mem_write(address, cpu.e);
    cb.mem_write((address + 1) & 0xffff, cpu.d);
  };
  // 0x54 : NEG (Undocumented)
  ed_instructions[0x54] = () => do_neg;
  // 0x55 : RETN
  ed_instructions[0x55] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
    cpu.iff1 = cpu.iff2;
  };
  // 0x56 : IM 1
  ed_instructions[0x56] = () => {
    cpu.imode = 1;
  };
  // 0x57 : LD A, I
  ed_instructions[0x57] = () => {
    cpu.a = cpu.i;
    cpu.flags.S = cpu.i & 0x80 ? 1 : 0;
    cpu.flags.Z = cpu.i ? 0 : 1;
    cpu.flags.H = 0;
    cpu.flags.P = cpu.iff2;
    cpu.flags.N = 0;
  };
  // 0x58 : IN E, (C)
  ed_instructions[0x58] = () => {
    cpu.e = do_in((cpu.b << 8) | cpu.c);
  };
  // 0x59 : OUT (C), E
  ed_instructions[0x59] = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cpu.e);
  };
  // 0x5a : ADC HL, DE
  ed_instructions[0x5a] = () => {
    do_hl_adc(cpu.e | (cpu.d << 8));
  };
  // 0x5b : LD DE, (nn)
  ed_instructions[0x5b] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cpu.e = cb.mem_read(address);
    cpu.d = cb.mem_read((address + 1) & 0xffff);
  };
  // 0x5c : NEG (Undocumented)
  ed_instructions[0x5c] = () => do_neg;
  // 0x5d : RETN
  ed_instructions[0x5d] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
    cpu.iff1 = cpu.iff2;
  };
  // 0x5e : IM 2
  ed_instructions[0x5e] = () => {
    cpu.imode = 2;
  };
  // 0x5f : LD A, R
  ed_instructions[0x5f] = () => {
    cpu.a = cpu.r;
    cpu.flags.P = cpu.iff2;
  };
  // 0x60 : IN H, (C)
  ed_instructions[0x60] = () => {
    cpu.h = do_in((cpu.b << 8) | cpu.c);
  };
  // 0x61 : OUT (C), H
  ed_instructions[0x61] = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cpu.h);
  };
  // 0x62 : SBC HL, HL
  ed_instructions[0x62] = () => {
    do_hl_sbc(cpu.l | (cpu.h << 8));
  };
  // 0x63 : LD (nn), HL (Undocumented)
  ed_instructions[0x63] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cb.mem_write(address, cpu.l);
    cb.mem_write((address + 1) & 0xffff, cpu.h);
  };
  // 0x64 : NEG (Undocumented)
  ed_instructions[0x64] = () => do_neg;
  // 0x65 : RETN
  ed_instructions[0x65] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
    cpu.iff1 = cpu.iff2;
  };
  // 0x66 : IM 0
  ed_instructions[0x66] = () => {
    cpu.imode = 0;
  };
  // 0x67 : RRD
  ed_instructions[0x67] = () => {
    let hl_value = cb.mem_read(cpu.l | (cpu.h << 8));
    const temp1 = hl_value & 0x0f;
    const temp2 = cpu.a & 0x0f;
    hl_value = ((hl_value & 0xf0) >>> 4) | (temp2 << 4);
    cpu.a = (cpu.a & 0xf0) | temp1;
    cb.mem_write(cpu.l | (cpu.h << 8), hl_value);

    cpu.flags.S = cpu.a & 0x80 ? 1 : 0;
    cpu.flags.Z = cpu.a ? 0 : 1;
    cpu.flags.H = 0;
    cpu.flags.P = parity_bits[cpu.a] ? 1 : 0;
    cpu.flags.N = 0;
    update_xy_flags(cpu.a);
  };
  // 0x68 : IN L, (C)
  ed_instructions[0x68] = () => {
    cpu.l = do_in((cpu.b << 8) | cpu.c);
  };
  // 0x69 : OUT (C), L
  ed_instructions[0x69] = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cpu.l);
  };
  // 0x6a : ADC HL, HL
  ed_instructions[0x6a] = () => {
    do_hl_adc(cpu.l | (cpu.h << 8));
  };
  // 0x6b : LD HL, (nn) (Undocumented)
  ed_instructions[0x6b] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cpu.l = cb.mem_read(address);
    cpu.h = cb.mem_read((address + 1) & 0xffff);
  };
  // 0x6c : NEG (Undocumented)
  ed_instructions[0x6c] = () => do_neg;
  // 0x6d : RETN
  ed_instructions[0x6d] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
    cpu.iff1 = cpu.iff2;
  };
  // 0x6e : IM 0 (Undocumented)
  ed_instructions[0x6e] = () => {
    cpu.imode = 0;
  };
  // 0x6f : RLD
  ed_instructions[0x6f] = () => {
    let hl_value = cb.mem_read(cpu.l | (cpu.h << 8));
    const temp1 = hl_value & 0xf0;
    const temp2 = cpu.a & 0x0f;
    hl_value = ((hl_value & 0x0f) << 4) | temp2;
    cpu.a = (cpu.a & 0xf0) | (temp1 >>> 4);
    cb.mem_write(cpu.l | (cpu.h << 8), hl_value);

    cpu.flags.S = cpu.a & 0x80 ? 1 : 0;
    cpu.flags.Z = cpu.a ? 0 : 1;
    cpu.flags.H = 0;
    cpu.flags.P = parity_bits[cpu.a] ? 1 : 0;
    cpu.flags.N = 0;
    update_xy_flags(cpu.a);
  };
  // 0x70 : IN (C) (Undocumented)
  ed_instructions[0x70] = () => {
    do_in((cpu.b << 8) | cpu.c);
  };
  // 0x71 : OUT (C), 0 (Undocumented)
  ed_instructions[0x71] = () => {
    cb.io_write((cpu.b << 8) | cpu.c, 0);
  };
  // 0x72 : SBC HL, SP
  ed_instructions[0x72] = () => {
    do_hl_sbc(cpu.sp);
  };
  // 0x73 : LD (nn), SP
  ed_instructions[0x73] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cb.mem_write(address, cpu.sp & 0xff);
    cb.mem_write((address + 1) & 0xffff, (cpu.sp >>> 8) & 0xff);
  };
  // 0x74 : NEG (Undocumented)
  ed_instructions[0x74] = () => do_neg;
  // 0x75 : RETN
  ed_instructions[0x75] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
    cpu.iff1 = cpu.iff2;
  };
  // 0x76 : IM 1
  ed_instructions[0x76] = () => {
    cpu.imode = 1;
  };
  // 0x78 : IN A, (C)
  ed_instructions[0x78] = () => {
    cpu.a = do_in((cpu.b << 8) | cpu.c);
  };
  // 0x79 : OUT (C), A
  ed_instructions[0x79] = () => {
    cb.io_write((cpu.b << 8) | cpu.c, cpu.a);
  };
  // 0x7a : ADC HL, SP
  ed_instructions[0x7a] = () => {
    do_hl_adc(cpu.sp);
  };
  // 0x7b : LD SP, (nn)
  ed_instructions[0x7b] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cpu.sp = cb.mem_read(address);
    cpu.sp |= cb.mem_read((address + 1) & 0xffff) << 8;
  };
  // 0x7c : NEG (Undocumented)
  ed_instructions[0x7c] = () => do_neg;
  // 0x7d : RETN
  ed_instructions[0x7d] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
    cpu.iff1 = cpu.iff2;
  };
  // 0x7e : IM 2
  ed_instructions[0x7e] = () => {
    cpu.imode = 2;
  };
  // 0xa0 : LDI
  ed_instructions[0xa0] = () => {
    do_ldi();
  };
  // 0xa1 : CPI
  ed_instructions[0xa1] = () => {
    do_cpi();
  };
  // 0xa2 : INI
  ed_instructions[0xa2] = () => {
    do_ini();
  };
  // 0xa3 : OUTI
  ed_instructions[0xa3] = () => {
    do_outi();
  };
  // 0xa8 : LDD
  ed_instructions[0xa8] = () => {
    do_ldd();
  };
  // 0xa9 : CPD
  ed_instructions[0xa9] = () => {
    do_cpd();
  };
  // 0xaa : IND
  ed_instructions[0xaa] = () => {
    do_ind();
  };
  // 0xab : OUTD
  ed_instructions[0xab] = () => {
    do_outd();
  };
  // 0xb0 : LDIR
  ed_instructions[0xb0] = () => {
    do_ldi();
    if (cpu.b || cpu.c) {
      cpu.cycle_counter += 5;
      cpu.pc = (cpu.pc - 2) & 0xffff;
    }
  };
  // 0xb1 : CPIR
  ed_instructions[0xb1] = () => {
    do_cpi();
    if (!cpu.flags.Z && (cpu.b || cpu.c)) {
      cpu.cycle_counter += 5;
      cpu.pc = (cpu.pc - 2) & 0xffff;
    }
  };
  // 0xb2 : INIR
  ed_instructions[0xb2] = () => {
    do_ini();
    if (cpu.b) {
      cpu.cycle_counter += 5;
      cpu.pc = (cpu.pc - 2) & 0xffff;
    }
  };
  // 0xb3 : OTIR
  ed_instructions[0xb3] = () => {
    do_outi();
    if (cpu.b) {
      cpu.cycle_counter += 5;
      cpu.pc = (cpu.pc - 2) & 0xffff;
    }
  };
  // 0xb8 : LDDR
  ed_instructions[0xb8] = () => {
    do_ldd();
    if (cpu.b || cpu.c) {
      cpu.cycle_counter += 5;
      cpu.pc = (cpu.pc - 2) & 0xffff;
    }
  };
  // 0xb9 : CPDR
  ed_instructions[0xb9] = () => {
    do_cpd();
    if (!cpu.flags.Z && (cpu.b || cpu.c)) {
      cpu.cycle_counter += 5;
      cpu.pc = (cpu.pc - 2) & 0xffff;
    }
  };
  // 0xba : INDR
  ed_instructions[0xba] = () => {
    do_ind();
    if (cpu.b) {
      cpu.cycle_counter += 5;
      cpu.pc = (cpu.pc - 2) & 0xffff;
    }
  };
  // 0xbb : OTDR
  ed_instructions[0xbb] = () => {
    do_outd();
    if (cpu.b) {
      cpu.cycle_counter += 5;
      cpu.pc = (cpu.pc - 2) & 0xffff;
    }
  };

  // ////////////////////////////////////////////////////////////////////////////
  // This table contains the implementations for the instructions that weren't
  //  implemented directly in the decoder (everything but the 8-bit
  //  register loads and the accumulator ALU instructions, in other words).
  // Similar tables for the ED and DD/FD prefixes follow this one.
  // ////////////////////////////////////////////////////////////////////////////
  const instructions: any[] = [];

  // 0x00 : NOP
  instructions[0x00] = () => {
    // do nothing
  };
  // 0x01 : LD BC, nn
  instructions[0x01] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.c = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.b = cb.mem_read(cpu.pc);
  };
  // 0x02 : LD (BC), A
  instructions[0x02] = () => {
    cb.mem_write(cpu.c | (cpu.b << 8), cpu.a);
  };
  // 0x03 : INC BC
  instructions[0x03] = () => {
    let result = cpu.c | (cpu.b << 8);
    result += 1;
    cpu.c = result & 0xff;
    cpu.b = (result & 0xff00) >>> 8;
  };
  // 0x04 : INC B
  instructions[0x04] = () => {
    cpu.b = do_inc(cpu.b);
  };
  // 0x05 : DEC B
  instructions[0x05] = () => {
    cpu.b = do_dec(cpu.b);
  };
  // 0x06 : LD B, n
  instructions[0x06] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.b = cb.mem_read(cpu.pc);
  };
  // 0x07 : RLCA
  instructions[0x07] = () => {
    // This instruction is implemented as a special case of the
    //  more general Z80-specific RLC instruction.
    // Specifially, RLCA is a version of RLC A that affects fewer flags.
    // The same applies to RRCA, RLA, and RRA.
    const temp_s = cpu.flags.S;
    const temp_z = cpu.flags.Z;
    const temp_p = cpu.flags.P;
    cpu.a = do_rlc(cpu.a);
    cpu.flags.S = temp_s;
    cpu.flags.Z = temp_z;
    cpu.flags.P = temp_p;
  };
  // 0x08 : EX AF, AF'
  instructions[0x08] = () => {
    let temp = cpu.a;
    cpu.a = cpu.a_prime;
    cpu.a_prime = temp;

    temp = get_flags_register();
    setFlagsRegister(cpu, get_flags_prime());
    set_flags_prime(temp);
  };
  // 0x09 : ADD HL, BC
  instructions[0x09] = () => {
    do_hl_add(cpu.c | (cpu.b << 8));
  };
  // 0x0a : LD A, (BC)
  instructions[0x0a] = () => {
    cpu.a = cb.mem_read(cpu.c | (cpu.b << 8));
  };
  // 0x0b : DEC BC
  instructions[0x0b] = () => {
    let result = cpu.c | (cpu.b << 8);
    result -= 1;
    cpu.c = result & 0xff;
    cpu.b = (result & 0xff00) >>> 8;
  };
  // 0x0c : INC C
  instructions[0x0c] = () => {
    cpu.c = do_inc(cpu.c);
  };
  // 0x0d : DEC C
  instructions[0x0d] = () => {
    cpu.c = do_dec(cpu.c);
  };
  // 0x0e : LD C, n
  instructions[0x0e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.c = cb.mem_read(cpu.pc);
  };
  // 0x0f : RRCA
  instructions[0x0f] = () => {
    const temp_s = cpu.flags.S;
    const temp_z = cpu.flags.Z;
    const temp_p = cpu.flags.P;
    cpu.a = do_rrc(cpu.a);
    cpu.flags.S = temp_s;
    cpu.flags.Z = temp_z;
    cpu.flags.P = temp_p;
  };
  // 0x10 : DJNZ nn
  instructions[0x10] = () => {
    cpu.b = (cpu.b - 1) & 0xff;
    do_conditional_relative_jump(cpu.b !== 0);
  };
  // 0x11 : LD DE, nn
  instructions[0x11] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.e = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.d = cb.mem_read(cpu.pc);
  };
  // 0x12 : LD (DE), A
  instructions[0x12] = () => {
    cb.mem_write(cpu.e | (cpu.d << 8), cpu.a);
  };
  // 0x13 : INC DE
  instructions[0x13] = () => {
    let result = cpu.e | (cpu.d << 8);
    result += 1;
    cpu.e = result & 0xff;
    cpu.d = (result & 0xff00) >>> 8;
  };
  // 0x14 : INC D
  instructions[0x14] = () => {
    cpu.d = do_inc(cpu.d);
  };
  // 0x15 : DEC D
  instructions[0x15] = () => {
    cpu.d = do_dec(cpu.d);
  };
  // 0x16 : LD D, n
  instructions[0x16] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.d = cb.mem_read(cpu.pc);
  };
  // 0x17 : RLA
  instructions[0x17] = () => {
    const temp_s = cpu.flags.S;
    const temp_z = cpu.flags.Z;
    const temp_p = cpu.flags.P;
    cpu.a = do_rl(cpu.a);
    cpu.flags.S = temp_s;
    cpu.flags.Z = temp_z;
    cpu.flags.P = temp_p;
  };
  // 0x18 : JR n
  instructions[0x18] = () => {
    const offset = get_signed_offset_byte(cb.mem_read((cpu.pc + 1) & 0xffff));
    cpu.pc = (cpu.pc + offset + 1) & 0xffff;
  };
  // 0x19 : ADD HL, DE
  instructions[0x19] = () => {
    do_hl_add(cpu.e | (cpu.d << 8));
  };
  // 0x1a : LD A, (DE)
  instructions[0x1a] = () => {
    cpu.a = cb.mem_read(cpu.e | (cpu.d << 8));
  };
  // 0x1b : DEC DE
  instructions[0x1b] = () => {
    let result = cpu.e | (cpu.d << 8);
    result -= 1;
    cpu.e = result & 0xff;
    cpu.d = (result & 0xff00) >>> 8;
  };
  // 0x1c : INC E
  instructions[0x1c] = () => {
    cpu.e = do_inc(cpu.e);
  };
  // 0x1d : DEC E
  instructions[0x1d] = () => {
    cpu.e = do_dec(cpu.e);
  };
  // 0x1e : LD E, n
  instructions[0x1e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.e = cb.mem_read(cpu.pc);
  };
  // 0x1f : RRA
  instructions[0x1f] = () => {
    const temp_s = cpu.flags.S;
    const temp_z = cpu.flags.Z;
    const temp_p = cpu.flags.P;
    cpu.a = do_rr(cpu.a);
    cpu.flags.S = temp_s;
    cpu.flags.Z = temp_z;
    cpu.flags.P = temp_p;
  };
  // 0x20 : JR NZ, n
  instructions[0x20] = () => {
    do_conditional_relative_jump(!cpu.flags.Z);
  };
  // 0x21 : LD HL, nn
  instructions[0x21] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.l = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.h = cb.mem_read(cpu.pc);
  };
  // 0x22 : LD (nn), HL
  instructions[0x22] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cb.mem_write(address, cpu.l);
    cb.mem_write((address + 1) & 0xffff, cpu.h);
  };
  // 0x23 : INC HL
  instructions[0x23] = () => {
    let result = cpu.l | (cpu.h << 8);
    result += 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;
  };
  // 0x24 : INC H
  instructions[0x24] = () => {
    cpu.h = do_inc(cpu.h);
  };
  // 0x25 : DEC H
  instructions[0x25] = () => {
    cpu.h = do_dec(cpu.h);
  };
  // 0x26 : LD H, n
  instructions[0x26] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.h = cb.mem_read(cpu.pc);
  };
  // 0x27 : DAA
  instructions[0x27] = () => {
    let temp = cpu.a;
    if (!cpu.flags.N) {
      if (cpu.flags.H || (cpu.a & 0x0f) > 9) temp += 0x06;
      if (cpu.flags.C || cpu.a > 0x99) temp += 0x60;
    } else {
      if (cpu.flags.H || (cpu.a & 0x0f) > 9) temp -= 0x06;
      if (cpu.flags.C || cpu.a > 0x99) temp -= 0x60;
    }

    cpu.flags.S = temp & 0x80 ? 1 : 0;
    cpu.flags.Z = !(temp & 0xff) ? 1 : 0;
    cpu.flags.H = (cpu.a & 0x10) ^ (temp & 0x10) ? 1 : 0;
    cpu.flags.P = parity_bits[temp & 0xff];
    // DAA never clears the carry flag if it was already set,
    //  but it is able to set the carry flag if it was clear.
    // Don't ask me, I don't know.
    // Note also that we check for a BCD carry, instead of the usual.
    cpu.flags.C = cpu.flags.C || cpu.a > 0x99 ? 1 : 0;

    cpu.a = temp & 0xff;

    update_xy_flags(cpu.a);
  };
  // 0x28 : JR Z, n
  instructions[0x28] = () => {
    do_conditional_relative_jump(!!cpu.flags.Z);
  };
  // 0x29 : ADD HL, HL
  instructions[0x29] = () => {
    do_hl_add(cpu.l | (cpu.h << 8));
  };
  // 0x2a : LD HL, (nn)
  instructions[0x2a] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cpu.l = cb.mem_read(address);
    cpu.h = cb.mem_read((address + 1) & 0xffff);
  };
  // 0x2b : DEC HL
  instructions[0x2b] = () => {
    let result = cpu.l | (cpu.h << 8);
    result -= 1;
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;
  };
  // 0x2c : INC L
  instructions[0x2c] = () => {
    cpu.l = do_inc(cpu.l);
  };
  // 0x2d : DEC L
  instructions[0x2d] = () => {
    cpu.l = do_dec(cpu.l);
  };
  // 0x2e : LD L, n
  instructions[0x2e] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.l = cb.mem_read(cpu.pc);
  };
  // 0x2f : CPL
  instructions[0x2f] = () => {
    cpu.a = ~cpu.a & 0xff;
    cpu.flags.N = 1;
    cpu.flags.H = 1;
    update_xy_flags(cpu.a);
  };
  // 0x30 : JR NC, n
  instructions[0x30] = () => {
    do_conditional_relative_jump(!cpu.flags.C);
  };
  // 0x31 : LD SP, nn
  instructions[0x31] = () => {
    cpu.sp =
      cb.mem_read((cpu.pc + 1) & 0xffff) |
      (cb.mem_read((cpu.pc + 2) & 0xffff) << 8);
    cpu.pc = (cpu.pc + 2) & 0xffff;
  };
  // 0x32 : LD (nn), A
  instructions[0x32] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cb.mem_write(address, cpu.a);
  };
  // 0x33 : INC SP
  instructions[0x33] = () => {
    cpu.sp = (cpu.sp + 1) & 0xffff;
  };
  // 0x34 : INC (HL)
  instructions[0x34] = () => {
    const address = cpu.l | (cpu.h << 8);
    cb.mem_write(address, do_inc(cb.mem_read(address)));
  };
  // 0x35 : DEC (HL)
  instructions[0x35] = () => {
    const address = cpu.l | (cpu.h << 8);
    cb.mem_write(address, do_dec(cb.mem_read(address)));
  };
  // 0x36 : LD (HL), n
  instructions[0x36] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cb.mem_write(cpu.l | (cpu.h << 8), cb.mem_read(cpu.pc));
  };
  // 0x37 : SCF
  instructions[0x37] = () => {
    cpu.flags.N = 0;
    cpu.flags.H = 0;
    cpu.flags.C = 1;
    update_xy_flags(cpu.a);
  };
  // 0x38 : JR C, n
  instructions[0x38] = () => {
    do_conditional_relative_jump(!!cpu.flags.C);
  };
  // 0x39 : ADD HL, SP
  instructions[0x39] = () => {
    do_hl_add(cpu.sp);
  };
  // 0x3a : LD A, (nn)
  instructions[0x3a] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    let address = cb.mem_read(cpu.pc);
    cpu.pc = (cpu.pc + 1) & 0xffff;
    address |= cb.mem_read(cpu.pc) << 8;

    cpu.a = cb.mem_read(address);
  };
  // 0x3b : DEC SP
  instructions[0x3b] = () => {
    cpu.sp = (cpu.sp - 1) & 0xffff;
  };
  // 0x3c : INC A
  instructions[0x3c] = () => {
    cpu.a = do_inc(cpu.a);
  };
  // 0x3d : DEC A
  instructions[0x3d] = () => {
    cpu.a = do_dec(cpu.a);
  };
  // 0x3e : LD A, n
  instructions[0x3e] = () => {
    cpu.a = cb.mem_read((cpu.pc + 1) & 0xffff);
    cpu.pc = (cpu.pc + 1) & 0xffff;
  };
  // 0x3f : CCF
  instructions[0x3f] = () => {
    cpu.flags.N = 0;
    cpu.flags.H = cpu.flags.C;
    cpu.flags.C = cpu.flags.C ? 0 : 1;
    update_xy_flags(cpu.a);
  };
  // 0xc0 : RET NZ
  instructions[0xc0] = () => {
    do_conditional_return(!cpu.flags.Z);
  };
  // 0xc1 : POP BC
  instructions[0xc1] = () => {
    const result = pop_word();
    cpu.c = result & 0xff;
    cpu.b = (result & 0xff00) >>> 8;
  };
  // 0xc2 : JP NZ, nn
  instructions[0xc2] = () => {
    do_conditional_absolute_jump(!cpu.flags.Z);
  };
  // 0xc3 : JP nn
  instructions[0xc3] = () => {
    cpu.pc =
      cb.mem_read((cpu.pc + 1) & 0xffff) |
      (cb.mem_read((cpu.pc + 2) & 0xffff) << 8);
    cpu.pc = (cpu.pc - 1) & 0xffff;
  };
  // 0xc4 : CALL NZ, nn
  instructions[0xc4] = () => {
    do_conditional_call(!cpu.flags.Z);
  };
  // 0xc5 : PUSH BC
  instructions[0xc5] = () => {
    pushWord(cpu, cb, cpu.c | (cpu.b << 8));
  };
  // 0xc6 : ADD A, n
  instructions[0xc6] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    do_add(cb.mem_read(cpu.pc));
  };
  // 0xc7 : RST 00h
  instructions[0xc7] = () => {
    do_reset(0x00);
  };
  // 0xc8 : RET Z
  instructions[0xc8] = () => {
    do_conditional_return(!!cpu.flags.Z);
  };
  // 0xc9 : RET
  instructions[0xc9] = () => {
    cpu.pc = (pop_word() - 1) & 0xffff;
  };
  // 0xca : JP Z, nn
  instructions[0xca] = () => {
    do_conditional_absolute_jump(!!cpu.flags.Z);
  };
  // 0xcb : CB Prefix
  instructions[0xcb] = () => {
    // R is incremented at the start of the second instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    cpu.r = (cpu.r & 0x80) | (((cpu.r & 0x7f) + 1) & 0x7f);

    // We don't have a table for this prefix,
    //  the instructions are all so uniform that we can directly decode them.
    cpu.pc = (cpu.pc + 1) & 0xffff;
    const opcode1 = cb.mem_read(cpu.pc);
    const bit_number = (opcode1 & 0x38) >>> 3;
    const reg_code = opcode1 & 0x07;

    if (opcode1 < 0x40) {
      // Shift/rotate instructions
      const op_array = [
        do_rlc,
        do_rrc,
        do_rl,
        do_rr,
        do_sla,
        do_sra,
        do_sll,
        do_srl,
      ];

      if (reg_code === 0) cpu.b = op_array[bit_number](cpu.b);
      else if (reg_code === 1) cpu.c = op_array[bit_number](cpu.c);
      else if (reg_code === 2) cpu.d = op_array[bit_number](cpu.d);
      else if (reg_code === 3) cpu.e = op_array[bit_number](cpu.e);
      else if (reg_code === 4) cpu.h = op_array[bit_number](cpu.h);
      else if (reg_code === 5) cpu.l = op_array[bit_number](cpu.l);
      else if (reg_code === 6) {
        cb.mem_write(
          cpu.l | (cpu.h << 8),
          op_array[bit_number](cb.mem_read(cpu.l | (cpu.h << 8)))
        );
      } else if (reg_code === 7) cpu.a = op_array[bit_number](cpu.a);
    } else if (opcode1 < 0x80) {
      // BIT instructions
      if (reg_code === 0) cpu.flags.Z = !(cpu.b & (1 << bit_number)) ? 1 : 0;
      else if (reg_code === 1)
        cpu.flags.Z = !(cpu.c & (1 << bit_number)) ? 1 : 0;
      else if (reg_code === 2)
        cpu.flags.Z = !(cpu.d & (1 << bit_number)) ? 1 : 0;
      else if (reg_code === 3)
        cpu.flags.Z = !(cpu.e & (1 << bit_number)) ? 1 : 0;
      else if (reg_code === 4)
        cpu.flags.Z = !(cpu.h & (1 << bit_number)) ? 1 : 0;
      else if (reg_code === 5)
        cpu.flags.Z = !(cpu.l & (1 << bit_number)) ? 1 : 0;
      else if (reg_code === 6) {
        cpu.flags.Z = !(cb.mem_read(cpu.l | (cpu.h << 8)) & (1 << bit_number))
          ? 1
          : 0;
      } else if (reg_code === 7)
        cpu.flags.Z = !(cpu.a & (1 << bit_number)) ? 1 : 0;

      cpu.flags.N = 0;
      cpu.flags.H = 1;
      cpu.flags.P = cpu.flags.Z;
      cpu.flags.S = bit_number === 7 && !cpu.flags.Z ? 1 : 0;
      // For the BIT n, (HL) instruction, the X and Y flags are obtained
      //  from what is apparently an internal temporary register used for
      //  some of the 16-bit arithmetic instructions.
      // I haven't implemented that register here,
      //  so for now we'll set X and Y the same way for every BIT opcode,
      //  which means that they will usually be wrong for BIT n, (HL).
      cpu.flags.Y = bit_number === 5 && !cpu.flags.Z ? 1 : 0;
      cpu.flags.X = bit_number === 3 && !cpu.flags.Z ? 1 : 0;
    } else if (opcode1 < 0xc0) {
      // RES instructions
      if (reg_code === 0) cpu.b &= 0xff & ~(1 << bit_number);
      else if (reg_code === 1) cpu.c &= 0xff & ~(1 << bit_number);
      else if (reg_code === 2) cpu.d &= 0xff & ~(1 << bit_number);
      else if (reg_code === 3) cpu.e &= 0xff & ~(1 << bit_number);
      else if (reg_code === 4) cpu.h &= 0xff & ~(1 << bit_number);
      else if (reg_code === 5) cpu.l &= 0xff & ~(1 << bit_number);
      else if (reg_code === 6) {
        cb.mem_write(
          cpu.l | (cpu.h << 8),
          cb.mem_read(cpu.l | (cpu.h << 8)) & ~(1 << bit_number)
        );
      } else if (reg_code === 7) cpu.a &= 0xff & ~(1 << bit_number);
    } else {
      // SET instructions
      if (reg_code === 0) cpu.b |= 1 << bit_number;
      else if (reg_code === 1) cpu.c |= 1 << bit_number;
      else if (reg_code === 2) cpu.d |= 1 << bit_number;
      else if (reg_code === 3) cpu.e |= 1 << bit_number;
      else if (reg_code === 4) cpu.h |= 1 << bit_number;
      else if (reg_code === 5) cpu.l |= 1 << bit_number;
      else if (reg_code === 6) {
        cb.mem_write(
          cpu.l | (cpu.h << 8),
          cb.mem_read(cpu.l | (cpu.h << 8)) | (1 << bit_number)
        );
      } else if (reg_code === 7) cpu.a |= 1 << bit_number;
    }

    cpu.cycle_counter += cycle_counts_cb[opcode1];
  };
  // 0xcc : CALL Z, nn
  instructions[0xcc] = () => {
    do_conditional_call(!!cpu.flags.Z);
  };
  // 0xcd : CALL nn
  instructions[0xcd] = () => {
    pushWord(cpu, cb, (cpu.pc + 3) & 0xffff);
    cpu.pc =
      cb.mem_read((cpu.pc + 1) & 0xffff) |
      (cb.mem_read((cpu.pc + 2) & 0xffff) << 8);
    cpu.pc = (cpu.pc - 1) & 0xffff;
  };
  // 0xce : ADC A, n
  instructions[0xce] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    do_adc(cb.mem_read(cpu.pc));
  };
  // 0xcf : RST 08h
  instructions[0xcf] = () => {
    do_reset(0x08);
  };
  // 0xd0 : RET NC
  instructions[0xd0] = () => {
    do_conditional_return(!cpu.flags.C);
  };
  // 0xd1 : POP DE
  instructions[0xd1] = () => {
    const result = pop_word();
    cpu.e = result & 0xff;
    cpu.d = (result & 0xff00) >>> 8;
  };
  // 0xd2 : JP NC, nn
  instructions[0xd2] = () => {
    do_conditional_absolute_jump(!cpu.flags.C);
  };
  // 0xd3 : OUT (n), A
  instructions[0xd3] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cb.io_write((cpu.a << 8) | cb.mem_read(cpu.pc), cpu.a);
  };
  // 0xd4 : CALL NC, nn
  instructions[0xd4] = () => {
    do_conditional_call(!cpu.flags.C);
  };
  // 0xd5 : PUSH DE
  instructions[0xd5] = () => {
    pushWord(cpu, cb, cpu.e | (cpu.d << 8));
  };
  // 0xd6 : SUB n
  instructions[0xd6] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    do_sub(cb.mem_read(cpu.pc));
  };
  // 0xd7 : RST 10h
  instructions[0xd7] = () => {
    do_reset(0x10);
  };
  // 0xd8 : RET C
  instructions[0xd8] = () => {
    do_conditional_return(!!cpu.flags.C);
  };
  // 0xd9 : EXX
  instructions[0xd9] = () => {
    let temp = cpu.b;
    cpu.b = cpu.b_prime;
    cpu.b_prime = temp;
    temp = cpu.c;
    cpu.c = cpu.c_prime;
    cpu.c_prime = temp;
    temp = cpu.d;
    cpu.d = cpu.d_prime;
    cpu.d_prime = temp;
    temp = cpu.e;
    cpu.e = cpu.e_prime;
    cpu.e_prime = temp;
    temp = cpu.h;
    cpu.h = cpu.h_prime;
    cpu.h_prime = temp;
    temp = cpu.l;
    cpu.l = cpu.l_prime;
    cpu.l_prime = temp;
  };
  // 0xda : JP C, nn
  instructions[0xda] = () => {
    do_conditional_absolute_jump(!!cpu.flags.C);
  };
  // 0xdb : IN A, (n)
  instructions[0xdb] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    cpu.a = cb.io_read((cpu.a << 8) | cb.mem_read(cpu.pc));
  };
  // 0xdc : CALL C, nn
  instructions[0xdc] = () => {
    do_conditional_call(!!cpu.flags.C);
  };
  // 0xdd : DD Prefix (IX instructions)
  instructions[0xdd] = () => {
    // R is incremented at the start of the second instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    cpu.r = (cpu.r & 0x80) | (((cpu.r & 0x7f) + 1) & 0x7f);

    cpu.pc = (cpu.pc + 1) & 0xffff;
    const opcode1 = cb.mem_read(cpu.pc);
    const func = dd_instructions[opcode1];

    if (func) {
      // func = func.bind(this);
      func();
      cpu.cycle_counter += cycle_counts_dd[opcode1];
    } else {
      // Apparently if a DD opcode doesn't exist,
      //  it gets treated as an unprefixed opcode.
      // What we'll do to handle that is just back up the
      //  program counter, so that this byte gets decoded
      //  as a normal instruction.
      cpu.pc = (cpu.pc - 1) & 0xffff;
      // And we'll add in the cycle count for a NOP.
      cpu.cycle_counter += cycle_counts[0];
    }
  };
  // 0xde : SBC n
  instructions[0xde] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    do_sbc(cb.mem_read(cpu.pc));
  };
  // 0xdf : RST 18h
  instructions[0xdf] = () => {
    do_reset(0x18);
  };
  // 0xe0 : RET PO
  instructions[0xe0] = () => {
    do_conditional_return(!cpu.flags.P);
  };
  // 0xe1 : POP HL
  instructions[0xe1] = () => {
    const result = pop_word();
    cpu.l = result & 0xff;
    cpu.h = (result & 0xff00) >>> 8;
  };
  // 0xe2 : JP PO, (nn)
  instructions[0xe2] = () => {
    do_conditional_absolute_jump(!cpu.flags.P);
  };
  // 0xe3 : EX (SP), HL
  instructions[0xe3] = () => {
    let temp = cb.mem_read(cpu.sp);
    cb.mem_write(cpu.sp, cpu.l);
    cpu.l = temp;
    temp = cb.mem_read((cpu.sp + 1) & 0xffff);
    cb.mem_write((cpu.sp + 1) & 0xffff, cpu.h);
    cpu.h = temp;
  };
  // 0xe4 : CALL PO, nn
  instructions[0xe4] = () => {
    do_conditional_call(!cpu.flags.P);
  };
  // 0xe5 : PUSH HL
  instructions[0xe5] = () => {
    pushWord(cpu, cb, cpu.l | (cpu.h << 8));
  };
  // 0xe6 : AND n
  instructions[0xe6] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    do_and(cb.mem_read(cpu.pc));
  };
  // 0xe7 : RST 20h
  instructions[0xe7] = () => {
    do_reset(0x20);
  };
  // 0xe8 : RET PE
  instructions[0xe8] = () => {
    do_conditional_return(!!cpu.flags.P);
  };
  // 0xe9 : JP (HL)
  instructions[0xe9] = () => {
    cpu.pc = cpu.l | (cpu.h << 8);
    cpu.pc = (cpu.pc - 1) & 0xffff;
  };
  // 0xea : JP PE, nn
  instructions[0xea] = () => {
    do_conditional_absolute_jump(!!cpu.flags.P);
  };
  // 0xeb : EX DE, HL
  instructions[0xeb] = () => {
    let temp = cpu.d;
    cpu.d = cpu.h;
    cpu.h = temp;
    temp = cpu.e;
    cpu.e = cpu.l;
    cpu.l = temp;
  };
  // 0xec : CALL PE, nn
  instructions[0xec] = () => {
    do_conditional_call(!!cpu.flags.P);
  };
  // 0xed : ED Prefix
  instructions[0xed] = () => {
    // R is incremented at the start of the second instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    cpu.r = (cpu.r & 0x80) | (((cpu.r & 0x7f) + 1) & 0x7f);

    cpu.pc = (cpu.pc + 1) & 0xffff;
    const opcode1 = cb.mem_read(cpu.pc);
    const func = ed_instructions[opcode1];

    if (func) {
      // func = func.bind(this);
      func();
      cpu.cycle_counter += cycle_counts_ed[opcode1];
    } else {
      // If the opcode didn't exist, the whole thing is a two-byte NOP.
      cpu.cycle_counter += cycle_counts[0];
    }
  };
  // 0xee : XOR n
  instructions[0xee] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    do_xor(cb.mem_read(cpu.pc));
  };
  // 0xef : RST 28h
  instructions[0xef] = () => {
    do_reset(0x28);
  };
  // 0xf0 : RET P
  instructions[0xf0] = () => {
    do_conditional_return(!cpu.flags.S);
  };
  // 0xf1 : POP AF
  instructions[0xf1] = () => {
    const result = pop_word();
    setFlagsRegister(cpu, result & 0xff);
    cpu.a = (result & 0xff00) >>> 8;
  };
  // 0xf2 : JP P, nn
  instructions[0xf2] = () => {
    do_conditional_absolute_jump(!cpu.flags.S);
  };
  // 0xf3 : DI
  instructions[0xf3] = () => {
    // DI doesn't actually take effect until after the next instruction.
    cpu.do_delayed_di = true;
  };
  // 0xf4 : CALL P, nn
  instructions[0xf4] = () => {
    do_conditional_call(!cpu.flags.S);
  };
  // 0xf5 : PUSH AF
  instructions[0xf5] = () => {
    pushWord(cpu, cb, get_flags_register() | (cpu.a << 8));
  };
  // 0xf6 : OR n
  instructions[0xf6] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    do_or(cb.mem_read(cpu.pc));
  };
  // 0xf7 : RST 30h
  instructions[0xf7] = () => {
    do_reset(0x30);
  };
  // 0xf8 : RET M
  instructions[0xf8] = () => {
    do_conditional_return(!!cpu.flags.S);
  };
  // 0xf9 : LD SP, HL
  instructions[0xf9] = () => {
    cpu.sp = cpu.l | (cpu.h << 8);
  };
  // 0xfa : JP M, nn
  instructions[0xfa] = () => {
    do_conditional_absolute_jump(!!cpu.flags.S);
  };
  // 0xfb : EI
  instructions[0xfb] = () => {
    // EI doesn't actually take effect until after the next instruction.
    cpu.do_delayed_ei = true;
  };
  // 0xfc : CALL M, nn
  instructions[0xfc] = () => {
    do_conditional_call(!!cpu.flags.S);
  };
  // 0xfd : FD Prefix (IY instructions)
  instructions[0xfd] = () => {
    // R is incremented at the start of the second instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    cpu.r = (cpu.r & 0x80) | (((cpu.r & 0x7f) + 1) & 0x7f);

    cpu.pc = (cpu.pc + 1) & 0xffff;
    const opcode1 = cb.mem_read(cpu.pc);
    const func = dd_instructions[opcode1];

    if (func) {
      // Rather than copy and paste all the IX instructions into IY instructions,
      //  what we'll do is sneakily copy IY into IX, run the IX instruction,
      //  and then copy the result into IY and restore the old IX.
      const temp = cpu.ix;
      cpu.ix = cpu.iy;
      // func = func.bind(this);
      func();
      cpu.iy = cpu.ix;
      cpu.ix = temp;

      cpu.cycle_counter += cycle_counts_dd[opcode1];
    } else {
      // Apparently if an FD opcode doesn't exist,
      //  it gets treated as an unprefixed opcode.
      // What we'll do to handle that is just back up the
      //  program counter, so that this byte gets decoded
      //  as a normal instruction.
      cpu.pc = (cpu.pc - 1) & 0xffff;
      // And we'll add in the cycle count for a NOP.
      cpu.cycle_counter += cycle_counts[0];
    }
  };
  // 0xfe : CP n
  instructions[0xfe] = () => {
    cpu.pc = (cpu.pc + 1) & 0xffff;
    do_cp(cb.mem_read(cpu.pc));
  };
  // 0xff : RST 38h
  instructions[0xff] = () => {
    do_reset(0x38);
  };

  // The register-to-register loads and ALU instructions
  //  are all so uniform that we can decode them directly
  //  instead of going into the instruction array for them.
  // This function gets the operand for all of these instructions.
  // eslint-disable-next-line no-shadow
  const get_operand = (opcode: number) => {
    return (opcode & 0x07) === 0
      ? cpu.b
      : (opcode & 0x07) === 1
      ? cpu.c
      : (opcode & 0x07) === 2
      ? cpu.d
      : (opcode & 0x07) === 3
      ? cpu.e
      : (opcode & 0x07) === 4
      ? cpu.h
      : (opcode & 0x07) === 5
      ? cpu.l
      : (opcode & 0x07) === 6
      ? cb.mem_read(cpu.l | (cpu.h << 8))
      : cpu.a;
  };

  // Handle HALT right up front, because it fouls up our LD decoding
  //  by falling where LD (HL), (HL) ought to be.
  if (opcode === 0x76) {
    cpu.halted = true;
  } else if (opcode >= 0x40 && opcode < 0x80) {
    // This entire range is all 8-bit register loads.
    // Get the operand and assign it to the correct destination.
    const operand = get_operand(opcode);

    if ((opcode & 0x38) >>> 3 === 0) cpu.b = operand;
    else if ((opcode & 0x38) >>> 3 === 1) cpu.c = operand;
    else if ((opcode & 0x38) >>> 3 === 2) cpu.d = operand;
    else if ((opcode & 0x38) >>> 3 === 3) cpu.e = operand;
    else if ((opcode & 0x38) >>> 3 === 4) cpu.h = operand;
    else if ((opcode & 0x38) >>> 3 === 5) cpu.l = operand;
    else if ((opcode & 0x38) >>> 3 === 6) {
      cb.mem_write(cpu.l | (cpu.h << 8), operand);
    } else if ((opcode & 0x38) >>> 3 === 7) cpu.a = operand;
  } else if (opcode >= 0x80 && opcode < 0xc0) {
    // These are the 8-bit register ALU instructions.
    // We'll get the operand and then use this "jump table"
    //  to call the correct utility function for the instruction.
    const operand = get_operand(opcode);
    const op_array = [
      do_add,
      do_adc,
      do_sub,
      do_sbc,
      do_and,
      do_xor,
      do_or,
      do_cp,
    ];

    op_array[(opcode & 0x38) >>> 3](operand);
  } else {
    // This is one of the less formulaic instructions;
    //  we'll get the specific function for it from our array.
    const func = instructions[opcode];
    func();
  }

  // Update the cycle counter with however many cycles
  //  the base instruction took.
  // If this was a prefixed instruction, then
  //  the prefix handler has added its extra cycles already.
  cpu.cycle_counter += cycle_counts[opcode];
};

export function init(): Cpu {
  return {
    a: 0x00,
    b: 0x00,
    c: 0x00,
    d: 0x00,
    e: 0x00,
    h: 0x00,
    l: 0x00,
    // Now the special Z80 copies of the 8080 registers
    //  (the ones used for the SWAP instruction and such).
    a_prime: 0x00,
    b_prime: 0x00,
    c_prime: 0x00,
    d_prime: 0x00,
    e_prime: 0x00,
    h_prime: 0x00,
    l_prime: 0x00,
    // And now the Z80 index registers.
    ix: 0x0000,
    iy: 0x0000,
    // Then the "utility" registers: the interrupt vector,
    //  the memory refresh, the stack pointer, and the program counter.
    i: 0x00,
    r: 0x00,
    sp: 0xdff0,
    pc: 0x0000,
    // We don't keep an F register for the flags,
    //  because most of the time we're only accessing a single flag,
    //  so we optimize for that case and use utility functions
    //  for the rarer occasions when we need to access the whole register.
    flags: {
      S: 0,
      Z: 0,
      Y: 0,
      H: 0,
      X: 0,
      P: 0,
      N: 0,
      C: 0,
    },
    flags_prime: {
      S: 0,
      Z: 0,
      Y: 0,
      H: 0,
      X: 0,
      P: 0,
      N: 0,
      C: 0,
    },
    // And finally we have the interrupt mode and flip-flop registers.
    imode: 0,
    iff1: 0,
    iff2: 0,

    // These are all specific to this implementation, not Z80 features.
    // Keep track of whether we've had a HALT instruction called.
    halted: false,
    // EI and DI wait one instruction before they take effect,
    //  these flags tell us when we're in that wait state.
    do_delayed_di: false,
    do_delayed_ei: false,
    // This tracks the number of cycles spent in a single instruction run,
    //  including processing any prefixes and handling interrupts.
    cycle_counter: 0,
  };
}

// ////////////////////////////////////////////////////////////////////////////
// @public reset
//
// @brief Re-initialize the processor as if a reset or power on had occured
// ////////////////////////////////////////////////////////////////////////////
export const reset = (cpu: Cpu) => {
  // These registers are the ones that have predictable states
  //  immediately following a power-on or a reset.
  // The others are left alone, because their states are unpredictable.
  cpu.sp = 0xdff0;
  cpu.pc = 0x0000;
  cpu.a = 0x00;
  cpu.r = 0x00;
  setFlagsRegister(cpu, 0);
  // Start up with interrupts disabled.
  cpu.imode = 0;
  cpu.iff1 = 0;
  cpu.iff2 = 0;
  // Don't start halted or in a delayed DI or EI.
  cpu.halted = false;
  cpu.do_delayed_di = false;
  cpu.do_delayed_ei = false;
  // Obviously we've not used any cycles yet.
  cpu.cycle_counter = 0;
};

// ////////////////////////////////////////////////////////////////////////////
// @public run_instruction
//
// @brief Runs a single instruction
//
// @return The number of T cycles the instruction took to run,
//          plus any time that went into handling interrupts that fired
//          while this instruction was executing
// ////////////////////////////////////////////////////////////////////////////
export const execute = (cpu: Cpu, cb: Callbacks) => {
  if (!cpu.halted) {
    // If the previous instruction was a DI or an EI,
    //  we'll need to disable or enable interrupts
    //  after whatever instruction we're about to run is finished.
    let doing_delayed_di = false;
    let doing_delayed_ei = false;
    if (cpu.do_delayed_di) {
      cpu.do_delayed_di = false;
      doing_delayed_di = true;
    } else if (cpu.do_delayed_ei) {
      cpu.do_delayed_ei = false;
      doing_delayed_ei = true;
    }

    // R is incremented at the start of every instruction cycle,
    //  before the instruction actually runs.
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    cpu.r = (cpu.r & 0x80) | (((cpu.r & 0x7f) + 1) & 0x7f);

    // Read the byte at the PC and run the instruction it encodes.
    const opcode = cb.mem_read(cpu.pc);
    decodeInstruction(cpu, cb, opcode);
    cpu.pc = (cpu.pc + 1) & 0xffff;

    // Actually do the delayed interrupt disable/enable if we have one.
    if (doing_delayed_di) {
      cpu.iff1 = 0;
      cpu.iff2 = 0;
    } else if (doing_delayed_ei) {
      cpu.iff1 = 1;
      cpu.iff2 = 1;
    }

    // And finally clear out the cycle counter for the next instruction
    //  before returning it to the emulator core.
    const retval = cpu.cycle_counter;
    cpu.cycle_counter = 0;
    return retval;
  }
  // While we're halted, claim that we spent a cycle doing nothing,
  //  so that the rest of the emulator can still proceed.
  return 1;
};

// ////////////////////////////////////////////////////////////////////////////
// @public interrupt
//
// @brief Simulates pulsing the processor's INT (or NMI) pin
//
// @param non_maskable - true if this is a non-maskable interrupt
// @param data - the value to be placed on the data bus, if needed
// ////////////////////////////////////////////////////////////////////////////
export const interrupt = (
  cpu: Cpu,
  cb: Callbacks,
  non_maskable: boolean,
  data: number
) => {
  if (non_maskable) {
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    cpu.r = (cpu.r & 0x80) | (((cpu.r & 0x7f) + 1) & 0x7f);
    // Non-maskable interrupts are always handled the same way;
    //  clear IFF1 and then do a CALL 0x0066.
    // Also, all interrupts reset the HALT state.
    cpu.halted = false;
    cpu.iff2 = cpu.iff1;
    cpu.iff1 = 0;
    pushWord(cpu, cb, cpu.pc);
    cpu.pc = 0x66;
    cpu.cycle_counter += 11;
  } else if (cpu.iff1) {
    // The high bit of R is not affected by this increment,
    //  it can only be changed using the LD R, A instruction.
    cpu.r = (cpu.r & 0x80) | (((cpu.r & 0x7f) + 1) & 0x7f);

    cpu.halted = false;
    cpu.iff1 = 0;
    cpu.iff2 = 0;

    if (cpu.imode === 0) {
      // In the 8080-compatible interrupt mode,
      //  decode the content of the data bus as an instruction and run it.
      decodeInstruction(cpu, cb, data);
      cpu.cycle_counter += 2;
    } else if (cpu.imode === 1) {
      // Mode 1 is always just RST 0x38.
      pushWord(cpu, cb, cpu.pc);
      cpu.pc = 0x38;
      cpu.cycle_counter += 13;
    } else if (cpu.imode === 2) {
      // Mode 2 uses the value on the data bus as in index
      //  into the vector table pointer to by the I register.
      pushWord(cpu, cb, cpu.pc);
      // The Z80 manual says that this address must be 2-byte aligned,
      //  but it doesn't appear that this is actually the case on the hardware,
      //  so we don't attempt to enforce that here.
      const vector_address = (cpu.i << 8) | data;
      cpu.pc =
        cb.mem_read(vector_address) |
        (cb.mem_read((vector_address + 1) & 0xffff) << 8);

      cpu.cycle_counter += 19;
    }
  }
};
