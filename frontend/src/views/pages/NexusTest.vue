<script setup lang="ts">
import { useNexusStore } from "@/stores/nexus"
import { ref, h, reactive } from "vue"
import { NButton } from "naive-ui"
import Table from "@/components/Table.vue"
import Nexus from "@/views/modals/Nexus.vue"
import useEmitter from "@/utils/emitter"
import RepoDetail from "@/views/modals/RepoDetail.vue"
import type { IData } from "@/models/Data"

const emitter = useEmitter()
const store = useNexusStore()
const loading = ref(false)
const selected = ref("Choose package")

store.fetchRepositories("", "").then(() => {
  console.log(store.getRepositories)
})

const columns = reactive([
  {
    title: "#",
    type: "expand",
    renderExpand: (row: IData) => {
      return h(RepoDetail, { data: row })
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
  },
  {
    title: "Url",
    key: "url",
  },
  {
    title: "Operations",
    render(row: IData) {
      return h(
        NButton,
        {
          onClick: () => {
            window.$dialog.warning({
              title: "Confirm",
              content: "Are you sure?",
              positiveText: "Delete",
              negativeText: "Cancel",
              onPositiveClick: () => {
                store.deleteRepository(row.name).then(() => {
                  window.$message.success("Repo is deleted")
                })
              },
            })
          },
        },
        [h("i", { class: "fa-solid fa-trash" })]
      )
    },
  },
])

function select(key: string) {
  if (key == "") {
    store.fetchRepositories("", "")
    selected.value = "All"
  } else {
    const filter = key.split("/")
    store.fetchRepositories(filter[0], filter[1])
    selected.value = filter[0] + " " + filter[1]
  }
}

const options = ref([
  {
    label: "all",
    key: "",
  },
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
    <Table :columns="columns" :data="store.getRepositories" :loading="loading">
      <template #buttons>
        <n-dropdown trigger="click" :options="options" @select="select">
          <n-button>{{ selected }}</n-button>
        </n-dropdown>
        <n-button @click="emitter.emit('showNexusModal')"
          ><i class="fas fa-plus"
        /></n-button>
      </template>
    </Table>
  </n-card>
</template>
