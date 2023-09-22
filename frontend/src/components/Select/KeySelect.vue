<script setup lang="ts">
import { useKeyStore } from "@/stores/key"
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

const store = useKeyStore()
const { t } = useI18n()

const props = defineProps<{
  key_id: any
}>()

const emit = defineEmits<{
  (event: "update:key_id", ...args: any[]): void
}>()

const value = computed({
  get() {
    return props.key_id
  },
  set(value) {
    emit("update:key_id", value)
  },
})

const createDebounce = () => {
  let timeout: number | undefined = 0
  return function (fnc: () => void, delayMs: any) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fnc()
    }, delayMs || 500)
  }
}
const searchDebounce = createDebounce()

const loading = ref(true)
const handleSearch = (query: string) => {
  loading.value = true
  searchDebounce(() => {
    store
      .fetch({
        search: query,
        per_page: 20,
      })
      .then(() => {
        loading.value = false
      })
  }, 300)
}

onMounted(() => {
  store.fetch({}).then(() => {
    loading.value = false
  })
})
</script>

<template>
  <n-space vertical style="width: 100%">
    <n-select
      v-model:value="value"
      filterable
      placeholder="Yazarak arayın..."
      :options="store.get.records"
      :loading="loading"
      clearable
      remote
      :clear-filter-after-select="false"
      @search="handleSearch"
      label-field="name"
      value-field="id"
    />
    <small>{{ t("key.select.helper") }}</small></n-space
  >
</template>
