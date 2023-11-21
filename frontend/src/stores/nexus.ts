import { HttpClient } from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"
import { ref } from "vue"
import { optionTypes } from "@/templates/RepoTemp"

const http = new HttpClient("nexusProxy")

function getConfig(data: any, type: string) {
  const config = ref()
  if (type == "apt/hosted") config.value = optionTypes["apthosted"]
  else if (type == "apt/proxy") config.value = optionTypes["aptproxy"]
  else if (type == "yum/hosted") config.value = optionTypes["yumhosted"]
  else if (type == "yum/proxy") config.value = optionTypes["yumproxy"]
  else if (type == "docker/hosted") config.value = optionTypes["dockerhosted"]
  else config.value = optionTypes["dockerproxy"]

  config.value.name = data.name
  config.value.storage.blobStoreName = data.blobStoreName
  if (type.split("/")[1] == "proxy")
    config.value.proxy.remoteUrl = data.proxy_url
  if (type.split("/")[0] == "docker") {
    config.value.docker.httpPort = data.port
    config.value.docker.forceBasicAuth = !data.enableAnonymus
  }
  return config.value
}

export const useNexusStore = defineStore({
  id: "nexus",
  state: () => ({
    repositories: [] as any[],
    blobStores: [] as any[],
    asset: {} as any,
  }),
  getters: {
    getRepositories: (state) => state.repositories,
    getBlobstores: (state) => state.blobStores,
    getAsset: (state) => state.asset,
  },
  actions: {
    async fetchRepositories(format: string, type: string) {
      return http.get(`service/rest/v1/repositorySettings/`).then((res) => {
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
    async fetchAsset(name: string) {
      return http
        .get(`service/rest/v1/search/assets?repository=${name}`)
        .then((res) => {
          if (res.status == 200) {
            this.asset = res.data
          } else {
            window.$notification.error({
              duration: 7000,
              title: "repository coult not be removed",
              content: "repo could not be removed",
            })
          }
        })
    },
    async createRepository(data: any, type: string) {
      const config = getConfig(data, type)
      return http
        .post(`service/rest/v1/repositories/${type}`, {
          data: JSON.stringify(config),
        })
        .then((res) => {
          if (res.status == 200) {
            this.fetchRepositories("", "")
            window.$notification.success({
              duration: 7000,
              title: "repository successfully created",
              content: "repo successfully created",
            })
          } else {
            window.$notification.error({
              duration: 7000,
              title: "repository coult not be created",
              content: "repo could not be created",
            })
          }
        })
    },
    async updateRepository(data: any, type: string) {
      const config = getConfig(data, type)
      return http
        .put(`service/rest/v1/repositories/${type}/${data.name}`, {
          data: JSON.stringify(config),
        })
        .then((res) => {
          if (res.status == 200) {
            this.fetchRepositories("", "")
            window.$notification.success({
              duration: 7000,
              title: "repository successfully updated",
              content: "repo successfully updated",
            })
          } else {
            window.$notification.error({
              duration: 7000,
              title: "repository coult not be updated",
              content: "repo could not be updated",
            })
          }
        })
    },
    async deleteRepository(name: string) {
      return http.delete(`service/rest/v1/repositories/${name}`).then((res) => {
        if (res.status == 200) {
          this.fetchRepositories("", "")
          window.$notification.success({
            duration: 7000,
            title: "repository successfully removed",
            content: "repo successfully removed",
          })
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
