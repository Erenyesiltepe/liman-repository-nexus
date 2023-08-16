<script setup lang="ts">
import { h, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRepositoryStore } from "@/stores/repository"
import Table from "@/components/Table.vue"
import type { IRepository } from "@/models/Repository"
import { NButton } from "naive-ui"
import useEmitter from "@/utils/emitter"
import URLModal from "@/views/modals/URL.vue"

const { t } = useI18n()
const store = useRepositoryStore()
const emitter = useEmitter()
const loading = ref(true)

onMounted(() => {
  store.fetch().then(() => {
    loading.value = false
  })
})

const columns = ref([
  {
    title: t("repository.table.name"),
    key: "repository_name",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("repository.table.path"),
    key: "path",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("repository.table.type"),
    key: "repository_type",
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
    title: t("repository.table.status"),
    key: "status",
    render: (row: IRepository) => {
      return h("span", null, {
        default: () => [
          h("i", {
            class: [
              "mr-2",
              "fa-solid",
              row.status ? "fa-check" : "fa-times",
              row.status ? "text-success" : "text-error",
            ],
          }),
          row.status
            ? t("repository.table.status_active")
            : t("repository.table.status_inactive"),
        ],
      })
    },
  },
  {
    title: t("repository.table.url"),
    key: "url",
    width: 100,
    render: (row: IRepository) => {
      return h(
        NButton,
        { size: "small", onClick: () => emitter.emit("showURLModal", row.id) },
        {
          default: () => [
            h("i", { class: ["mr-2", "fa-solid fa-copy"] }),
            t("common.copy"),
          ],
        }
      )
    },
  },
])
</script>

<template>
  <n-card>
    <Table :loading="loading" :data="store.get" :columns="columns" />
  </n-card>
  <URLModal />
</template>
