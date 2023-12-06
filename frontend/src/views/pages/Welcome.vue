<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useNexusStore } from "@/stores/nexus"
import { ref } from "vue"

const store = useNexusStore()
const router = useRouter()
const { t } = useI18n()
const distribution = ref()
const showdist = ref(false)

store.fetchDistribution().then(() => {
  distribution.value = store.getDistribution
  showdist.value = true
})

const list = ref([
  {
    label: "APT Hosted",
    key: "apt/hosted",
  },
  {
    label: "YUM Hosted",
    key: "yum/hosted",
  },
  {
    label: "APT Proxy",
    key: "apt/proxy",
  },
  {
    label: "YUM Proxy",
    key: "yum/proxy",
  },
  {
    label: "Docker Proxy",
    key: "docker/proxy",
  },
  {
    label: "Docker Hosted",
    key: "docker/hosted",
  },
])

/* function gonexus() {
  emitter.emit("goNexus", "apt/proxy")
  router.push({ name: "nexus", params: { tab: "apt/proxy" } })
} */
</script>
<template>
  <n-card> {{ t("welcome") }} </n-card>
  <n-table>
    <tr>
      <th>Repository Type</th>
      <th>Repository Count</th>
    </tr>
    <tr v-for="repo in list" :key="repo.key">
      <td>
        <n-button
          @click="router.push({ name: 'nexus', params: { tab: repo.key } })"
          >{{ repo.label }}</n-button
        >
      </td>
      <td v-if="showdist">{{ distribution[repo.key.replace("/", "")] }}</td>
    </tr>
  </n-table>
</template>
