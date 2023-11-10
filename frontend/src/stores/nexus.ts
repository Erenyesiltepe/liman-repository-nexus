//import type { IRepository } from "@/models/Repository"
import { HttpClient } from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"
import { ref } from "vue"
import { optionTypes } from "@/templates/RepoTemp"

const http = new HttpClient("nexusProxy")

export const useNexusStore = defineStore({
  id: "nexus",
  state: () => ({
    repositories: [] as any[],
    blobStores: [] as any[],
  }),
  getters: {
    getRepositories: (state) => state.repositories,
    getBlobstores: (state) => state.blobStores,
  },
  actions: {
    async fetchRepositories(format: string, type: string) {
      return http.get(`service/rest/v1/repositories/`).then((res) => {
        if (res.status == 200) {
          this.repositories =
            format == ""
              ? res.data
              : res.data.filter((item: { type: string; format: string }) => {
                  return item.type == type && item.format == format
                })
        } else {
          window.$notification.error({
            duration: 7000,
            title: i18n.t("common.error"),
            content: i18n.t("repository.get.messages.error"),
          })
        }
      })
    },
    async fetchBlobstores() {
      return http.get(`service/rest/v1/blobstores/`).then((res) => {
        console.log(res)
        if (res.status == 200) {
          this.blobStores = res.data.map((element: any) => {
            return { label: element.name, key: element.name }
          })
        } else {
          window.$notification.error({
            duration: 7000,
            title: "blob fetch error",
            content: "blob fetch error",
          })
        }
      })
    },
    async createRepository(data: any, type: string) {
      const config = ref()
      if (type == "apt/hosted") config.value = optionTypes["apthosted"]
      else if (type == "apt/proxy") config.value = optionTypes["aptproxy"]
      else if (type == "yum/hosted") config.value = optionTypes["yumhosted"]
      else if (type == "yum/proxy") config.value = optionTypes["yumproxy"]
      else if (type == "docker/hosted")
        config.value = optionTypes["dockerhosted"]
      else config.value = optionTypes["dockerproxy"]

      config.value.name = data.name
      config.value.storage.blobStoreName = data.blobStoreName
      if (type.split("/")[1] == "proxy")
        config.value.proxy.remoteUrl = data.proxy_url
      if (type.split("/")[0] == "docker") {
        config.value.docker.httpPort = data.port
      }

      return http
        .post(`service/rest/v1/repositories/${type}`, {
          data: JSON.stringify(config.value),
        })
        .then((res) => {
          console.log(res.data)
          if (res.status == 200) {
            this.fetchRepositories("", "")
          } else {
            window.$notification.error({
              duration: 7000,
              title: "repository coult not be created",
              content: "repo could not be created",
            })
          }
        })
    },
    async deleteRepository(name: string) {
      return http.delete(`service/rest/v1/repositories/${name}`).then((res) => {
        console.log(res.data)
        if (res.status == 200) {
          this.fetchRepositories("", "")
        } else {
          window.$notification.error({
            duration: 7000,
            title: "repository coult not be removed",
            content: "repo could not be removed",
          })
        }
      })
    },
  },
})
