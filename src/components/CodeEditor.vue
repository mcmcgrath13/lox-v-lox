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
            :disabled="rsLoading || zigLoading"
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
    <WindowPane
      :title="`Rust  ${getRsTimeDiff(Date.now())}`"
      stick-bottom
      class="rust result"
    >
      <div>{{ rsResult }}</div>
      <div>{{ rsErrors }}</div>
    </WindowPane>
    <WindowPane
      :title="`Zig  ${getZigTimeDiff(Date.now())}`"
      stick-bottom
      class="zig result"
    >
      <div>{{ zigResult }}</div>
      <div>{{ zigErrors }}</div>
    </WindowPane>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Codemirror } from "vue-codemirror";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";

import { SAMPLE_PROGRAMS, Program } from "../samples.js";
import WindowPane from "./WindowPane.vue";

import RsWorker from "../workers/lox-rs.js?worker";
import ZigWorker from "../workers/lox-zig.js?worker";

const extensions = [java(), oneDark];

const data = ref(SAMPLE_PROGRAMS[0].program.trim());

interface Time {
  start?: number;
  end?: number;
}

const renderForcer = ref(1);
setInterval(() => {
  if (rsLoading.value || zigLoading.value) {
    renderForcer.value += 1;
  }
}, 100);

// RUST
const rsResult = ref("");
const rsErrors = ref("");
const rsLoading = ref(true);
const rsTimes: Time = reactive({ start: undefined, end: undefined });
const getRsTimeDiff = (now: number) => {
  if (rsTimes.start && renderForcer.value > 0) {
    return `(${((rsTimes.end ?? now) - rsTimes.start) / 1000} seconds)`;
  } else {
    return "";
  }
};

const rsWorker = new RsWorker();

rsWorker.onmessage = function (e) {
  if (e.data !== "__ready__" && e.data !== "__done__") {
    rsResult.value += e.data;
    rsErrors.value = "";
  } else {
    rsLoading.value = false;
  }
  if (e.data == "__done__") {
    rsTimes.end = Date.now();
  }
};

rsWorker.onerror = function (e) {
  rsTimes.end = Date.now();
  console.error(e);
  rsErrors.value = e.message;
  rsResult.value = "";
  rsLoading.value = false;
};

rsWorker.postMessage("__init__");

// ZIG
const zigResult = ref("");
const zigErrors = ref("");
const zigLoading = ref(true);
const zigTimes: Time = reactive({ start: undefined, end: undefined });
const getZigTimeDiff = (now: number) => {
  if (zigTimes.start && renderForcer.value > 0) {
    return `(${((zigTimes.end ?? now) - zigTimes.start) / 1000} seconds)`;
  } else {
    return "";
  }
};

const zigWorker = new ZigWorker();

zigWorker.onmessage = function (e) {
  if (e.data !== "__ready__" && e.data !== "__done__") {
    zigResult.value += e.data;
    zigErrors.value = "";
  } else {
    zigLoading.value = false;
  }
  if (e.data == "__done__") {
    zigTimes.end = Date.now();
  }
};

zigWorker.onerror = function (e) {
  zigTimes.end = Date.now();
  console.error(e);
  zigErrors.value = e.message;
  zigResult.value = "";
  zigLoading.value = false;
};

zigWorker.postMessage("__init__");

const changeProgram = (event: Event) => {
  const program = SAMPLE_PROGRAMS.find(
    (p) => p.name === (<HTMLSelectElement>event?.target)?.value
  ) as Program;
  data.value = program.program.trim();
  rsTimes.start = undefined;
  rsTimes.end = undefined;
  zigTimes.start = undefined;
  zigTimes.end = undefined;
};

const runCode = (code: string) => {
  rsWorker.postMessage(code);
  rsLoading.value = true;
  rsResult.value = "";
  rsTimes.start = Date.now();
  rsTimes.end = undefined;

  zigWorker.postMessage(code);
  zigLoading.value = true;
  zigResult.value = "";
  zigTimes.start = Date.now();
  zigTimes.end = undefined;
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

.run-button:disabled {
  background: var(--color-gray-100);
  color: var(--color-gray-300);
  cursor: not-allowed;
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
