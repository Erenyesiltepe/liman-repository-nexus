import { createRouter, createWebHashHistory } from "vue-router"

import NexusTest from "@/views/pages/NexusTest.vue"
import LdapServers from "@/views/pages/LdapServers.vue"
import Welcome from "@/views/pages/Welcome.vue"
import Users from "@/views/pages/Users.vue"
import Errors from "@/views/layouts/Errors.vue"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/nexus/:tab",
      name: "nexus",
      component: NexusTest,
    },
    {
      path: "/ldap",
      name: "ldap",
      component: LdapServers,
    },
    {
      path: "/welcome",
      name: "welcome",
      component: Welcome,
    },
    {
      path: "/users",
      name: "users",
      component: Users,
    },
    {
      path: "/error",
      name: "error",
      component: Errors,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/welcome",
    },
  ],
})

export default router
