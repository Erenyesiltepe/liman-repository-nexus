<script setup lang="ts">
import { h, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useKeyStore } from "@/stores/key"
import AsyncStore from "@/components/Table/AsyncStore.vue"
import type { IKey } from "@/models/Key"
import useEmitter from "@/utils/emitter"
import KeyModal from "@/views/modals/Key.vue"
import { NButton } from "naive-ui"
import DropdownMenu from "@/components/Table/DropdownMenu.vue"
import { renderIcon } from "@/utils/render-icon"

const { t } = useI18n()
const store = useKeyStore()
const emitter = useEmitter()

const columns = ref<any>([
  {
    title: t("key.table.name"),
    key: "name",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("key.table.content"),
    key: "content",
    sorter: "default",
    filterable: true,
  },
  {
    title: "",
    key: "actions",
    width: 40,
    render: (row: IKey) => {
      return h(DropdownMenu, {
        options: [
          {
            label: t("common.edit"),
            key: "edit",
            icon: renderIcon("fas fa-pen-to-square"),
            props: {
              onClick: () => {
                emitter.emit("showKeyModal", row)
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
        <n-button @click="emitter.emit('showKeyModal')"
          ><i class="fas fa-plus"
        /></n-button>
      </template>
    </AsyncStore>
  </n-card>
  <KeyModal />
</template>
