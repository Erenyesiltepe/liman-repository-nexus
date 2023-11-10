<script setup lang="ts">
const props = defineProps(["data"])
</script>
<template>
  <n-table>
    <tr>
      <th>Attribute</th>
      <th>Value</th>
    </tr>
    <tr v-for="(value, attr) in props.data" :key="attr">
      <td>{{ attr }}</td>
      <td>{{ value }}</td>
    </tr>
  </n-table>
</template>
