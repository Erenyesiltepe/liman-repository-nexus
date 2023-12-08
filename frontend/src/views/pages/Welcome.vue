<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useNexusStore } from "@/stores/nexus"
import { ref } from "vue"
import TooltipBtn from "@/components/TooltipBtn.vue"

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
</script>
<template>
  <n-card> {{ t("welcome") }} </n-card>
  <n-table>
    <tr>
      <th>{{ t("repo_type") }}</th>
      <th>{{ t("repo_count") }}</th>
    </tr>
    <tr v-for="repo in list" :key="repo.key">
      <td>
        <TooltipBtn :desc="t('tips.go_to') + repo.label">
          <n-button
            @click="router.push({ name: 'nexus', params: { tab: repo.key } })"
            >{{ repo.label }}</n-button
          >
        </TooltipBtn>
      </td>
      <td v-if="showdist">{{ distribution[repo.key.replace("/", "")] }}</td>
    </tr>
  </n-table>
</template>
