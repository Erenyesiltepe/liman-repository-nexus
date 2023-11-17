<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useLdapServerStore } from "@/stores/ldapServer"
import type { FormRules } from "naive-ui"
import { defaultLdap } from "@/templates/LdapTemp"

const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: "input",
      message: "Name is required",
    },
  ],
  host: [
    {
      required: true,
      trigger: "input",
      message: "Host is required",
    },
  ],
  port: [
    {
      required: true,
      trigger: "input",
      message: "Port is required",
    },
  ],
  base: [
    {
      required: true,
      trigger: "input",
      message: "Base is required",
    },
  ],
  username: [
    {
      required: true,
      trigger: "input",
      message: "Username is required",
    },
  ],
  password: [
    {
      required: true,
      trigger: "input",
      message: "Password is required",
    },
  ],
}

const store = useLdapServerStore()
const emitter = useEmitter()
const show = ref(false)
const op_type = ref()

const data = ref()

emitter.on("showLdapServerModal", (newdata: any) => {
  op_type.value = newdata.type

  newdata.type == "create"
    ? (data.value = defaultLdap)
    : (data.value = newdata.data)

  show.value = true
})

function submit() {
  op_type.value == "create"
    ? store.createServer(data.value).then(() => {
        store.fetchLdapOn()
        store.fetchServers()
        show.value = false
      })
    : store.updateServer(data.value).then(() => {
        store.fetchLdapOn()
        store.fetchServers()
        show.value = false
      })
}
</script>
<template>
  <n-drawer v-model:show="show">
    <n-drawer-content
      :title="op_type == 'create' ? 'Create Server' : 'Edit Server'"
    >
      <n-form :rules="rules" :model="data">
        <n-form-item label="Name" path="name">
          <n-input v-model:value="data.name" />
        </n-form-item>
        <n-form-item label="Host" path="host">
          <n-input v-model:value="data.host" />
        </n-form-item>
        <n-form-item label="Port" path="port">
          <n-input-number v-model:value="data.port" clearable />
        </n-form-item>
        <n-form-item label="Search Base" path="base">
          <n-input v-model:value="data.searchBase" />
        </n-form-item>
        <n-form-item label="Auth Username" path="username">
          <n-input v-model:value="data.authUsername" />
        </n-form-item>
        <n-form-item label="Password" path="password">
          <n-input v-model:value="data.authPassword" type="password" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button type="info" @click="submit">{{
          op_type == "create" ? "Create" : "Edit"
        }}</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
