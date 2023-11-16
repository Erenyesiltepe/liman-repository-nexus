<script setup lang="ts">
import { ref, onMounted } from "vue"
import Table from "@/components/Table.vue"
import { useLdapServerStore } from "@/stores/ldapServer"
import useEmitter from "@/utils/emitter"
import LdapServer from "@/views/modals/LdapServer.vue"

const emitter = useEmitter()
const store = useLdapServerStore()

const ldapActive = ref(true)
const loadActive = ref(false)
function handleupdate(value: boolean) {
  loadActive.value = true
  store.setLdapOn(value).then(() => {
    ldapActive.value = store.getLdapOn
    loadActive.value = false
  })
}

const loading = ref(true)
const data = ref()
onMounted(() => {
  store.fetchLdapOn().then(() => {
    ldapActive.value = store.getLdapOn
    console.log(ldapActive.value)
    store.fetchServers().then(() => {
      data.value = store.getServers
      loading.value = false
    })
  })
})

const columns = ref([
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Protocol",
    key: "protocol",
  },
  {
    title: "Host",
    key: "host",
  },
  {
    title: "Port",
    key: "port",
  },
])
</script>
<template>
  <LdapServer />
  <n-space vertical>
    <n-card>
      <n-switch
        :value="ldapActive"
        @update:value="handleupdate"
        :loading="loadActive"
      >
        <template #checked> LDAP is on </template>
        <template #unchecked> LDAP is off </template>
      </n-switch></n-card
    >
    <n-card>
      <Table :columns="columns" :loading="loading" :data="data">
        <template #buttons>
          <n-button @click="emitter.emit('showLdapServerModal')"
            ><i class="fas fa-plus"
          /></n-button>
        </template>
      </Table>
    </n-card>
  </n-space>
</template>
