<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useI18n } from "vue-i18n"
import { useRepositoryStore } from "@/stores/repository"

const { t } = useI18n()
const emitter = useEmitter()
const store = useRepositoryStore()
const show = ref(false)

emitter.on("showURLModal", (id: string) => {
  store.fetchClientUrl(id).then(() => {
    show.value = true
  })
})

const copy = () => {
  navigator.clipboard.writeText(store.getClientUrl)
  window.$notification.success({
    duration: 3000,
    title: t("common.success"),
    content: t("common.copied"),
  })
}
</script>

<template>
  <n-modal v-model:show="show">
    <n-card style="width: 600px" :title="t('repository.table.client_url')">
      <n-input-group>
        <n-input
          type="textarea"
          readonly
          v-model:value="store.getClientUrl"
          :rows="7"
        />
      </n-input-group>
      <template #footer>
        <n-space justify="end">
          <n-button ghost @click="copy">
            <i class="fa-solid fa-copy mr-2"></i>{{ t("common.copy") }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>
