<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRepositoryStore } from "@/stores/repository"
import Table from "@/components/Table.vue"

const { t } = useI18n()
const store = useRepositoryStore()
const loading = ref(true)

onMounted(() => {
  store.fetch().then(() => {
    loading.value = false
  })
})

const columns = ref([
  {
    title: t("repository.table.name"),
    key: "name",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("repository.table.type"),
    key: "type",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("repository.table.format"),
    key: "format",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("repository.table.url"),
    key: "url",
    sorter: "default",
    filterable: true,
  },
])
</script>

<template>
  <n-card>
    <Table :loading="loading" :data="store.get" :columns="columns" />
  </n-card>
</template>
