<template>
  <div class="container">
    <WindowPane title="Program" class="editor">
      <template #bar>
        <label class="sample-programs">
          <select
            aria-label="select a sample program"
            class="program-select"
            @change="changeProgram"
          >
            <option v-for="sample in SAMPLE_PROGRAMS" :key="sample.name">
              {{ sample.name }}
            </option>
          </select>
        </label>
      </template>
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
            <svg width="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z"
              />
            </svg>
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

import {SAMPLE_PROGRAMS } from "../samples.js";

const data = ref(SAMPLE_PROGRAMS[0].program.trim());
const result = ref("");
const errors = ref("");


import RsWorker from '../workers/lox-rs?worker'

RsWorker.onmessage = function(e) {
    result.value = e.data;
    console.log('Message received from worker');
  }

// import init, { Lox } from "lox-wasm";

import WindowPane from "./WindowPane.vue";
import { SAMPLE_PROGRAMS } from "../samples.js";

const extensions = [java(), oneDark];

// init is async and needs to finish running before creating a Lox instance
// const lox = ref<null | Lox>(null);
// init()
//   .then(() => {
//     lox.value = new Lox();
//   })
//   .catch((e) => console.error(e));


const changeProgram = (event) => {
  const program = SAMPLE_PROGRAMS.find((p) => p.name === event.target.value);
  data.value = program.program.trim();
};

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
  margin: -1rem 0;
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
  margin: 0 -1rem;
}

.run-button,
.program-select {
  background: var(--color-gray-300);
  color: var(--color-gray-800);
  font-weight: var(--font-weight-medium);
}

.run-button {
  padding: 0.5rem 1.5rem 0.5rem 0.75rem;
  border-top: solid 3px var(--color-gray-700);
  transition: 0.3s ease-out;

  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
}

.run-button:hover {
  background: var(--color-gray-800);
  color: var(--color-gray-300);
  transition: 0.1s ease-out;
}

.sample-programs {
  font-size: 0.875rem;
  margin: 0.3rem 0;
}

.program-select {
  font-family: inherit;
  border: solid 1px var(--color-gray-300);
  font-size: 1.1em;
  padding: 0 0.2rem;
}
</style>
