<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useUserRoleStore } from "@/stores/user_role"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const store = useUserRoleStore()
const emitter = useEmitter()
const show = ref()

const data = ref({
  userId: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  source: "",
  status: "active",
  readOnly: true,
  roles: [""],
  externalRoles: [""],
})

emitter.on("showUserModal", () => {
  show.value = true
})
</script>
<template>
  <n-drawer v-model:show="show">
    <n-drawer-content title="Install package">
      <n-form>
        <n-form-item label="Name">
          <n-input v-model:value="data.firstName" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button type="info">Create</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
