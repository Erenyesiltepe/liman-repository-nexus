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
    <n-card style="width: 600px" :title="t('common.copy')">
      <n-input-group>
        <n-input readonly v-model:value="store.getClientUrl" />
        <n-button ghost @click="copy">
          <i class="fa-solid fa-copy"></i>
        </n-button>
      </n-input-group>
    </n-card>
  </n-modal>
</template>
