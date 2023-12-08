<script setup lang="ts">
import useEmitter from "@/utils/emitter"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const emitter = useEmitter()
const ldata = ref()
const show = ref()

emitter.on("showSettingModal", (data: any) => {
  ldata.value = data
  show.value = true
})
</script>
<template>
  <n-modal v-model:show="show">
    <n-card style="width: fit-content">
      <n-table>
        <tr>
          <th>{{ t("setting.attribute") }}</th>
          <th>{{ t("setting.value") }}</th>
        </tr>
        <tr v-for="(value, attr) in ldata" :key="attr">
          <td>{{ attr }}</td>
          <td>{{ value }}</td>
        </tr>
      </n-table>
    </n-card>
  </n-modal>
</template>
