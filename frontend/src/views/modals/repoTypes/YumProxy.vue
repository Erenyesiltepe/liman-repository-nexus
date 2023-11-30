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
  type.value == "create"
    ? store.createRepository(data.value, "yum/hosted").then(() => {
        show.value = false
      })
    : store.updateRepository(data.value, "yum/proxy").then(() => {
        show.value = false
      })
}

emitter.on("showyumproxy", (obj: any) => {
  show.value = true
  type.value = obj.itype
  obj.itype == "create"
    ? (data.value = optionTypes["yumproxy"])
    : ((obj.ndata = {
        ...obj.ndata,
        yumSigning: {
          keypair: "",
          passphrase: "",
        },
      }),
      (data.value = obj.ndata))
  console.log(data.value)
})
</script>
<template>
  <n-drawer v-model:show="show">
    <n-drawer-content
      :title="type == 'create' ? 'Install package' : 'Update Package'"
    >
      <n-form>
        <n-form-item label="Package Type">
          <div>Yum Proxy</div>
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
        <n-form-item label="Proxy URL">
          <n-input v-model:value="data.proxy.remoteUrl" />
        </n-form-item>
        <n-form-item label="Signing Key">
          <n-input v-model:value="data.yumSigning.keypair" />
        </n-form-item>
        <n-form-item label="Passphrase">
          <n-input v-model:value="data.yumSigning.passphrase" />
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
