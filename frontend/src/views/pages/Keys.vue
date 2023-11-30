<script setup lang="ts">
import { h, ref, onMounted } from "vue"
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
const show = ref(false)
const active = ref(false)
onMounted(() => {
  active.value = true
})

const columns = ref<any>([
  {
    title: t("key.table.name"),
    key: "name",
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
            label: t("key.table.view_content"),
            key: "view",
            icon: renderIcon("fas fa-eye"),
            props: {
              onClick: () => {
                store.fetchContent(row.id).then(() => {
                  show.value = true
                })
              },
            },
          },
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
    <AsyncStore
      v-if="active"
      :dispatcher="store.fetch"
      :data="store.get"
      :columns="columns"
    >
      <template #buttons>
        <n-button @click="emitter.emit('showKeyModal')"
          ><i class="fas fa-plus"
        /></n-button>
      </template>
    </AsyncStore>
  </n-card>
  <n-modal v-model:show="show">
    <n-card
      style="width: 400px"
      :title="t('key.table.content')"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      :segmented="{
        content: true,
        footer: 'soft',
      }"
    >
      {{ store.getContent }}
    </n-card>
  </n-modal>
  <KeyModal />
</template>
