<script setup lang="ts">
import { ref } from "vue"
import type { FormInst } from "naive-ui"
import useEmitter from "@/utils/emitter"
import { useRepositoryStore } from "@/stores/repository.js"
import type { ICreateRepository, IRepository } from "@/models/Repository"
import { useI18n } from "vue-i18n"
import { isUndefined } from "lodash"

const store = useRepositoryStore()
const emitter = useEmitter()
const { t } = useI18n()
const show = ref(false)
const formRef = ref<FormInst | null>(null)
const id = ref()

// TRUE means UPDATE
// FALSE means CREATE
const mode = ref(false)

const values = ref<ICreateRepository>({
  path: "",
  repository_name: "",
  url: "",
  distribution: "",
  component: "",
  repository_type: "mirror",
  public_key: "",
})

const rules = {
  repository_name: {
    required: true,
    message: "",
    trigger: ["input"],
  },
  path: {
    required: true,
    message: "",
    trigger: ["input"],
  },
  url: {
    required: true,
    message: "",
    trigger: ["input"],
  },
  distribution: {
    required: true,
    message: "",
    trigger: ["input"],
  },
  component: {
    required: true,
    message: "",
    trigger: ["input"],
  },
}

emitter.on("showRepositoryModal", (data: IRepository) => {
  if (!isUndefined(data)) {
    mode.value = true
    values.value = { ...data }
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
      :title="
        !mode ? t('repository.create.title') : t('repository.update.title')
      "
    >
      <n-form ref="formRef" :rules="rules" :model="values">
        <div v-if="!mode">
          <n-form-item path="repository_name">
            <template #label>
              {{ t("repository.table.name") }}
              <small class="ml-2">{{
                t("repository.create.helpers.name")
              }}</small>
            </template>
            <n-input
              @keydown.space="(event: Event) => event.preventDefault()"
              v-model:value="values.repository_name"
            />
          </n-form-item>

          <n-form-item path="path">
            <template #label>
              {{ t("repository.table.path") }}
              <small class="ml-2">{{
                t("repository.create.helpers.path")
              }}</small>
            </template>
            <n-input
              @keydown.space="(event: Event) => event.preventDefault()"
              v-model:value="values.path"
            />
          </n-form-item>

          <n-form-item path="url">
            <template #label>
              {{ t("repository.table.url") }}
              <small class="ml-2">{{
                t("repository.create.helpers.url")
              }}</small>
            </template>
            <n-input
              @keydown.space="(event: Event) => event.preventDefault()"
              v-model:value="values.url"
            />
          </n-form-item>

          <n-form-item path="distribution">
            <template #label>
              {{ t("repository.table.distribution") }}
              <small class="ml-2">{{
                t("repository.create.helpers.distribution")
              }}</small>
            </template>
            <n-input
              @keydown.space="(event: Event) => event.preventDefault()"
              v-model:value="values.distribution"
            />
          </n-form-item>
        </div>

        <n-form-item path="component">
          <template #label>
            {{ t("repository.table.component") }}
            <small class="ml-2">{{
              t("repository.create.helpers.component")
            }}</small>
          </template>
          <n-input
            @keydown.space="(event: Event) => event.preventDefault()"
            v-model:value="values.component"
          />
        </n-form-item>

        <n-form-item path="public_key">
          <template #label>
            {{ t("repository.table.public_key") }}
          </template>
          <n-input
            type="textarea"
            v-model:value="values.public_key"
            placeholder="Public Key"
          />
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
