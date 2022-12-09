const getString = function (ptr, len) {
  const slice = lox.exports.memory.buffer.slice(ptr, ptr + len);
  const textDecoder = new TextDecoder();
  return textDecoder.decode(slice);
};

const wasm_print = function (msg_ptr, msg_len) {
  const msg = getString(msg_ptr, msg_len);
  self.postMessage(msg);
};

const wasm_clock = function () {
  return Date.now();
};

const lox = {
  imports: {
    zig: {
      wasm_print,
      wasm_clock,
    },
  },
  exports: undefined,
};

let ready = false;

self.onerror = function (e) {
  console.error(e);
};

self.onmessage = function (code) {
  if (code.data === "__init__") {
    let input = new URL("lox.wasm", import.meta.url);
    WebAssembly.instantiateStreaming(fetch(input), lox.imports).then((obj) => {
      ready = true;
      lox.exports = obj.instance.exports;
      self.postMessage("__ready__");
    });
  } else {
    if (!ready) {
      throw "not ready yet!";
    }
    // convert code into Uint8Array
    const textEncoder = new TextEncoder();
    const codeArray = textEncoder.encode(code.data);
    var len = codeArray.length;

    // allocate required number of bytes
    const ptr = lox.exports._wasm_alloc(len);
    if (ptr === 0) {
      throw "Cannot allocate memory";
    }

    // write the array to the memory
    const mem_result = new DataView(lox.exports.memory.buffer, ptr, len);
    for (let i = 0; i < len; ++i) {
      mem_result.setUint8(i, codeArray[i], true);
    }

    lox.exports.run(ptr, len);
    self.postMessage("__done__");
  }
};
