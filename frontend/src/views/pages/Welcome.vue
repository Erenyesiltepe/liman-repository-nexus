<script setup lang="ts">
import { useDbStore } from "@/stores/serverDb"
import { ref } from "vue"
const data = ref()
data.value = { username: " ", password: " " }
const store = useDbStore()
store.fetchUser().then(() => {
  console.log("fetched")
})

function insert() {
  store.insertUser(data.value).then(() => {
    store.fetchUser()
  })
}
</script>
<template>
  <n-card> Welcome to repository manager </n-card>
  <n-form>
    <n-form-item label="uname">
      <n-input v-model:value="data.username"></n-input>
    </n-form-item>
    <n-form-item label="pass">
      <n-input v-model:value="data.password" />
    </n-form-item>
    <n-button @click="insert">submit</n-button>
  </n-form>
  <div>{{ store.getUser }}</div>
</template>
