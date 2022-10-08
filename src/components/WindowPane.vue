<template>
  <div class="window-pane">
    <div class="title-bar">
      <h2>{{ title }}</h2>
    </div>
    <div class="inner-pane">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped>
.window-pane {
  --border-color: var(--color-gray-700);
  --border-gap: 3px;
  border: 5px solid var(--border-color);
  border-top: 0;
  background: var(--color-offblack);
  color: var(--color-gray-100);
  padding: var(--border-gap);
  padding-top: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.inner-pane {
  border: 3px solid var(--border-color);
  border-top: 0;
  padding: 1rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
}

.title-bar {
  padding-left: 0.5rem;
  background-color: var(--border-color);
  margin-left: calc(-1 * var(--border-gap));
  margin-right: calc(-1 * var(--border-gap));
}
</style>
