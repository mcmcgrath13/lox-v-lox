import init, { Lox } from "lox-wasm";

self.onerror = function (e) {
  console.error(e);
};

let ready = false;

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
    const lox = new Lox();
    self.postMessage(lox.run(code.data));
  }
};
