import { HttpClient } from "@/utils/http-common"
import { defineStore } from "pinia"

const http = new HttpClient("dbProxy")

export const useDbStore = defineStore({
  id: "user",
  state: () => ({
    user: {},
  }),
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    async fetchUser() {
      return http.get("/").then((res: any) => {
        if (res.status == 200) {
          console.log(res.data)
          this.user = res.data
        } else {
          console.log("mflsdcksşl muhahahahaha")
        }
      })
    },
    async insertUser(data: any) {
      return http
        .insert("/", { data: JSON.stringify(data) })
        .then((res: any) => {
          if (res.status == 200) {
            console.log(res.data)
          } else {
            console.log("mflsdcksşl muhahahahaha")
          }
        })
    },
  },
})
