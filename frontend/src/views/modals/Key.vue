<script setup lang="ts">
import { ref } from "vue"
import type { FormInst } from "naive-ui"
import useEmitter from "@/utils/emitter"
import { useKeyStore } from "@/stores/key.js"
import type { IKey, IKeyCreate } from "@/models/Key"
import { useI18n } from "vue-i18n"
import { isUndefined } from "lodash"

const store = useKeyStore()
const emitter = useEmitter()
const { t } = useI18n()
const show = ref(false)
const formRef = ref<FormInst | null>(null)
const id = ref()

// TRUE means UPDATE
// FALSE means CREATE
const mode = ref(false)

const values = ref<IKeyCreate>({
  name: "",
  content: "",
})

const rules = {
  name: {
    required: true,
    message: "",
    trigger: ["input"],
  },
  content: {
    required: true,
    message: "",
    trigger: ["input"],
  },
}

emitter.on("showKeyModal", (data: IKey) => {
  if (!isUndefined(data)) {
    mode.value = true
    values.value = {
      name: data.name,
      content: data.content,
    }
    id.value = data.id
  } else {
    mode.value = false
  }
  show.value = true
})

const submit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (mode.value) {
        store.update(values.value, id.value).then(() => {
          show.value = false
        })
      } else {
        store.create(values.value).then(() => {
          show.value = false
        })
      }
    }
  })
}
</script>

<template>
  <n-drawer v-model:show="show" :width="502">
    <n-drawer-content
      :title="!mode ? t('key.create.title') : t('key.update.title')"
    >
      <n-form ref="formRef" :rules="rules" :model="values">
        <n-form-item :label="t('key.table.name')" path="name">
          <n-input v-model:value="values.name"></n-input>
        </n-form-item>
        <n-form-item :label="t('key.table.content')" path="content">
          <n-input type="textarea" v-model:value="values.content"></n-input>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button type="primary" @click="submit()"
            >{{ !mode ? t("common.create") : t("common.edit") }}
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
