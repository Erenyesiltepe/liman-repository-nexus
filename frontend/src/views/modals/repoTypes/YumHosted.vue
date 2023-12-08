<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useNexusStore } from "@/stores/nexus"
import { optionTypes } from "@/templates/RepoTemp"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const store = useNexusStore()
const emitter = useEmitter()
const show = ref()
const type = ref("create")
const data = ref()

const blobs = ref([{ label: "default", key: "default" }])

const selectblob = (key: string) => {
  data.value.storage.blobStoreName = key
}
const create = () => {
  type.value == "create"
    ? store.createRepository(data.value, "yum/hosted").then(() => {
        show.value = false
      })
    : store.updateRepository(data.value, "yum/proxy").then(() => {
        show.value = false
      })
}

emitter.on("showyumhosted", (obj: any) => {
  show.value = true
  type.value = obj.itype
  blobs.value = obj.blobs
  obj.itype == "create"
    ? (data.value = optionTypes["yumhosted"])
    : (data.value = obj.ndata)
})
</script>
<template>
  <n-drawer v-model:show="show">
    <n-drawer-content
      :title="type == 'create' ? t('drawers.install') : t('drawers.update')"
    >
      <n-form>
        <n-form-item :label="t('drawers.package_type')">
          <div>Yum Hosted</div>
        </n-form-item>
        <n-form-item :label="t('drawers.name')">
          <n-input v-model:value="data.name" :disabled="!(type == 'create')" />
        </n-form-item>
        <n-form-item :label="t('drawers.blob_name')">
          <n-dropdown trigger="click" :options="blobs" @select="selectblob">
            <n-button
              ><i class="fa-solid fa-caret-down" style="color: #005eff"></i>
              {{ data.storage.blobStoreName }}</n-button
            >
          </n-dropdown>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="create" type="success">{{
          type == "create" ? t("drawers.create") : t("drawers.edit")
        }}</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
