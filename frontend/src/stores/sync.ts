import type { IPaginator } from "@/models/Paginator"
import type { IFilter } from "@/models/Filter"
import type { IRepository } from "@/models/Repository"
import http from "@/utils/http-common"
import { i18n } from "@/utils/i18n"
import { defineStore } from "pinia"

function findClosestDate(list: any) {
  const closest = ref()
  for (const [i, element] of list.records.entries()) {
    if (element.latest_sync_status == "" && closest.value == undefined) {
      closest.value = element.run_time
    }
    if (
      closest.value != undefined &&
      i != list.length - 1 &&
      element.latest_sync_status == ""
    ) {
      if (element.run_time.localeCompare(closest.value) == -1) {
        closest.value = element.run_time
      }
    }
  }
  return closest.value
}

function findTimeDiff(list: any) {
  const dateStr = findClosestDate(list)
  if (dateStr == undefined) {
    return -1
  } else {
    const [hours, minutes] = dateStr.split(":").map(Number)
    const dateObject = new Date()
    dateObject.setHours(hours)
    dateObject.setMinutes(minutes)
    dateObject.setSeconds(0)
    const targetDate = dateObject.getTime()

    const nowDate = new Date()
    nowDate.setSeconds(0)

    const timeDiff = targetDate - nowDate.getTime()
    console.log("timediff" + timeDiff)
    return timeDiff
  }
}

export const useSyncStore = defineStore({
  id: "sync",
  state: () => ({
    emitter: useEmitter(),
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
            const timediff = findTimeDiff(this.syncs)
            console.log("main" + timediff)
            if (timediff > 0) {
              setTimeout(() => {
                console.log("should be refreshed")
                this.emitter.emit("refresh:page")
              }, timediff + 500)
            }
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
              content: res.data.message,
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
    async update(data: any, id: string) {
      return http
        .patch(`syncs/${id}`, {
          data: JSON.stringify(data),
        })
        .then((res) => {
          if (res.status === 200) {
            window.$notification.success({
              duration: 3000,
              title: i18n.t("common.success"),
              content: i18n.t("sync.update.messages.success"),
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
    async delete(id: number) {
      window.$dialog.warning({
        title: i18n.t("common.warning"),
        content: i18n.t("common.are_you_sure"),
        positiveText: i18n.t("common.yes"),
        negativeText: i18n.t("common.no"),
        onPositiveClick: () => {
          return http
            .delete(`syncs/${id}`)
            .then((res) => {
              if (res.status == 200) {
                window.$notification.success({
                  title: i18n.t("common.success"),
                  content: i18n.t("sync.delete.messages.success"),
                  duration: 5000,
                })
                this.fetch()
              } else {
                window.$notification.error({
                  duration: 7000,
                  title: i18n.t("common.error"),
                  content: i18n.t("sync.delete.messages.error"),
                })
              }
            })
            .catch((err) => {
              console.error(err)

              window.$notification.error({
                duration: 7000,
                title: i18n.t("common.error"),
                content: i18n.t("sync.delete.messages.error"),
              })
            })
        },
      })
    },
    async manualSync(id: string) {
      return http
        .post(`syncs/${id}`)
        .then((res) => {
          if (res.status == 200) {
            window.$notification.success({
              duration: 3000,
              title: i18n.t("common.success"),
              content: i18n.t("sync.manual.messages.success"),
            })
          } else {
            window.$notification.error({
              duration: 3000,
              title: i18n.t("common.error"),
              content: i18n.t("sync.manual.messages.error"),
            })
          }
        })
        .catch((err) => {
          console.error(err)
          window.$notification.error({
            duration: 3000,
            title: i18n.t("common.error"),
            content: i18n.t("sync.manual.messages.error"),
          })
        })
    },
    async stop(id: string) {
      return http.post(`syncs/${id}/stop`).then((res) => {
        if (res.status === 200) {
          window.$notification.success({
            duration: 3000,
            title: i18n.t("common.success"),
            content: i18n.t("sync.stop.messages.success"),
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
  },
})
