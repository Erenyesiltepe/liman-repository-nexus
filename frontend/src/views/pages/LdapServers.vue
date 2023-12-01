<script setup lang="ts">
import { ref, onMounted, h } from "vue"
import Table from "@/components/Table.vue"
import { useLdapServerStore } from "@/stores/ldapServer"
import useEmitter from "@/utils/emitter"
import LdapServer from "@/views/modals/LdapServer.vue"
import { NButton } from "naive-ui"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
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
    title: t("nexus.test.columns.name"),
    key: "name",
  },
  {
    title: t("ldap_server.protocol"),
    key: "protocol",
  },
  {
    title: t("ldap_server.host"),
    key: "host",
  },
  {
    title: t("ldap_server.port"),
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
        <template #checked> {{ t("ldap_server.ldap_on") }} </template>
        <template #unchecked> {{ t("ldap_server.ldap_on") }} </template>
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
