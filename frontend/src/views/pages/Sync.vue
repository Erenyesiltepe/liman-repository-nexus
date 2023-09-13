<script setup lang="ts">
import { h, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useSyncStore } from "@/stores/sync"
import AsyncStore from "@/components/Table/AsyncStore.vue"
import type { ISync } from "@/models/Sync"
import useEmitter from "@/utils/emitter"
import SyncModal from "@/views/modals/Sync.vue"
import { formatDate, formatTimeObject } from "@/utils/format-date"
import { intervalToDuration } from "date-fns"
import { NButton } from "naive-ui"
import DropdownMenu from "@/components/Table/DropdownMenu.vue"
import { renderIcon } from "@/utils/render-icon"

const { t } = useI18n()
const store = useSyncStore()
const emitter = useEmitter()

const columns = ref<any>([
  {
    title: t("sync.table.repository_name"),
    key: "repository.repository_name",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("sync.table.run_time"),
    key: "run_time",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("sync.table.interval"),
    key: "interval",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("sync.table.is_active"),
    key: "is_active",
    render: (row: ISync) => {
      return h("center", null, {
        default: () => [
          h("i", {
            class: [
              "mr-2",
              "fa-solid",
              row.is_active ? "fa-check" : "fa-times",
              row.is_active ? "text-success" : "text-error",
            ],
          }),
        ],
      })
    },
  },
  {
    title: t("sync.table.is_one_time"),
    key: "is_one_time",
    render: (row: ISync) => {
      return h("center", null, {
        default: () => [
          h("i", {
            class: [
              "mr-2",
              "fa-solid",
              row.is_one_time ? "fa-check" : "fa-times",
              row.is_one_time ? "text-success" : "text-error",
            ],
          }),
        ],
      })
    },
  },
  {
    title: t("sync.table.latest_sync_status"),
    key: "latest_sync_status",
    sorter: "default",
    filterable: true,
    render: (row: ISync) => {
      return h("center", null, {
        default: () => row.latest_sync_status,
      })
    },
  },
  {
    title: t("sync.table.latest_sync_start_time"),
    key: "latest_sync_start_time",
    sorter: "default",
    width: 250,
    render: (row: ISync) => {
      const duration = intervalToDuration({
        end: new Date(row.latest_sync_end_time),
        start: new Date(row.latest_sync_start_time),
      })

      return row.latest_sync_start_time
        ? `${formatDate(row.latest_sync_start_time)} (${formatTimeObject(
            duration
          )})`
        : ""
    },
  },
  {
    title: "",
    key: "actions",
    width: 40,
    render: (row: any) => {
      return h(DropdownMenu, {
        options: [
          {
            label: t("common.edit"),
            key: "edit",
            icon: renderIcon("fas fa-pen-to-square"),
            props: {
              onClick: () => {
                emitter.emit("showSyncModal", row)
              },
            },
          },
          {
            label: t("common.delete"),
            key: "delete",
            icon: renderIcon("fas fa-trash-can"),
            props: {
              onClick: () => {
                store.delete(row.id)
              },
            },
          },
        ],
      })
    },
  },
])
</script>

<template>
  <n-card>
    <AsyncStore :dispatcher="store.fetch" :data="store.get" :columns="columns">
      <template #buttons>
        <n-button @click="emitter.emit('showSyncModal')"
          ><i class="fas fa-plus"
        /></n-button>
      </template>
    </AsyncStore>
  </n-card>
  <SyncModal />
</template>
