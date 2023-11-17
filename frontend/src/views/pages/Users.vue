<script setup lang="ts">
import { ref, onMounted, h } from "vue"
import Table from "@/components/Table.vue"
import { useUserRoleStore } from "@/stores/user_role"
import useEmitter from "@/utils/emitter"
import RoleEdit from "../modals/RoleEdit.vue"
import { NButton } from "naive-ui"

const emitter = useEmitter()
const store = useUserRoleStore()

const loading = ref(true)

const data = ref()
onMounted(() => {
  store.fetchUsers().then(() => {
    loading.value = false
    data.value = store.getUsers
  })
})

const columns = ref([
  {
    title: "User ID",
    key: "userId",
  },
  {
    title: "First Name",
    key: "firstName",
  },
  {
    title: "Last Name",
    key: "lastName",
  },
  {
    title: "#",
    render: (row: any) => {
      return h(
        NButton,
        {
          onClick: () => {
            emitter.emit("openRoleEdit", row)
          },
        },
        ["edit"]
      )
    },
  },
])
</script>
<template>
  <RoleEdit />
  <n-card>
    <Table :columns="columns" :loading="loading" :data="data">
      <template #buttons>
        <n-button @click="emitter.emit('showLdapServerModal')"
          ><i class="fas fa-plus"
        /></n-button>
      </template>
    </Table>
  </n-card>
</template>
