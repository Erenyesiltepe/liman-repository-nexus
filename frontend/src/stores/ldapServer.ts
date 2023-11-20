import { HttpClient } from "@/utils/http-common"
import { defineStore } from "pinia"
import { ref } from "vue"

const http = new HttpClient("nexusProxy")

export const useLdapServerStore = defineStore({
  id: "ldap",
  state: () => ({
    ldapOn: false as boolean,
    servers: [] as any[],
  }),
  getters: {
    getLdapOn: (state) => state.ldapOn, //get update
    getServers: (state) => state.servers, //get create update
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
            title: "ldap on fetch error",
            content: "ldap on fetch error",
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
              title: "ldap on set error",
              content: "ldap on set error",
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
            title: "server fetch error",
            content: "server fetch error",
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
              title: "server crate error",
              content: "server create error",
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
              title: "server update error",
              content: "server update error",
            })
          }
        })
    },
  },
})
