import init, { Lox } from "lox-wasm";

self.onerror = function (e) {
  console.error(e);
};

let ready = false;

const wasm_print = function (msg) {
  self.postMessage(`${msg}\n`);
};

self.onmessage = function (code) {
  if (code.data === "__init__") {
    init().then(() => {
      ready = true;
      self.postMessage("__ready__");
    });
  } else {
    if (!ready) {
      throw "not ready yet!";
    }
    const lox = new Lox(wasm_print);
    lox.run(code.data);
    self.postMessage("__done__");
  }
};
