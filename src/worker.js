const name = 'John'
self.onmessage = e => {
    let j = Date.now();
    for (let i = 1 ; i < 10000; i++) {
        j += i;
    }
    self.postMessage(`${e.data} from ${j} worker`);
}