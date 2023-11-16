import { HttpClient } from "@/utils/http-common"
import { defineStore } from "pinia"

const http = new HttpClient("nexusProxy")

export const useNexusStore = defineStore({
  id: "users",
  state: () => ({
    roles: [] as any[],
    users: [] as any[],
  }),
  getters: {
    getRoles: (state) => state.roles, //get
    getUsers: (state) => state.users, //get update
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
        .get(`service/rest/v1/security/users/${user.userId}`, {
          data: JSON.stringify(user),
        })
        .then((res) => {
          console.log(res)
          if (res.status == 200) {
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
    async getRoles() {
      return http.delete(`service/rest/v1/repositories/${name}`).then((res) => {
        console.log(res.data)
        if (res.status == 200) {
          window.$notification.success({
            duration: 7000,
            title: "kalan roller bizimdir",
            content: "roles are fetched",
          })
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
