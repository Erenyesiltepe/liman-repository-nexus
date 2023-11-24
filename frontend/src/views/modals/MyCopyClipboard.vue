<script setup lang="ts">
import useEmitter from "@/utils/emitter"
const props = defineProps(["toCopy"])
const emitter = useEmitter()

async function copyClip() {
  try {
    await navigator.clipboard.writeText(props.toCopy)
    window.$message.success("Copied")
    emitter.emit("toggleDrawer")
  } catch ($e) {
    window.$message.error("Cannot copy")
  }
}
</script>
<template>
  <div class="clipboardWrapper">
    <n-card :bordered="false">
      {{ props.toCopy ?? "tx_id" }}
    </n-card>
    <n-button @click="copyClip"><i class="fa-regular fa-copy"></i></n-button>
  </div>
</template>
<style scoped lang="scss">
.clipboardWrapper {
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  width: 80%;
  border-radius: 10px;
  padding: 1px;
}
</style>
