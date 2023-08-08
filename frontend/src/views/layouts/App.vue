<script setup lang="ts">
import { RouterView } from "vue-router"
import AppProvider from "./AppProvider.vue"
import Navigation from "./Navigation.vue"
import { useGlobalStore } from "@/stores/global"
import { onBeforeMount, ref } from "vue"
import VErrorBoundary from "vue-error-boundary"
import Errors from "./Errors.vue"

const store = useGlobalStore()
const status = window.$user_status()

onBeforeMount(() => {
  if (localStorage.getItem("fullscreen") == "true") {
    // eslint-disable-next-line no-undef
    $("body").toggleClass("overflow_hidden")
    store.toggleFullscreen()
  }
})

const toggleFullscreen = () => {
  localStorage.setItem("fullscreen", String(!store.getFullscreen))
  store.toggleFullscreen()
  // eslint-disable-next-line no-undef
  $("body").toggleClass("overflow_hidden")
}

const err = ref()
const stack = ref()
const errorCapture = (error: any) => {
  err.value = error.error.toString()
  stack.value = error.error.stack as string
}
</script>

<template>
  <div :class="{ full_screen: store.getFullscreen }">
    <AppProvider>
      <Navigation
        v-bind:style="status !== '1' ? { 'margin-top': '-24px' } : {}"
        @fullscreen="toggleFullscreen"
      />
      <RouterView v-slot="{ Component }">
        <Transition v-auto-animate>
          <div style="padding: 20px; width: 100%; margin-top: -142px">
            <VErrorBoundary stop-propagation @error-captured="errorCapture">
              <template #boundary="{ hasError }">
                <div v-if="hasError">
                  <Errors :error="err" :stack="stack" />
                </div>
                <template v-else>
                  <component :is="Component" />
                </template>
              </template>
            </VErrorBoundary>
          </div>
        </Transition>
      </RouterView>
    </AppProvider>
  </div>
</template>

<style>
.overflow_hidden {
  overflow: hidden !important;
}

.full_screen {
  width: 100%;
  position: fixed;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1040;
  background: #ffffff;
  overflow-y: scroll;
}

.full_screen .container-fluid {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
