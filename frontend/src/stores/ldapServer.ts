import { HttpClient } from "@/utils/http-common"
import { defineStore } from "pinia"
import { ref } from "vue"
import { i18n } from "@/utils/i18n"

const http = new HttpClient("nexusProxy")

export const useLdapServerStore = defineStore({
  id: "ldap",
  state: () => ({
    ldapOn: false as boolean,
    servers: [] as any[],
  }),
  getters: {
    getLdapOn: (state) => state.ldapOn,
    getServers: (state) => state.servers,
  },
  actions: {
    async fetchLdapOn() {
      return http.get(`service/rest/v1/security/realms/active`).then((res) => {
        if (res.status == 200) {
          this.ldapOn = false
          for (const elem of res.data) {
            if (elem === "LdapRealm") {
              this.ldapOn = true
              break
            }
          }
        } else {
          window.$notification.error({
            duration: 7000,
            title: i18n.t("common.error"),
            content: i18n.t("ldap_server.errors.fetch_active"),
          })
        }
      })
    },
    async setLdapOn(active: boolean) {
      const data = ref(["NexusAuthenticatingRealm", "DockerToken"])
      if (active) data.value.push("LdapRealm")
      return http
        .put(`service/rest/v1/security/realms/active`, {
          data: JSON.stringify(data.value),
        })
        .then((res) => {
          if (res.status == 200) {
            this.ldapOn = active
          } else {
            window.$notification.error({
              duration: 7000,
              title: i18n.t("common.error"),
              content: i18n.t("ldap_server.errors.fetch_active"),
            })
          }
        })
    },
    async fetchServers() {
      return http.get(`service/rest/v1/security/ldap`).then((res) => {
        if (res.status == 200) {
          this.servers = res.data
        } else {
          window.$notification.error({
            duration: 7000,
            title: i18n.t("common.error"),
            content: i18n.t("ldap_server.errors.fetch_servers"),
          })
        }
      })
    },
    async createServer(data: any) {
      return http
        .post(`service/rest/v1/security/ldap`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status == 200) {
            this.fetchServers()
          } else {
            window.$notification.error({
              duration: 7000,
              title: i18n.t("common.error"),
              content: i18n.t("ldap_server.errors.server_create"),
            })
          }
        })
    },
    async updateServer(data: any) {
      return http
        .put(`service/rest/v1/security/ldap/${data.name}`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status == 200) {
            this.fetchServers()
          } else {
            window.$notification.error({
              duration: 7000,
              title: i18n.t("common.error"),
              content: i18n.t("ldap_server.errors.server_update"),
            })
          }
        })
    },
  },
})
