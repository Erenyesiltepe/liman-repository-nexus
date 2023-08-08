import type { IData } from "@/models/Data"
import type { IFilter } from "@/models/Filter"
import type { IPaginator } from "@/models/Paginator"
import http from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"

export const useRepositoryStore = defineStore({
  id: "repository",
  state: () => ({
    filter: {} as IFilter,
    alarms: {
      records: [] as IData[],
    } as IPaginator,
  }),
  getters: {
    get: (state) => state.alarms,
    getRecords: (state) => state.alarms.records,
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
        .get(`/service/rest/v1/repositories`)
        .then((res) => {
          if (res.status == 200) {
            this.alarms = res.data
            console.log(res.data)
          } else {
            window.$notification.error({
              duration: 7000,
              title: i18n.t("common.error"),
              content: i18n.t("alarm.get.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)

          window.$notification.error({
            duration: 7000,
            title: i18n.t("common.error"),
            content: i18n.t("alarm.get.messages.error"),
          })
        })
    },
  },
})
