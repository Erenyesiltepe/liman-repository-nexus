<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useNexusStore } from "@/stores/nexus"

const store = useNexusStore()
const emitter = useEmitter()
const show = ref()
const type = ref("create")

const data = ref()
const selected = ref("apt/hosted")

const blobs = ref([{ label: "default", key: "default" }])
store.fetchBlobstores().then(() => {
  blobs.value = store.getBlobstores
})

const selectblob = (key: string) => {
  data.value.blobStoreName = key
}
const create = () => {
  type.value == "create"
    ? store.createRepository(data.value, selected.value).then(() => {
        show.value = false
      })
    : store.updateRepository(data.value, selected.value).then(() => {
        show.value = false
      })
}

emitter.on("showNexusModal", (obj: any) => {
  show.value = true
  type.value = obj.itype
  obj.itype == "create"
    ? (data.value = {
        name: "",
        blobStoreName: "default",
        proxy_url: "",
        port: 0,
        enableAnonymus: true,
        keypair: "",
        passphrase: "",
        distribution: "",
      })
    : (data.value = {
        name: obj.ndata.name,
        blobStoreName: obj.ndata.storage.blobStoreName,
        proxy_url: obj.ndata.type == "proxy" ? obj.ndata.url : "",
        port: obj.ndata.format == "docker" ? obj.ndata.docker.httpPort : 0,
        enableAnonymus:
          obj.ndata.format == "docker"
            ? !obj.ndata.docker.forceBasicAuth
            : false,
        keypair: obj.activeTab == "apt/hosted" || obj.activeTab == "yum/proxy",
      })
  selected.value = obj.activeTab
})
</script>
<template>
  <n-drawer v-model:show="show">
    <n-drawer-content
      :title="type == 'create' ? 'Install package' : 'Update Package'"
    >
      <n-form>
        <n-form-item label="Package Type">
          <div>{{ selected.split("/")[0] + " " + selected.split("/")[1] }}</div>
        </n-form-item>
        <n-form-item label="Name">
          <n-input v-model:value="data.name" :disabled="!(type == 'create')" />
        </n-form-item>
        <n-form-item label="Blobstore Name">
          <n-dropdown trigger="click" :options="blobs" @select="selectblob">
            <n-button
              ><i class="fa-solid fa-caret-down" style="color: #005eff"></i>
              {{ data.blobStoreName }}</n-button
            >
          </n-dropdown>
        </n-form-item>
        <n-form-item v-if="selected.split('/')[1] == 'proxy'" label="Proxy URL">
          <n-input v-model:value="data.proxy_url" />
        </n-form-item>
        <n-form-item v-if="selected.split('/')[0] == 'docker'" label="Port">
          <n-input-number v-model:value="data.port" clearable />
        </n-form-item>
        <n-form-item v-if="selected.split('/')[0] == 'docker'">
          <n-checkbox v-model:checked="data.enableAnonymus">
            Allow Anonymus Docker Pull
          </n-checkbox>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="create">{{
          type == "create" ? "Create" : "Edit"
        }}</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
