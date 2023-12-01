<script setup lang="ts">
import { ref, onMounted, h } from "vue"
import Table from "@/components/Table.vue"
import { useUserRoleStore } from "@/stores/user_role"
import useEmitter from "@/utils/emitter"
import RoleEdit from "../modals/RoleEdit.vue"
import { NButton } from "naive-ui"
import { useI18n } from "vue-i18n"

const emitter = useEmitter()
const store = useUserRoleStore()
const { t } = useI18n()
const loading = ref(true)

onMounted(() => {
  store.fetchUsers().then(() => {
    loading.value = false
  })
})

const columns = ref([
  {
    title: t("users.columns.id"),
    key: "userId",
  },
  {
    title: t("users.columns.first_name"),
    key: "firstName",
  },
  {
    title: t("users.columns.last_name"),
    key: "lastName",
  },
  {
    title: t("users.columns.source"),
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
