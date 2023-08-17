import type { IPaginator } from "@/models/Paginator"
import type { IFilter } from "@/models/Filter"
import type { IRepository } from "@/models/Repository"
import http from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"

export const useSyncStore = defineStore({
  id: "sync",
  state: () => ({
    filter: {} as IFilter,
    syncs: {} as IPaginator<IRepository>,
  }),
  getters: {
    get: (state) => state.syncs,
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
        .get(`syncs/?${query}}`)
        .then((res) => {
          if (res.status == 200) {
            this.syncs = res.data
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("sync.get.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)

          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("sync.get.messages.error"),
          })
        })
    },
    async create(data: any) {
      return http
        .post(`syncs`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status === 200) {
            window.$notification.success({
              duration: 3000,
              title: i18n.t("common.success"),
              content: i18n.t("sync.create.messages.success"),
            })
            this.fetch()
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("sync.create.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("sync.create.messages.error"),
          })
        })
    },
    async manuelSync(id: string) {
      return http
        .post(`syncs/${id}`)
        .then((res) => {
          if (res.status == 200) {
            window.$notification.success({
              duration: 3000,
              title: i18n.t("common.success"),
              content: i18n.t("sync.manuel.messages.success"),
            })
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("sync.manuel.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("sync.manuel.messages.error"),
          })
        })
    },
  },
})
