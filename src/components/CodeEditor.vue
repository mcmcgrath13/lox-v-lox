<template>
  <prism-editor
    v-model="data"
    class="lox-editor"
    :highlight="highlighter"
    line-numbers
  ></prism-editor>
  <button :disabled="lox === null" @click="runCode(data)">run</button>
  <div>{{ result }}</div>
  <div>{{ errors }}</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PrismEditor } from "vue-prism-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism-tomorrow.css";

import init, { Lox } from "lox-wasm";

// init is async and needs to finish running before creating a Lox instance
const lox = ref(null);
init()
  .then(() => {
    lox.value = new Lox();
  })
  .catch((e) => console.error(e));

const data = ref("print 1 + 2;");
const result = ref("");
const errors = ref("");

const runCode = (code) => {
  try {
    result.value = lox.value.run(code);
    errors.value = "";
  } catch (e) {
    console.error(e);
    errors.value = e;
    result.value = "";
  }
};

const highlighter = (code) => {
  return highlight(code, languages.clike);
};
</script>

<style scoped>
/* required class */
.lox-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 1rem;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
