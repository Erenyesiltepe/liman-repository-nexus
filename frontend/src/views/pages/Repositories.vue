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
import DropdownMenu from "@/components/Table/DropdownMenu.vue"
import { renderIcon } from "@/utils/render-icon"

const { t } = useI18n()
const store = useRepositoryStore()
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
              row.status ? "text-success" : "text-danger",
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
                emitter.emit("showRepositoryModal", row)
              },
            },
          },
          {
            label: row.status ? t("common.toggle-off") : t("common.toggle-on"),
            key: "toggle",
            icon: row.status
              ? renderIcon("fas fa-toggle-off")
              : renderIcon("fas fa-toggle-on"),
            props: {
              onClick: () => {
                store.toggle(row.id)
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
        <n-button @click="emitter.emit('showRepositoryModal')"
          ><i class="fas fa-plus"
        /></n-button>
      </template>
    </AsyncStore>
  </n-card>
  <URLModal />
  <RepositoryModal />
</template>
