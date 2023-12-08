import { HttpClient } from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
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
            title: i18n.t("common.error"),
            content: i18n.t("users.info.user_fetch_error"),
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
              title: i18n.t("commmon.success"),
              content: i18n.t("users.info.user_update_success"),
            })
          } else {
            window.$notification.success({
              duration: 7000,
              title: i18n.t("commmon.success"),
              content: i18n.t("users.info.user_update_error"),
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
          window.$notification.success({
            duration: 7000,
            title: i18n.t("commmon.success"),
            content: i18n.t("users.info.role_fetch_error"),
          })
        }
      })
    },
  },
})
