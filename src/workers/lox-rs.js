import init, { Lox } from "lox-wasm";

install = function() {
  init()
}

onmessage = function(code) {
  console.log('Worker: Message received from main script');
  const lox = new Lox();
  try {
    postMessage(lox.run(code.data))
  } catch (err) {
    postMessage(err)
  }
}
