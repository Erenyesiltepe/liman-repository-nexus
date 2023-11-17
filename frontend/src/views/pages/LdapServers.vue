<script setup lang="ts">
import { ref, onMounted, h } from "vue"
import Table from "@/components/Table.vue"
import { useLdapServerStore } from "@/stores/ldapServer"
import useEmitter from "@/utils/emitter"
import LdapServer from "@/views/modals/LdapServer.vue"
import { NButton } from "naive-ui"

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

onMounted(() => {
  store.fetchLdapOn().then(() => {
    store.fetchServers().then(() => {
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
  {
    title: "#",
    render: (row: any) => {
      return h(
        NButton,
        {
          onClick: () => {
            const { order, ...rest } = row
            emitter.emit("showLdapServerModal", {
              type: "edit",
              data: rest,
            })
          },
        },
        [h("i", { class: "fa-regular fa-pen-to-square" })]
      )
    },
  },
])
</script>
<template>
  <LdapServer />
  <n-space vertical>
    <n-card>
      <n-switch
        :value="store.getLdapOn"
        @update:value="handleupdate"
        :loading="loadActive"
      >
        <template #checked> LDAP is on </template>
        <template #unchecked> LDAP is off </template>
      </n-switch></n-card
    >
    <n-card>
      <Table :columns="columns" :loading="loading" :data="store.getServers">
        <template #buttons>
          <n-button
            @click="emitter.emit('showLdapServerModal', { type: 'create' })"
            ><i class="fas fa-plus"
          /></n-button>
        </template>
      </Table>
    </n-card>
  </n-space>
</template>
