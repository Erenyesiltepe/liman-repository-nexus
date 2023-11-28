<script setup lang="ts">
import { ref } from "vue"
import useEmitter from "@/utils/emitter"
import { useUserRoleStore } from "@/stores/user_role"

interface IRole {
  description: string
  id: string
  name: string
  privilages: Array<string>
  readOnly: boolean
  roles: Array<string>
  source: string
}

interface IRoleRow {
  active: boolean
  role: string
}

const store = useUserRoleStore()
const emitter = useEmitter()
const show = ref()
const userData = ref()
const activeRoles = ref<Array<IRoleRow>>([])
const availableRoles = ref<Array<IRoleRow>>([])

emitter.on("openRoleEdit", (data: any) => {
  userData.value = data
  show.value = true
  parseRoles()
})

function parseRoles() {
  store.fetchRoles().then(() => {
    activeRoles.value = []
    availableRoles.value = []
    store.getRoles.forEach((role: IRole) => {
      userData.value.roles.includes(role.id)
        ? activeRoles.value.push({ role: role.id, active: false })
        : availableRoles.value.push({ role: role.id, active: false })
    })
  })
}

function click(row: IRoleRow) {
  row.active = !row.active
}

function changeArrays(query: any, toshift: any, inshift: any) {
  const set2 = new Set()
  query.forEach((element: any) => {
    set2.add(element.innerHTML)
  })
  toshift.value = toshift.value.filter((element: IRoleRow) => {
    if (set2.has(element.role)) {
      element.active = false
      inshift.value.push(element)
      return false
    }
    return true
  })
}

function shift(side: string) {
  if (side == "r") {
    const selecteds = document.querySelectorAll(".available .active")
    changeArrays(selecteds, availableRoles, activeRoles)
  } else {
    const selecteds = document.querySelectorAll(".actives .active")
    changeArrays(selecteds, activeRoles, availableRoles)
  }
}

function apply() {
  if (activeRoles.value.length == 0) {
    window.$notification.error({
      duration: 7000,
      title: "En az bir rol seçilmeli",
      content: "Yoda:Seçilmeli en az bir rol",
    })
  } else {
    userData.value.roles = activeRoles.value.map((elem: IRoleRow) => {
      return elem.role
    })
    userData.value.lastName == null ? (userData.value.lastName = "a") : null
    userData.value.emailAddress == null
      ? (userData.value.emailAddress = "a@example.com")
      : null
    store.updateUsers(userData.value).then(() => {
      show.value = false
    })
  }
}
</script>
<template>
  <n-modal v-model:show="show">
    <n-card
      style="width: fit-content"
      title="Edit User Roles"
      :bordered="true"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space>
        <n-card class="card available" :bordered="true" title="Available Roles">
          <n-scrollbar style="max-height: 170px">
            <table>
              <tr
                v-for="role in availableRoles"
                :key="role.role"
                :class="{ active: role.active }"
                @click="click(role)"
              >
                {{
                  role.role
                }}
              </tr>
            </table>
          </n-scrollbar>
        </n-card>
        <div class="mybtns">
          <n-space vertical align="center" justfy="center">
            <n-button @click="shift('r')">&gt;</n-button>
            <n-button @click="shift('l')">&lt;</n-button>
          </n-space>
        </div>
        <n-card class="card actives" :bordered="true" title="Active Roles">
          <n-scrollbar style="max-height: 170px">
            <table>
              <tr
                v-for="role in activeRoles"
                :key="role.role"
                :class="{ active: role.active }"
                @click="click(role)"
              >
                {{
                  role.role
                }}
              </tr>
            </table>
          </n-scrollbar>
        </n-card>
      </n-space>
      <n-button @click="apply">Apply</n-button>
    </n-card>
  </n-modal>
</template>

<style>
.card {
  width: 350px;
  height: 250px;
}
.mybtns {
  display: flex;
  height: 200px;
  align-items: center;
  justify-content: center;
  margin: 5px auto;
}
.active {
  background-color: aqua;
}
tr:hover {
  cursor: pointer;
  background-color: aquamarine;
}
</style>
