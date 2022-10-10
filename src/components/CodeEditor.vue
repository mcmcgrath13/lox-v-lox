<template>
  <div class="container">
    <WindowPane title="Program" class="editor">
      <div class="editor-container">
        <Codemirror
          v-model="data"
          class="lox-editor"
          placeholder="Code goes here..."
          :style="{
            overflowY: 'scroll',
          }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="4"
          :extensions="extensions"
        />
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
    </WindowPane>
    <WindowPane title="Rust" class="rust result">
      <div>{{ result }}</div>
      <div>{{ errors }}</div>
    </WindowPane>
    <WindowPane title="Zig" class="zig result">
      <div>[not implemented yet]</div>
    </WindowPane>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Codemirror } from "vue-codemirror";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";

const data = ref("print 1 + 2;");
const result = ref("");
const errors = ref("");


import RsWorker from '../workers/lox-rs?worker'

RsWorker.onmessage = function(e) {
    result.value = e.data;
    console.log('Message received from worker');
  }

// import init, { Lox } from "lox-wasm";

import WindowPane from "./WindowPane.vue";

const extensions = [java(), oneDark];

// init is async and needs to finish running before creating a Lox instance
// const lox = ref<null | Lox>(null);
// init()
//   .then(() => {
//     lox.value = new Lox();
//   })
//   .catch((e) => console.error(e));


const runCode = (code: string) => {
  myWorker.postMessage(code);
  // result.value =
  // try {
  //   result.value = (lox.value as Lox).run(code);
  // } catch (e) {
  //   console.error(e);
  //   errors.value = e as string;
  // }
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
    grid-template-rows: auto;
    grid-template-areas: "editor editor" "rust zig";
  }
}

.editor {
  grid-area: editor;
  height: max(50vh, 200px);
}

.editor-container {
  display: grid;
  grid-template-rows: minmax(0px, 1fr) auto;
  gap: 8px;
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
  overflow-y: auto;
  height: max(25vh, 100px);
}

.lox-editor {
  font-size: 1rem;
}

/* see the global styles for prism editor styling*/

.button-container {
  display: flex;
  justify-content: center;
  flex: 0;
}

.run-button {
  background: var(--color-gray-300);
  color: var(--color-primary);
  padding: 0.3rem 1.5rem;
  font-weight: var(--font-weight-medium);
}
</style>
