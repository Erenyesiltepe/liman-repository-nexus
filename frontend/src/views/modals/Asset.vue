<script setup lang="ts">
import { useNexusStore } from "@/stores/nexus"
import MyCopyClipboard from "./MyCopyClipboard.vue"
import Table from "@/components/Table.vue"
import { ref, h } from "vue"

const props = defineProps(["data"])
const store = useNexusStore()
const loaded = ref(true)
const asset = ref([{ garb: "" }])

store.fetchAsset(props.data.name).then(() => {
  asset.value = formatData(store.getAsset)
  loaded.value = false
})

const columns = ref([
  {
    title: "Asset Name",
    key: "name",
  },
  {
    title: "Url",
    key: "url",
  },
  {
    title: "Pull Url",
    render: (row: any) => {
      return h(MyCopyClipboard, {
        toCopy: row.pullUrl,
      })
    },
  },
  {
    title: "File Size",
    key: "fileSize",
  },
])

function formatData(list: any) {
  return list.map((item: any) => {
    const url = item.downloadUrl
    const splittedUrl = url.split("/")

    return {
      name: splittedUrl[6],
      url: url,
      pullUrl: props.data.pushUrl + ":" + splittedUrl[8],
      fileSize: item.fileSize,
    }
  })
}
</script>
<template>
  <Table :columns="columns" :data="asset" :loading="loaded"> </Table>
</template>
