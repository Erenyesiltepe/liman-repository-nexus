<script setup lang="ts">
import Asset from "@/views/modals/Asset.vue"
const props = defineProps(["data"])
</script>
<template>
  <n-card>
    <n-table v-if="props.data.format != 'docker'">
      <tr>
        <th>Attribute</th>
        <th>Value</th>
      </tr>
      <tr v-for="(value, attr) in props.data" :key="attr">
        <td>{{ attr }}</td>
        <td>{{ value }}</td>
      </tr>
    </n-table>
    <n-tabs
      v-else
      class="card-tabs"
      default-value="signin"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
    >
      <n-tab-pane name="settings" tab="Settings">
        <n-table>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
          <tr v-for="(value, attr) in props.data" :key="attr">
            <td>{{ attr }}</td>
            <td>{{ value }}</td>
          </tr>
        </n-table>
      </n-tab-pane>
      <n-tab-pane name="uploaded" tab="Uploaded Repos">
        <Asset :name="props.data.name" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
