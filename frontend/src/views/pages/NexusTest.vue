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
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const emitter = useEmitter()
const store = useNexusStore()
const loading = ref(true)
const selected = ref("Choose package")

console.log(route.params.tab)

store.fetchBlobstores()
store.fetchRepositories("apt", "hosted").then(() => {
  loading.value = false
})

const columns = ref([
  {
    title: "#",
    type: "expand",
    renderExpand: (row: IData) => {
      return h(Asset, { data: row })
    },
  },
  {
    title: t("nexus.test.columns.name"),
    key: "name",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("nexus.test.columns.format"),
    key: "format",
  },
  {
    title: t("nexus.test.columns.type"),
    key: "type",
    show: false,
  },
  {
    title: "Url",
    key: "url",
  },
  {
    title: t("nexus.test.columns.operations"),
    width: 100,
    render(row: IData) {
      return h(NSpace, [
        h(
          NButton,
          {
            onClick: () => {
              window.$dialog.warning({
                title: t("common.confirm"),
                content: t("common.are_you_sure"),
                positiveText: t("common.yes"),
                negativeText: t("common.no"),
                onPositiveClick: () => {
                  store.deleteRepository(row.name, route.params.tab as string)
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
              const dt = { ...row }
              emitter.emit("show" + row.format + row.type, {
                itype: "edit",
                ndata: dt,
                blobs: store.getBlobstores,
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
  router.push({ name: "nexus", params: { tab: key } })
  const docker_column = {
    title: t("nexus.test.columns.enable_anon_pull"),
    key: "enableAnonstr",
  }
  const push_link = {
    title: t("nexus.test.columns.push_url"),
    key: "pushUrl",
  }

  const ifexists = columns.value.find((o) => o.key === "enableAnonstr")
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
    label: "APT Hosted",
    key: "apt/hosted",
  },
  {
    label: "APT Proxy",
    key: "apt/proxy",
  },
  {
    label: "YUM Hosted",
    key: "yum/hosted",
  },
  {
    label: "YUM Proxy",
    key: "yum/proxy",
  },
  {
    label: "Docker Hosted",
    key: "docker/hosted",
  },
  {
    label: "Docker Proxy",
    key: "docker/proxy",
  },
])
</script>
<template>
  <n-card>
    <Nexus />
    <Setting />
    <n-tabs
      class="card-tabs"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px;"
      :on-update:value="update"
      :value="route.params.tab"
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
          row-key="name"
        >
          <template #buttons>
            <n-button
              @click="
                emitter.emit(
                  'show' +
                    (route.params.tab as string).split('/')[0] +
                    (route.params.tab as string).split('/')[1],
                  {
                    itype: 'create',
                    blobs: store.getBlobstores,
                  }
                )
              "
              ><i class="fas fa-plus"
            /></n-button>
          </template>
        </Table>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
