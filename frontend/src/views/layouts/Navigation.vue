<script setup lang="ts">
import { h, ref, watch } from "vue"
import {
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification,
  type MenuOption,
} from "naive-ui"
import { RouterLink, useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
window.$loadingBar = useLoadingBar()
window.$notification = useNotification()
window.$dialog = useDialog()
window.$message = useMessage()

const server_id = document
  .getElementsByName("server_id")[0]
  .getAttribute("content") as string
const extension_id = document
  .getElementsByName("extension_id")[0]
  .getAttribute("content") as string
const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: "/" }, t("navigation.repositories")),
    icon: () => h("i", { class: "fa-solid fa-database fa-xs" }),
    key: "repositories",
  },
  {
    label: () => h(RouterLink, { to: "/sync" }, t("navigation.sync")),
    icon: () => h("i", { class: "fa-solid fa-repeat fa-xs" }),
    key: "sync",
  },
  {
    label: () => h(RouterLink, { to: "/keys" }, t("navigation.keys")),
    icon: () => h("i", { class: "fa-solid fa-key fa-xs" }),
    key: "keys",
  },
  {
    label: () => h(RouterLink, { to: "/nexus" }, "nexus"),
    icon: () => h("i", { class: "fa-solid fa-key fa-xs" }),
    key: "nexus",
  },
  {
    label: () => h(RouterLink, { to: "/ldap" }, "ldap"),
    icon: () => h("i", { class: "fa-solid fa-key fa-xs" }),
    key: "ldap",
  },
  {
    label: () => h(RouterLink, { to: "/users" }, "users"),
    icon: () => h("i", { class: "fa-solid fa-key fa-xs" }),
    key: "users",
  },
]

const route = useRoute()
const router = useRouter()
const activeKey = ref("")
const emits = defineEmits(["fullscreen"])

watch(
  () => route.name,
  () => {
    activeKey.value = route.name as string
  }
)
</script>

<template>
  <n-layout-header
    bordered
    style="padding: 0 20px; padding-bottom: 120px"
    inverted
  >
    <n-button text @click="router.push({ name: 'dashboard' })">
      <n-h5 style="margin-right: 25px; color: #ffffff">
        {{ t("repo") }}
      </n-h5>
    </n-button>
    <n-menu
      v-model:value="activeKey"
      mode="horizontal"
      :options="menuOptions"
      inverted
    />
    <div
      role="menubar"
      class="n-menu n-menu--horizontal float-right"
      style="
        --n-divider-color: rgb(239, 239, 245);
        --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
        --n-font-size: 15px;
        --n-border-color-horizontal: #0000;
        --n-border-radius: 3px;
        --n-item-height: 50px;
        --n-group-text-color: #aaa;
        --n-color: #0000;
        --n-item-text-color: #bbb;
        --n-item-text-color-hover: #fff;
        --n-item-text-color-active: #fff;
        --n-item-text-color-child-active: #fff;
        --n-item-text-color-child-active-hover: #fff;
        --n-item-text-color-active-hover: #fff;
        --n-item-icon-color: #bbb;
        --n-item-icon-color-hover: #fff;
        --n-item-icon-color-active: #fff;
        --n-item-icon-color-active-hover: #fff;
        --n-item-icon-color-child-active: #fff;
        --n-item-icon-color-child-active-hover: #fff;
        --n-item-icon-color-collapsed: #bbb;
        --n-item-text-color-horizontal: #bbb;
        --n-item-text-color-hover-horizontal: #fff;
        --n-item-text-color-active-horizontal: #fff;
        --n-item-text-color-child-active-horizontal: #fff;
        --n-item-text-color-child-active-hover-horizontal: #fff;
        --n-item-text-color-active-hover-horizontal: #fff;
        --n-item-icon-color-horizontal: #bbb;
        --n-item-icon-color-hover-horizontal: #fff;
        --n-item-icon-color-active-horizontal: #fff;
        --n-item-icon-color-active-hover-horizontal: #fff;
        --n-item-icon-color-child-active-horizontal: #fff;
        --n-item-icon-color-child-active-hover-horizontal: #fff;
        --n-arrow-color: #bbb;
        --n-arrow-color-hover: #fff;
        --n-arrow-color-active: #fff;
        --n-arrow-color-active-hover: #fff;
        --n-arrow-color-child-active: #fff;
        --n-arrow-color-child-active-hover: #fff;
        --n-item-color-hover: #0000;
        --n-item-color-active: #00c0f3ff;
        --n-item-color-active-hover: #00c0f3ff;
        --n-item-color-active-collapsed: #00c0f3ff;
      "
    >
      <div role="menuitem" class="n-menu-item" @click="emits('fullscreen')">
        <div role="none" class="n-menu-item-content">
          <div class="n-menu-item-content-header" role="none">
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
          </div>
        </div>
      </div>
      <div role="menuitem" class="n-menu-item">
        <div role="none" class="n-menu-item-content">
          <div class="n-menu-item-content-header" role="none">
            <a :href="`/ayarlar/${extension_id}/${server_id}`"
              ><i class="fa-solid fa-screwdriver-wrench"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
  </n-layout-header>
</template>
