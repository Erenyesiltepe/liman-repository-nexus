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

onMounted(() => {
  store.fetchUsers().then(() => {
    loading.value = false
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
    title: "Source",
    key: "source",
  },
  {
    title: "#",
    render: (row: any) => {
      return h(
        NButton,
        {
          onClick: () => {
            emitter.emit("openRoleEdit", { ...row })
          },
        },
        [h("i", { class: "fa-regular fa-pen-to-square" })]
      )
    },
  },
])
</script>
<template>
  <RoleEdit />
  <n-card>
    <Table :columns="columns" :loading="loading" :data="store.getUsers">
    </Table>
  </n-card>
</template>
