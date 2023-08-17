<script setup lang="ts">
import { ref } from "vue"
import type { FormInst } from "naive-ui"
import useEmitter from "@/utils/emitter"
import { useSyncStore } from "@/stores/sync.js"
import type { ICreateSync } from "@/models/Sync"
import { useI18n } from "vue-i18n"
import RepositorySelect from "@/components/Select/RepositorySelect.vue"

const store = useSyncStore()
const emitter = useEmitter()
const { t } = useI18n()
const show = ref(false)
const formRef = ref<FormInst | null>(null)

const values = ref<ICreateSync>({
  repository_id: null,
  run_time: "",
  interval: 1,
  is_one_time: false,
})

const rules = {
  repository_id: {
    required: true,
    message: "",
    trigger: ["input"],
  },
  run_time: {
    required: true,
    message: "",
    trigger: ["input"],
  },
  interval: {
    type: "number",
    required: true,
    message: "",
    trigger: ["input"],
  },
}

emitter.on("showSyncModal", () => {
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
    <n-drawer-content :title="t('sync.create.title')">
      <n-form ref="formRef" :rules="rules" :model="values">
        <n-form-item
          :label="t('sync.table.repository_name')"
          path="repository_id"
        >
          <RepositorySelect v-model:repository="values.repository_id" />
        </n-form-item>

        <n-form-item :label="t('sync.table.run_time')" path="run_time">
          <n-input
            v-model:value="values.run_time"
            placeholder="09:00"
          ></n-input>
        </n-form-item>

        <n-form-item :label="t('sync.table.interval')" path="interval">
          <n-input-number v-model:value="values.interval"></n-input-number>
        </n-form-item>

        <n-form-item :label="t('sync.table.is_one_time')" path="is_one_time">
          <n-switch v-model:value="values.is_one_time"></n-switch>
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
