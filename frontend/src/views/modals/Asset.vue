<script setup lang="ts">
import { useNexusStore } from "@/stores/nexus"
import MyCopyClipboard from "./MyCopyClipboard.vue"
import Table from "@/components/Table.vue"
import { ref, h } from "vue"
import type { IData } from "@/models/Data"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const props = defineProps(["data"])
const store = useNexusStore()
const loaded = ref(true)
const asset = ref([{ garb: "" }])

store.fetchAsset(props.data.name).then(() => {
  asset.value = formatData(store.getAsset)
  loaded.value = false
})

const columns2 = ref([
  {
    title: t("asset.name"),
    key: "name",
  },
  {
    title: "Url",
    key: "url",
  },
  {
    title: t("asset.file_size"),
    key: "fileSize",
  },
])
const columns1 = ref([
  {
    title: t("asset.name"),
    key: "name",
  },
  {
    title: "Url",
    key: "url",
  },
  {
    title: t("asset.pull_url"),
    render: (row: IData) => {
      return h(MyCopyClipboard, {
        toCopy: row.pullUrl,
      })
    },
  },
  {
    title: t("asset.file_size"),
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
  <Table
    :columns="props.data.format == 'docker' ? columns1 : columns2"
    :data="asset"
    :loading="loaded"
  >
  </Table>
</template>
