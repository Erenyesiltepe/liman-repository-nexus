<script setup lang="ts">
import AptHosted from "./repoTypes/AptHosted.vue"
import AptProxy from "./repoTypes/AptProxy.vue"
import DockerHosted from "./repoTypes/DockerHosted.vue"
import DockerProxy from "./repoTypes/DockerProxy.vue"
import YumProxy from "./repoTypes/YumProxy.vue"
import YumHosted from "./repoTypes/YumHosted.vue"
</script>
<template>
  <AptHosted />
  <AptProxy />
  <DockerHosted />
  <DockerProxy />
  <YumProxy />
  <YumHosted />
</template>
