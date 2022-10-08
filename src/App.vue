<template>
  <div class="wrapper">
    <div class="nav"><h1>Lox v Lox</h1></div>
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
}

.nav {
  padding: 0.5rem var(--gutter);
  font-size: 2rem;
  line-height: 1;
}

.nav > h1 {
  line-height: 1;
}

.content-wrapper {
  flex: 1;
  isolation: isolate;
  padding: var(--gutter);
}
</style>
