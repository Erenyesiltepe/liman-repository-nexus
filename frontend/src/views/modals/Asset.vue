<script setup lang="ts">
import { useNexusStore } from "@/stores/nexus"
import { ref } from "vue"
import { useLoadingBar } from "naive-ui"

const props = defineProps(["name"])
const loadingBar = useLoadingBar()
const store = useNexusStore()
const asset = ref()
const loaded = ref(false)

store.fetchAsset(props.name).then(() => {
  loaded.value = true
  asset.value = store.getAsset
})
</script>
<template>
  <n-table v-if="loaded">
    <tr>
      <th>Asset Name</th>
      <th>Download Url</th>
      <th>Filesize</th>
    </tr>
    <tr v-for="comp in asset.items" :key="comp.id">
      <td>{{ comp.downloadUrl.split("/")[6] }}</td>
      <td>{{ comp.downloadUrl }}</td>
      <td>{{ comp.fileSize }}</td>
    </tr>
  </n-table>
</template>
