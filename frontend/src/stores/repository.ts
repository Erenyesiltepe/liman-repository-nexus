import type { IRepository } from "@/models/Repository"
import http from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"

export const useRepositoryStore = defineStore({
  id: "repository",
  state: () => ({
    repositories: [] as IRepository[],
    client_url: "",
  }),
  getters: {
    get: (state) => state.repositories,
    getClientUrl: (state) => state.client_url,
  },
  actions: {
    async fetch() {
      return http
        .get(`repositories`)
        .then((res) => {
          if (res.status == 200) {
            this.repositories = res.data
          } else {
            window.$notification.error({
              duration: 4000,
              title: i18n.t("common.error"),
              content: i18n.t("repository.get.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 4000,
            title: i18n.t("common.error"),
            content: i18n.t("repository.get.messages.error"),
          })
        })
    },
    async fetchClientUrl(id: string) {
      return http
        .get(`repositories/client_url/${id}`)
        .then((res) => {
          if (res.status == 200) {
            this.client_url = res.data
          } else {
            window.$notification.error({
              duration: 4000,
              title: i18n.t("common.error"),
              content: i18n.t("repository.get_client_url.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 4000,
            title: i18n.t("common.error"),
            content: i18n.t("repository.get_client_url.messages.error"),
          })
        })
    },
  },
})
