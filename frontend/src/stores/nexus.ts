import { HttpClient } from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"

const http = new HttpClient("nexusProxy")

export const useNexusStore = defineStore({
  id: "nexus",
  state: () => ({
    repositories: [] as any[],
    blobStores: [] as any[],
    asset: {} as any,
    distribution: {} as any,
  }),
  getters: {
    getRepositories: (state) => state.repositories,
    getBlobstores: (state) => state.blobStores,
    getAsset: (state) => state.asset,
    getDistribution: (state) => state.distribution,
  },
  actions: {
    async fetchDistribution() {
      return http.get(`service/rest/v1/repositories/`).then((res) => {
        if (res.status == 200) {
          const accepted = [
            "apthosted",
            "aptproxy",
            "yumhosted",
            "yumproxy",
            "dockerhosted",
            "dockerproxy",
          ]
          this.distribution = {
            apthosted: 0,
            aptproxy: 0,
            yumhosted: 0,
            yumproxy: 0,
            dockerhosted: 0,
            dockerproxy: 0,
          }
          res.data.forEach((element: any) => {
            const key: string = element.format + element.type
            if (accepted.includes(key)) {
              this.distribution[key]++
            }
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
    async fetchRepositories(format: string, type: string) {
      return http.get(`service/rest/v1/repositorySettings/`).then((res) => {
        if (res.status == 200) {
          this.repositories = []
          for (const item of res.data) {
            if (item.type === type && item.format === format) {
              const newItem = { ...item }
              if (item.format === "docker") {
                newItem.enableAnonstr = item.docker.forceBasicAuth
                  ? "false"
                  : "true"
                newItem.docker.forceBasicAuth = !item.docker.forceBasicAuth
                newItem.pushUrl =
                  item.url.split("/")[2].split(":")[0] +
                  ":" +
                  item.docker.httpPort +
                  "/" +
                  item.name
              }
              this.repositories.push(newItem)
            }
          }
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
            this.asset = res.data.items
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
      return http
        .post(`service/rest/v1/repositories/${type}`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status == 200) {
            const filter = type.split("/")
            this.fetchRepositories(filter[0], filter[1])
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
      return http
        .put(`service/rest/v1/repositories/${type}/${data.name}`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status == 200) {
            const filter = type.split("/")
            this.fetchRepositories(filter[0], filter[1])
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
    async deleteRepository(name: string, type: string) {
      return http.delete(`service/rest/v1/repositories/${name}`).then((res) => {
        if (res.status == 200) {
          const filter = type.split("/")
          this.fetchRepositories(filter[0], filter[1])
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
