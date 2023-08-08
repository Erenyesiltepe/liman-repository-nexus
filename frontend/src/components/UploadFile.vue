<script setup lang="ts">
import type { IUploadedFile } from "@/models/UploadedFile"
import type { UploadCustomRequestOptions } from "naive-ui"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

interface Props {
  accept: string
}
const props = withDefaults(defineProps<Props>(), {
  accept: ".jpg,.png",
})
const fileInformation = ref<IUploadedFile>()
const emits = defineEmits<{
  (e: "uploaded", data: IUploadedFile): void
}>()
const customRequest = ({
  file,
  onFinish,
  onError,
  onProgress,
}: UploadCustomRequestOptions) => {
  window.upload({
    file: file.file,
    onError: onError(),
    onProgress: function (bytesUploaded: number, bytesTotal: number) {
      onProgress({
        percent: (bytesUploaded / bytesTotal) * 100,
      })
    },
    onSuccess: function (upload: any) {
      fileInformation.value = upload.info
      emits("uploaded", upload.info)
      onFinish()
    },
  })
}
</script>

<template>
  <n-upload :max="1" :accept="props.accept" :custom-request="customRequest">
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <n-icon size="48" :depth="3">
          <i class="fa-solid fa-upload"></i>
        </n-icon>
      </div>
      <n-text style="font-size: 16px">
        {{ t("common.upload.header_text") }}
      </n-text>
      <n-p depth="3" style="margin: 8px 0 0 0">
        {{ t("common.upload.sub_text") }}
      </n-p>
    </n-upload-dragger>
  </n-upload>
</template>
