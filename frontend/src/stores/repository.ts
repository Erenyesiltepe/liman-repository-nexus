import type { IPaginator } from "@/models/Paginator"
import type { IFilter } from "@/models/Filter"
import type { ISync } from "@/models/Sync"
import type { IPackage } from "@/models/Repository"
import http from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"

export const useRepositoryStore = defineStore({
  id: "repository",
  state: () => ({
    filter: {} as IFilter,
    repositories: {} as IPaginator<ISync>,
    client_url: "",
    packages: [] as IPackage[],
  }),
  getters: {
    get: (state) => state.repositories,
    getClientUrl: (state) => state.client_url,
    getPackages: (state) => state.packages,
  },
  actions: {
    async fetch(payload: IFilter = {} as IFilter) {
      let q = payload
      if (Object.keys(payload).length < 1) {
        q = this.filter
      } else {
        this.filter = q
      }
      const query = new URLSearchParams(q as Record<string, string>).toString()
      return http
        .get(`repositories/?${query}`)
        .then((res) => {
          if (res.status == 200) {
            this.repositories = res.data
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("repository.get.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("repository.get.messages.error"),
          })
        })
    },
    async update(data: any, id: string) {
      return http
        .patch(`repositories/${id}`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status === 200) {
            window.$notification.success({
              duration: 3000,
              title: i18n.t("common.success"),
              content: i18n.t("repository.update.messages.success"),
            })
            this.fetch()
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("repository.update.messages.error"),
            })
          }
        })
    },
    async create(data: any) {
      return http
        .post(`repositories`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status === 200) {
            window.$notification.success({
              duration: 3000,
              title: i18n.t("common.success"),
              content: i18n.t("repository.create.messages.success"),
            })
            this.fetch()
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("repository.create.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("repository.create.messages.error"),
          })
        })
    },
    async toggle(id: string) {
      return http.post(`repositories/toggle/${id}`).then((res) => {
        if (res.status === 200) {
          window.$notification.success({
            duration: 3000,
            title: i18n.t("common.success"),
            content: i18n.t("repository.update.messages.success"),
          })
          this.fetch()
        } else {
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: res.data.message,
          })
        }
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
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("repository.get_client_url.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("repository.get_client_url.messages.error"),
          })
        })
    },
    async fetchPackages(id: string) {
      return http
        .get(`repositories/packages/${id}`)
        .then((res) => {
          if (res.status == 200) {
            this.packages = res.data
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("repository.get_packages.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("repository.get_packages.messages.error"),
          })
        })
    },
    async delete(id: number) {
      window.$dialog.warning({
        title: i18n.t("common.warning"),
        content: i18n.t("common.are_you_sure"),
        positiveText: i18n.t("common.yes"),
        negativeText: i18n.t("common.no"),
        onPositiveClick: () => {
          return http.delete(`repositories/${id}`).then((res) => {
            if (res.status == 200) {
              window.$notification.success({
                title: i18n.t("common.success"),
                content: i18n.t("repository.delete.messages.success"),
                duration: 3000,
              })
              this.fetch()
            } else {
              window.$notification.error({
                duration: 4000,
                title: i18n.t("common.error"),
                content: i18n.t("repository.delete.messages.error"),
              })
            }
          })
        },
      })
    },
  },
})
