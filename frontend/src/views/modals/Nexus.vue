<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useNexusStore } from "@/stores/nexus"

const store = useNexusStore()
const emitter = useEmitter()
const show = ref()

const data = ref({ name: "", blobStoreName: "default", proxy_url: "", port: 0 })
const selected = ref("apt/hosted")
const options = ref([
  {
    label: "apt hosted",
    key: "apt/hosted",
  },
  {
    label: "yum hosted",
    key: "yum/hosted",
  },
  {
    label: "apt proxy",
    key: "apt/proxy",
  },
  {
    label: "yum proxy",
    key: "yum/proxy",
  },
  {
    label: "docker proxy",
    key: "docker/proxy",
  },
  {
    label: "docker hosted",
    key: "docker/hosted",
  },
])

const blobs = ref([{ label: "default", key: "default" }])
store.fetchBlobstores().then(() => {
  blobs.value = store.getBlobstores
})

const select = (key: string) => {
  selected.value = key
}
const selectblob = (key: string) => {
  data.value.blobStoreName = key
}
const create = () => {
  store.createRepository(data.value, selected.value).then(() => {
    show.value = false
  })
}

emitter.on("showNexusModal", (condition: boolean) => {
  show.value = condition
  console.log("show modal " + condition)
})
</script>
<template>
  <n-drawer v-model:show="show">
    <n-drawer-content title="Install package">
      <n-form>
        <n-form-item label="Enter package type">
          <n-dropdown trigger="click" :options="options" @select="select">
            <n-button
              ><i class="fa-solid fa-caret-down" style="color: #005eff"></i>
              {{ selected }}</n-button
            >
          </n-dropdown>
        </n-form-item>
        <n-form-item label="Name">
          <n-input v-model:value="data.name" />
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
      </n-form>
      <template #footer>
        <n-button type="info" @click="create">Create</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
