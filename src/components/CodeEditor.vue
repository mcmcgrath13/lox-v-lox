<template>
  <div class="container">
    <div class="window-pane editor">
      <PrismEditor
        v-model="data"
        class="lox-editor"
        :highlight="highlighter"
        line-numbers
      ></PrismEditor>
      <div class="button-container">
        <button
          class="run-button"
          :disabled="lox === null"
          @click="runCode(data)"
        >
          run
        </button>
      </div>
    </div>
    <div class="window-pane rust result">
      <div>{{ result }}</div>
      <div>{{ errors }}</div>
    </div>
    <div class="window-pane zig result">
      <div>{{ result }}</div>
      <div>{{ errors }}</div>
    </div>
  </div>
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
    result.value = "";
    result.value = lox.value.run(code);
    errors.value = "";
  } catch (e) {
    console.error(e);
    errors.value = e;
  }
};

const highlighter = (code) => {
  return highlight(code, languages.clike);
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2fr 1fr 1fr;
  grid-gap: 24px;
  grid-template-areas: "editor" "rust" "zig";
  height: 100%;
}

@media (min-width: 34.375rem) {
  .container {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 2fr 1fr;
    grid-template-areas: "editor editor" "rust zig";
  }
}

.editor {
  grid-area: editor;

  height: max(50vh, 200px);
  display: flex;
  flex-direction: column;
}

.rust {
  grid-area: rust;
}

.zig {
  grid-area: zig;
}

.result {
  white-space: pre-line;
  word-break: break-all;
}

/* required class */
.lox-editor {
  /* you must provide font-family font-size line-height. Example: */
  line-height: 1.5;
  width: 100%;
}

/* see the global styles for prism editor styling*/

.button-container {
  display: flex;
  justify-content: center;
  padding: 5px;
}

.run-button {
  background: var(--color-gray-300);
  color: var(--color-primary);
  padding: 0.3rem 1.5rem;
}

.window-pane {
  --border-color: var(--color-gray-500);
  border: thick double var(--border-color);
  border-top: 20px solid var(--border-color);
  background: var(--color-offblack);
  color: var(--color-gray-100);
  padding: 1rem;
}
</style>
