<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useNexusStore } from "@/stores/nexus"
import { optionTypes } from "@/templates/RepoTemp"

const store = useNexusStore()
const emitter = useEmitter()
const show = ref()
const type = ref("create")
const data = ref()

const blobs = ref([{ label: "default", key: "default" }])
store.fetchBlobstores().then(() => {
  blobs.value = store.getBlobstores
})

const selectblob = (key: string) => {
  data.value.storage.blobStoreName = key
}
const create = () => {
  data.value.docker.forceBasicAuth = !data.value.docker.forceBasicAuth
  type.value == "create"
    ? store.createRepository(data.value, "docker/hosted").then(() => {
        show.value = false
      })
    : store.updateRepository(data.value, "docker/hosted").then(() => {
        show.value = false
      })
}

emitter.on("showdockerhosted", (obj: any) => {
  show.value = true
  type.value = obj.itype
  obj.itype == "create"
    ? (data.value = optionTypes["dockerhosted"])
    : (data.value = obj.ndata)
})
</script>
<template>
  <n-drawer v-model:show="show">
    <n-drawer-content
      :title="type == 'create' ? 'Install package' : 'Update Package'"
    >
      <n-form>
        <n-form-item label="Package Type">
          <div>Docker Hosted</div>
        </n-form-item>
        <n-form-item label="Name">
          <n-input v-model:value="data.name" :disabled="!(type == 'create')" />
        </n-form-item>
        <n-form-item label="Blobstore Name">
          <n-dropdown trigger="click" :options="blobs" @select="selectblob">
            <n-button
              ><i class="fa-solid fa-caret-down" style="color: #005eff"></i>
              {{ data.storage.blobStoreName }}</n-button
            >
          </n-dropdown>
        </n-form-item>
        <n-form-item label="Port">
          <n-input-number v-model:value="data.docker.httpPort" clearable />
        </n-form-item>
        <n-form-item>
          <n-checkbox v-model:checked="data.docker.forceBasicAuth">
            Allow Anonymus Docker Pull
          </n-checkbox>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="create" type="success">{{
          type == "create" ? "Create" : "Edit"
        }}</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
