<script setup lang="ts">
import { h, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import Table from "@/components/Table.vue"
import type { IRepository } from "@/models/Repository"
import { useRepositoryStore } from "@/stores/repository"
import { formatDate } from "@/utils/format-date"

const { t } = useI18n()
const store = useRepositoryStore()
const loading = ref(true)
const currentTab = ref("details")

const props = defineProps<{
  data: IRepository
}>()

const packageColumns = ref([
  {
    title: t("package.table.name"),
    key: "name",
    sorter: "default",
    filterable: true,
  },
  {
    title: t("package.table.size"),
    key: "size",
    sorter: "default",
    filterable: true,
    render: (row: any) => {
      return formatBytes(row.size)
    },
  },
  {
    key: "mod_time",
    sorter: "default",
    filterable: true,
  },
])

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

watch(currentTab, (value) => {
  if (value == "packages") {
    store.fetchPackages(props.data.id).then(() => {
      loading.value = false
    })
  }
})
</script>

<template>
  <n-tabs type="segment" v-auto-animate animated v-model:value="currentTab">
    <n-tab-pane name="details">
      <template #tab>
        <i class="fa-solid fa-info mr-2"></i>
        {{ t("repository.details") }}
      </template>

      <n-thing class="ml-3 mr-3 mb-2" style="width: 50%">
        <template #avatar>
          <n-avatar>
            <i class="fa-solid fa-database" />
          </n-avatar>
        </template>
        <template #header> {{ props.data.repository_name }} </template>
        <template #description> {{ props.data.path }} </template>

        <n-descriptions :column="3">
          <n-descriptions-item :label="t('repository.table.url')">
            {{ props.data.url }}
            <a :href="props.data.url" target="_blank" class="ml-2">
              <i class="fa-solid fa-external-link"></i
            ></a>
          </n-descriptions-item>
          <n-descriptions-item :label="t('repository.table.type')">
            {{ props.data.repository_type }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('repository.table.format')">
            {{ props.data.format }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('repository.table.component')">
            {{ props.data.component }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('repository.table.size')">
            {{ formatBytes(props.data.size) }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('repository.table.package_count')">
            <n-button text @click="currentTab = 'packages'">{{
              props.data.package_count
            }}</n-button>
          </n-descriptions-item>
          <n-descriptions-item :label="t('repository.table.updated_at')">
            {{ formatDate(props.data.updated_at) }}
          </n-descriptions-item>
        </n-descriptions>
      </n-thing>
    </n-tab-pane>

    <n-tab-pane name="packages">
      <template #tab>
        <i class="fa-solid fa-box-open mr-2"></i>
        {{ t("package.table.title") }}
        <n-badge class="ml-2" :value="props.data.package_count" color="grey" />
      </template>
      <n-card>
        <Table
          :loading="loading"
          :data="store.getPackages"
          :columns="packageColumns"
          :page-size="10"
        />
      </n-card>
    </n-tab-pane>
  </n-tabs>
</template>
