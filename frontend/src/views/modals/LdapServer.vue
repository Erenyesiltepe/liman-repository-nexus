<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useLdapServerStore } from "@/stores/ldapServer"

const store = useLdapServerStore()
const emitter = useEmitter()
const show = ref()

const data = ref({
  name: "",
  protocol: "ldap",
  useTrustStore: true,
  host: "",
  port: 636,
  searchBase: "dc=example,dc=com",
  authScheme: "NONE",
  authRealm: "example.com",
  authUsername: "string",
  connectionTimeoutSeconds: 1,
  connectionRetryDelaySeconds: 0,
  maxIncidentsCount: 0,
  userBaseDn: "cn=users",
  userSubtree: true,
  userObjectClass: "user",
  userLdapFilter: "",
  userIdAttribute: "sAMAccountName",
  userRealNameAttribute: "cn",
  userEmailAddressAttribute: "mail",
  userPasswordAttribute: "",
  ldapGroupsAsRoles: true,
  groupType: "static",
  groupSubtree: false,
  userMemberOfAttribute: "memberOf",
  authPassword: "",
})

emitter.on("showLdapServerModal", () => {
  show.value = true
  console.log("show modal ")
})
</script>
<template>
  <n-drawer v-model:show="show">
    <n-drawer-content title="Install package">
      <n-form>
        <n-form-item label="Name">
          <n-input v-model:value="data.name" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button type="info">Create</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
