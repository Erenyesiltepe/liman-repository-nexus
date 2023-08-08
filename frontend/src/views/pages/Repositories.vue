<script setup lang="ts">
import { ref } from "vue"
import AsyncStoreTable from "@/components/Table/AsyncStore.vue"
import { useI18n } from "vue-i18n"
import { useRepositoryStore } from "@/stores/repository"

const { t } = useI18n()
const store = useRepositoryStore()

const columns = ref([])
store.fetch()
</script>

<template>
  <n-card> Repositories </n-card>
</template>
