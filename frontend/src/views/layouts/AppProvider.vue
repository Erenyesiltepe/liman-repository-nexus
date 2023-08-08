<script setup lang="ts">
import type { GlobalThemeOverrides } from "naive-ui"
import { locale, date } from "@/localization/provider/liman"

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#00c0f3FF",
    primaryColorHover: "#0eccffFF",
    primaryColorPressed: "#0098c0FF",
    primaryColorSuppl: "#00acdaFF",
    invertedColor: "rgba(26, 32, 44, 1)",
    borderRadius: "6px",
    borderRadiusSmall: "4px",
    scrollbarBorderRadius: "8px",
    boxShadow1: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    boxShadow2: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    textColorBase: "#1a202cFF"
  },
  Menu: {
    itemHeight: "50px"
  },
  DataTable: {
    thFontWeight: "600"
  },
  Notification: {
    descriptionFontSize: "8px !important"
  }
}
</script>

<template>
  <n-config-provider
    :locale="locale"
    :date-locale="date"
    :theme-overrides="themeOverrides"
  >
    <n-global-style />
    <n-loading-bar-provider>
      <n-notification-provider placement="bottom-right" :max="1">
        <n-message-provider>
          <n-dialog-provider>
            <slot></slot>
          </n-dialog-provider>
        </n-message-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
