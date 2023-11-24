import { HttpClient } from "@/utils/http-common"
import { defineStore } from "pinia"

const http = new HttpClient("nexusProxy")

export const useUserRoleStore = defineStore({
  id: "users",
  state: () => ({
    roles: [] as any[],
    users: [] as any[],
  }),
  getters: {
    getRoles: (state) => state.roles,
    getUsers: (state) => state.users,
  },
  actions: {
    async fetchUsers() {
      return http.get(`service/rest/v1/security/users`).then((res) => {
        if (res.status == 200) {
          this.users = res.data
        } else {
          window.$notification.error({
            duration: 7000,
            title: "user fetch error",
            content: "user fetch error",
          })
        }
      })
    },
    async updateUsers(user: any) {
      return http
        .put(`service/rest/v1/security/users/${user.userId}`, {
          data: JSON.stringify(user),
        })
        .then((res) => {
          if (res.status == 200) {
            this.fetchUsers()
            window.$notification.success({
              duration: 7000,
              title: "We made it yeayyyyy",
              content: "Meaning: User updated",
            })
          } else {
            window.$notification.error({
              duration: 7000,
              title: "Upsss",
              content: "User update error",
            })
          }
        })
    },
    async fetchRoles() {
      return http.get(`service/rest/v1/security/roles`).then((res) => {
        if (res.status == 200) {
          this.roles = res.data.filter(
            (element: any) => !(element.source == "LDAP")
          )
        } else {
          window.$notification.error({
            duration: 7000,
            title: "roller yolda ölmüş",
            content: "couldnt fetched",
          })
        }
      })
    },
  },
})
