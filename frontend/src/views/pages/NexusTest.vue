<script setup lang="ts">
import { useNexusStore } from "@/stores/nexus"
import { ref, h } from "vue"
import { NButton, NSpace } from "naive-ui"
import Table from "@/components/Table.vue"
import Nexus from "@/views/modals/Nexus.vue"
import useEmitter from "@/utils/emitter"
import Asset from "@/views/modals/Asset.vue"
import Setting from "@/views/modals/Setting.vue"
import type { IData } from "@/models/Data"

const emitter = useEmitter()
const store = useNexusStore()
const loading = ref(true)
const selected = ref("Choose package")
const activeTab = ref("apt/hosted")

store.fetchRepositories("apt", "hosted").then(() => {
  loading.value = false
})

const columns = ref([
  {
    title: "#",
    type: "expand",
    expandable: (row: any) => row.format == "docker",
    renderExpand: (row: IData) => {
      return h(Asset, { data: row })
    },
  },
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
    show: false,
  },
  {
    title: "Url",
    key: "url",
  },
  {
    title: "Operations",
    render(row: IData) {
      return h(NSpace, [
        h(
          NButton,
          {
            onClick: () => {
              window.$dialog.warning({
                title: "Confirm",
                content: "Are you sure?",
                positiveText: "Delete",
                negativeText: "Cancel",
                onPositiveClick: () => {
                  store.deleteRepository(row.name, activeTab.value)
                },
              })
            },
          },
          [h("i", { class: "fa-solid fa-trash" })]
        ),
        h(
          NButton,
          {
            onClick: () => {
              emitter.emit("showNexusModal", {
                itype: "edit",
                ndata: row,
                activeTab: activeTab.value,
              })
            },
          },
          [h("i", { class: "fa-regular fa-pen-to-square" })]
        ),
        h(
          NButton,
          {
            onClick: () => {
              emitter.emit("showSettingModal", row)
            },
          },
          [h("i", { class: "fa-solid fa-gear" })]
        ),
      ])
    },
  },
])

function update(key: string) {
  activeTab.value = key
  const docker_column = {
    title: "Enable Anonymous Pull",
    key: "enableAnonymus",
  }
  const push_link = {
    title: "Push Url",
    key: "pushUrl",
  }

  const ifexists = columns.value.find((o) => o.key === "enableAnonymus")
  const filter = key.split("/")
  filter[0] == "docker"
    ? ifexists == undefined
      ? (columns.value.splice(5, 0, docker_column),
        columns.value.splice(5, 0, push_link))
      : null
    : ifexists != undefined
    ? (columns.value.splice(5, 1), columns.value.splice(5, 1))
    : null

  store.fetchRepositories(filter[0], filter[1])
  selected.value = filter[0] + " " + filter[1]
}

const options = ref([
  {
    label: "apt hosted",
    key: "apt/hosted",
  },
  {
    label: "yum hosted",
    key: "yum/hosted",
  },
  {
    label: "apt proxy",
    key: "apt/proxy",
  },
  {
    label: "yum proxy",
    key: "yum/proxy",
  },
  {
    label: "docker proxy",
    key: "docker/proxy",
  },
  {
    label: "docker hosted",
    key: "docker/hosted",
  },
])
</script>
<template>
  <n-card>
    <Nexus />
    <Setting />
    <n-tabs
      class="card-tabs"
      default-value="apt/hosted"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px;"
      :on-update:value="update"
    >
      <n-tab-pane
        v-for="op in options"
        :key="op.key"
        :name="op.key"
        :tab="op.label"
      >
        <Table
          :columns="columns"
          :data="store.getRepositories"
          :loading="loading"
        >
          <template #buttons>
            <n-button
              @click="
                emitter.emit('showNexusModal', {
                  itype: 'create',
                  activeTab: activeTab,
                })
              "
              ><i class="fas fa-plus"
            /></n-button>
          </template>
        </Table>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
