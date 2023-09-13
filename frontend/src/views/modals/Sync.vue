<script setup lang="ts">
import { ref } from "vue"
import type { FormInst } from "naive-ui"
import useEmitter from "@/utils/emitter"
import { useSyncStore } from "@/stores/sync.js"
import type { ICreateSync, ISync } from "@/models/Sync"
import { useI18n } from "vue-i18n"
import RepositorySelect from "@/components/Select/RepositorySelect.vue"
import { isUndefined } from "lodash"

const store = useSyncStore()
const emitter = useEmitter()
const { t } = useI18n()
const show = ref(false)
const formRef = ref<FormInst | null>(null)
const id = ref()

// TRUE means UPDATE
// FALSE means CREATE
const mode = ref(false)

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

emitter.on("showSyncModal", (data: ISync) => {
  if (!isUndefined(data)) {
    mode.value = true
    values.value = { ...data }
    id.value = data.id
  } else {
    mode.value = false
  }
  show.value = true
})

const create = () => {
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
      :title="!mode ? t('sync.create.title') : t('sync.update.title')"
    >
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
          <n-input-number
            v-model:value="values.interval"
            :disabled="values.is_one_time"
          ></n-input-number>
        </n-form-item>

        <n-form-item :label="t('sync.table.is_one_time')" path="is_one_time">
          <n-switch
            v-model:value="values.is_one_time"
            @update:value="
              (value: boolean) => {
                if(value) values.interval = 1
              }
            "
          ></n-switch>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button type="primary" @click="create()"
            >{{ !mode ? t("common.create") : t("common.edit") }}
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
