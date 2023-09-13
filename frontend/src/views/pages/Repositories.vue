<script setup lang="ts">
import { h, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRepositoryStore } from "@/stores/repository"
import AsyncStore from "@/components/Table/AsyncStore.vue"
import type { IRepository } from "@/models/Repository"
import { NButton } from "naive-ui"
import useEmitter from "@/utils/emitter"
import URLModal from "@/views/modals/URL.vue"
import RepositoryModal from "@/views/modals/Repository.vue"
import RepositoryDetails from "@/components/RepositoryDetails.vue"
import { useSyncStore } from "@/stores/sync"

const { t } = useI18n()
const store = useRepositoryStore()
const syncStore = useSyncStore()
const emitter = useEmitter()

const columns = ref<any>([
  {
    key: "actions",
    type: "expand",
    renderExpand: (row: IRepository) => {
      return h(RepositoryDetails, { data: row })
    },
  },
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
            ? t("repository.table.online")
            : t("repository.table.offline"),
        ],
      })
    },
  },
  {
    title: t("repository.table.client_url"),
    key: "client_url",
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
  {
    key: "actions",
    width: 100,
    render: (row: IRepository) => {
      return h(
        NButton,
        { size: "small", onClick: () => syncStore.manualSync(row.id) },
        {
          default: () => [
            h("i", { class: ["mr-2", "fa-solid fa-repeat"] }),
            t("repository.table.sync"),
          ],
        }
      )
    },
  },
])
</script>

<template>
  <n-card>
    <AsyncStore :dispatcher="store.fetch" :data="store.get" :columns="columns">
      <template #buttons>
        <n-button @click="emitter.emit('showRepositoryModal')"
          ><i class="fas fa-plus"
        /></n-button>
      </template>
    </AsyncStore>
  </n-card>
  <URLModal />
  <RepositoryModal />
</template>
