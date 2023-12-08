<script setup lang="ts">
const props = defineProps(["desc"])
</script>
<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <slot></slot>
    </template>
    {{ props.desc }}
  </n-tooltip>
</template>
