import { createRouter, createWebHashHistory } from "vue-router"

// Imports
import Repositories from "@/views/pages/Repositories.vue"
import Errors from "@/views/layouts/Errors.vue"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "repositories",
      component: Repositories,
    },

    {
      path: "/error",
      name: "error",
      component: Errors,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
})

export default router
