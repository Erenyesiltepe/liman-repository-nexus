//import type { IRepository } from "@/models/Repository"
import { HttpClient } from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"

const http = new HttpClient("nexusProxy")

export const useNexusStore = defineStore({
  id: "nexus",
  state: () => ({
    repositories: [] as any[],
  }),
  getters: {
    getRepositories: (state) => state.repositories,
  },
  actions: {
    async fetchRepositories() {
      return http
        .get(`service/rest/v1/repositories`)
        .then((res) => {
          console.log(res.data)
          if (res.status == 200) {
            this.repositories = res.data
          } else {
            window.$notification.error({
              duration: 7000,
              title: i18n.t("common.error"),
              content: i18n.t("repository.get.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)

          window.$notification.error({
            duration: 7000,
            title: i18n.t("common.error"),
            content: i18n.t("repository.get.messages.error"),
          })
        })
    },
  },
})
