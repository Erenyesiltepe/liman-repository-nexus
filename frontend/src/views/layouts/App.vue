<script setup lang="ts">
import { ref } from "vue"
import VErrorBoundary from "vue-error-boundary"
import { RouterView } from "vue-router"
import AppProvider from "./AppProvider.vue"
import Errors from "./Errors.vue"
import Navigation from "./Navigation.vue"

const err = ref()
const stack = ref()
const errorCapture = (error: any) => {
  err.value = error.error.toString()
  stack.value = error.error.stack as string
}
</script>

<template>
  <AppProvider>
    <RouterView v-slot="{ Component }">
      <div style="padding: 30px; width: 100%">
        <VErrorBoundary stop-propagation @error-captured="errorCapture">
          <template #boundary="{ hasError }">
            <div v-if="hasError">
              <Errors :error="err" :stack="stack" />
            </div>
            <template v-else>
              <Navigation />
              <component :is="Component" />
            </template>
          </template>
        </VErrorBoundary>
      </div>
    </RouterView>
  </AppProvider>
</template>
