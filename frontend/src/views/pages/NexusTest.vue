<script setup lang="ts">
import { useNexusStore } from "@/stores/nexus"
import { ref } from "vue"
import Table from "@/components/Table.vue"
//import { useI18n } from 'vue-i18n'
//const { t } = useI18n()

const store = useNexusStore()
const loading = ref(false)

store.fetchRepositories()
const test = ref(store.getRepositories)
console.log(test.value[0])

const columns = ref([
  {
    title: "Name",
    key: "name",
    sorter: "default",
    filterable: true,
  },
  {
    title: "Format",
    key: "format",
  },
  {
    title: "Type",
    key: "type",
  },
  {
    title: "Url",
    key: "url",
  },
])
</script>
<template>
  <Table :columns="columns" :data="store.getRepositories" :loading="loading">
  </Table>
</template>
