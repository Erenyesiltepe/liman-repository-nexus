import { createRouter, createWebHashHistory } from "vue-router"

// Imports
import Repositories from "@/views/pages/Repositories.vue"
import Sync from "@/views/pages/Sync.vue"
import Keys from "@/views/pages/Keys.vue"
import NexusTest from "@/views/pages/NexusTest.vue"
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
      path: "/sync",
      name: "sync",
      component: Sync,
    },
    {
      path: "/nexus",
      name: "nexus",
      component: NexusTest,
    },
    {
      path: "/keys",
      name: "keys",
      component: Keys,
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
