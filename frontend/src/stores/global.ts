import { defineStore } from "pinia"

export const useGlobalStore = defineStore({
  id: "global",
  state: () => ({
    fullscreen: false,
  }),
  getters: {
    getFullscreen: (state) => state.fullscreen,
  },
  actions: {
    async toggleFullscreen() {
      this.fullscreen = !this.fullscreen
    },
  },
})
