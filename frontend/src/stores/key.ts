import type { IPaginator } from "@/models/Paginator"
import type { IFilter } from "@/models/Filter"
import type { IKey, IKeyCreate } from "@/models/Key"
import http from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"

export const useKeyStore = defineStore({
  id: "key",
  state: () => ({
    filter: {} as IFilter,
    keys: {} as IPaginator<IKey>,
  }),
  getters: {
    get: (state) => state.keys,
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
        .get(`keys/?${query}}`)
        .then((res) => {
          if (res.status == 200) {
            this.keys = res.data
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("key.get.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)

          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("key.get.messages.error"),
          })
        })
    },
    async create(data: IKeyCreate) {
      return http
        .post(`keys`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status === 200) {
            window.$notification.success({
              duration: 3000,
              title: i18n.t("common.success"),
              content: i18n.t("key.create.messages.success"),
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
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("key.create.messages.error"),
          })
        })
    },
    async update(data: IKeyCreate, id: string) {
      return http
        .patch(`keys/${id}`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status === 200) {
            window.$notification.success({
              duration: 3000,
              title: i18n.t("common.success"),
              content: i18n.t("key.update.messages.success"),
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
    async delete(id: string) {
      window.$dialog.warning({
        title: i18n.t("common.warning"),
        content: i18n.t("common.are_you_sure"),
        positiveText: i18n.t("common.yes"),
        negativeText: i18n.t("common.no"),
        onPositiveClick: () => {
          return http
            .delete(`keys/${id}`)
            .then((res) => {
              if (res.status == 200) {
                window.$notification.success({
                  title: i18n.t("common.success"),
                  content: i18n.t("key.delete.messages.success"),
                  duration: 5000,
                })
                this.fetch()
              } else {
                window.$notification.error({
                  duration: 7000,
                  title: i18n.t("common.error"),
                  content: i18n.t("key.delete.messages.error"),
                })
              }
            })
            .catch((err) => {
              console.error(err)

              window.$notification.error({
                duration: 7000,
                title: i18n.t("common.error"),
                content: i18n.t("key.delete.messages.error"),
              })
            })
        },
      })
    },
  },
})
