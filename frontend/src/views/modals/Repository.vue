<script setup lang="ts">
import { ref } from "vue"
import type { FormInst } from "naive-ui"
import useEmitter from "@/utils/emitter"
import { useRepositoryStore } from "@/stores/repository.js"
import type { ICreateRepository } from "@/models/Repository"
import { useI18n } from "vue-i18n"

const store = useRepositoryStore()
const emitter = useEmitter()
const { t } = useI18n()
const show = ref(false)
const formRef = ref<FormInst | null>(null)

const values = ref<ICreateRepository>({
  path: "",
  repository_name: "",
  url: "",
  distribution: "",
  component: "",
  repository_type: "mirror",
})

const rules = {
  repository_name: {
    required: true,
    message: t("repository.create.validation.name"),
  },
}

emitter.on("showRepositoryModal", () => {
  show.value = true
})

const create = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      store.create(values.value).then(() => {
        show.value = false
      })
    }
  })
}
</script>

<template>
  <n-drawer v-model:show="show" :width="502">
    <n-drawer-content :title="t('repository.create.title')">
      <n-form ref="formRef" :rules="rules" :model="values">
        <n-form-item path="repository_name">
          <template #label>
            {{ t("repository.table.name") }}
            <small class="ml-2">{{
              t("repository.create.helpers.name")
            }}</small>
          </template>
          <n-input v-model:value="values.repository_name" />
        </n-form-item>

        <n-form-item :label="t('repository.table.path')" path="path">
          <n-input v-model:value="values.path" />
        </n-form-item>

        <n-form-item :label="t('repository.table.url')" path="url">
          <n-input v-model:value="values.url" />
        </n-form-item>

        <n-form-item path="distribution">
          <template #label>
            {{ t("repository.table.distribution") }}
            <small class="ml-2">{{
              t("repository.create.helpers.distribution")
            }}</small>
          </template>
          <n-input v-model:value="values.distribution" />
        </n-form-item>

        <n-form-item :label="t('repository.table.component')" path="component">
          <n-input v-model:value="values.component" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button type="primary" @click="create()"
            >{{ t("common.create") }}
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
