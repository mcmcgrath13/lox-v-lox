<template>
  <div class="wrapper">
    <div class="nav">
      <h1>Lox v Lox</h1>
      <p>
        A battle of the
        <em
          ><a href="https://craftinginterpreters.com/contents.html"
            >Crafting Interpreters</a
          ></em
        >
        implementations: a
        <a href="https://github.com/mcmcgrath13/lox-rs"
          >tree-walk interpreter in Rust</a
        >
        v. a
        <a href="https://github.com/mcmcgrath13/lox-zig"
          >bytecode virtual machine in Zig</a
        >
      </p>
    </div>
    <div class="content-wrapper">
      <CodeEditor />
    </div>
  </div>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import CodeEditor from "./components/CodeEditor.vue";
</script>

<style scoped>
.wrapper {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  max-width: 100rem;
  margin: 0 auto;
}

.nav {
  padding: 0.5rem var(--gutter);
  line-height: 1;
  color: var(--color-gray-900);
}

.nav > h1 {
  line-height: 1;
  font-size: 2rem;
}

.content-wrapper {
  flex: 1;
  isolation: isolate;
  padding: calc(0.5 * var(--gutter)) var(--gutter) 0;
}
</style>
