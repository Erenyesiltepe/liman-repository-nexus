<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"

const emitter = useEmitter()
const show = ref()

emitter.on("openRoleEdit", (data: any) => {
  show.value = true
})
</script>
<template>
  <n-modal v-model:show="show">
    <n-card
      style="width: 600px"
      title="Modal"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-table>
        <tr>
          <th>mahmut</th>
          <th>mahmut</th>
        </tr>
      </n-table>
    </n-card>
  </n-modal>
</template>
