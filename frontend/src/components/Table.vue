<!-- <script setup lang="ts">
import ColumnSelector from "@/components/Table/ColumnSelector.vue"
import { h, reactive, ref, toRefs, computed } from "vue"
import { NButton, NButtonGroup, NInput, NSpace } from "naive-ui"
import type { IData } from "@/models/Data"
import { useI18n } from "vue-i18n"
import { format, getUnixTime } from "date-fns"
import { tr, enUS } from "date-fns/locale"

export interface Props {
  columns: any[]
  data: IData[]
  loading: boolean
  pageSize?: number
  title?: string
  searchable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 15,
  title: "",
  searchable: true,
})

const { t } = useI18n()
const { columns, data, pageSize } = toRefs(props)

const pagination = reactive({
  page: 1,
  pageSize: pageSize.value,
  showSizePicker: true,
  pageSizes: [...Array(15).keys()].map((i) => i * 5 + pageSize.value),
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})

// Column filter handler
columns.value.forEach((_, i) => {
  const column = ref(columns.value[i])

  column.value = {
    ...column.value,
    show: true,
  }

  if (column.value.type == "unix_time") {
    column.value = {
      ...column.value,
      sorter: (row1: any, row2: any) => {
        return (
          getUnixTime(new Date(row1[column.value.key])) -
          getUnixTime(new Date(row2[column.value.key]))
        )
      },
      render(row: any) {
        return format(
          new Date(row[column.value.key] * 1000),
          "dd MMMM yyyy HH:mm",
          {
            locale: document.documentElement.lang == "tr" ? tr : enUS,
          }
        )
      },
    }
  }

  if (column.value.type == "iso_time") {
    column.value = {
      ...column.value,
      sorter: (row1: any, row2: any) => {
        return (
          Date.parse(row1[column.value.key]) -
          Date.parse(row2[column.value.key])
        )
      },
      render(row: any) {
        return format(Date.parse(row[column.value.key]), "dd MMMM yyyy HH:mm", {
          locale: document.documentElement.lang == "tr" ? tr : enUS,
        })
      },
    }
  }

  if (column.value.key == "actions") {
    column.value = {
      ...column.value,
      className: "text-right",
    }
  }

  if (column.value.filterable) {
    column.value = {
      ...column.value,
      filterOptionValue: null,
      filter(value: any, row: any) {
        if (row[column.value.key]) {
          return !!~row[column.value.key]
            .toString()
            .toLowerCase()
            .indexOf(value.toString().toLowerCase())
        }
        return false
      },
      renderFilterMenu: ({ hide }: { hide: any }) => {
        return h(NSpace, { style: { padding: "12px" }, vertical: true }, [
          h(NInput, {
            placeholder: t("table.filter.placeholder"),
            id: column.value.key + "-filter",
            defaultValue: column.value.filterOptionValue,
            maxlength: 60,
            showCount: true,
          }),
          h(
            NButtonGroup,
            {
              style: "float: right",
            },
            [
              h(NButton, {
                size: "small",
                type: "tertiary",
                "on-click": () => {
                  const filter: any = document.querySelector(
                    "#" + column.value.key + "-filter input"
                  )
                  filter.value = ""
                  column.value.filterOptionValue = null
                  hide()
                },
                style: "font-size: 12px",
                innerHTML: t("table.filter.clear"),
              }),
              h(NButton, {
                size: "small",
                type: "success",
                "on-click": () => {
                  const filter: any = document.querySelector(
                    "#" + column.value.key + "-filter input"
                  )

                  if (filter.value.length > 0) {
                    column.value.filterOptionValue = filter.value
                  } else {
                    column.value.filterOptionValue = null
                  }
                  hide()
                },
                style: "font-size: 12px",
                innerHTML: t("table.filter.apply"),
              }),
            ]
          ),
        ])
      },
    }
  }

  columns.value[i] = column.value
})

// Table search handler
const search = ref("")
const tableData = computed<IData[]>(() => {
  if (search.value.length <= 0) {
    return data.value
  }
  return data.value.filter((row: any) => {
    for (const column of columns.value) {
      if (
        row[column.key] &&
        row[column.key]
          .toString()
          .toLowerCase()
          .indexOf(search.value.toString().toLowerCase()) > -1
      ) {
        return true
      }
    }
    return false
  })
})
</script>

<template>
  <n-space
    justify="space-between"
    style="margin-bottom: 15px; align-items: center"
  >
    <h5 class="text-muted text-uppercase">
      {{ props.title }}
    </h5>
    <div class="table-left-side"></div>
    <div class="table-right-side">
      <n-space>
        <slot name="buttons"></slot>
        <template v-if="props.searchable">
          <n-input
            v-model:value="search"
            :placeholder="t('table.search.placeholder')"
          >
            <template #prefix>
              <i class="fas fa-search" style="color: #dedede"></i>
            </template>
          </n-input>
          <ColumnSelector :columns="columns" @change="columns = $event" />
        </template>
      </n-space>
    </div>
  </n-space>

  <n-data-table
    :row-key="(rowData: IData) => rowData.name"
    :columns="columns"
    :data="tableData"
    :loading="props.loading"
    :pagination="pagination"
    :single-line="false"
    size="small"
  />
</template>
 -->

<script setup lang="ts">
import { h, reactive, ref, toRefs, computed } from "vue"
import { NButton, NButtonGroup, NInput, NSpace } from "naive-ui"
import type { IData } from "@/models/Data"
import { i18n } from "@/utils/i18n"
import { format, getUnixTime } from "date-fns"
import { tr, enUS } from "date-fns/locale"

const props = withDefaults(
  defineProps<{
    columns: any[]
    data: IData[]
    loading?: boolean
    pageSize?: number
    size: string
    selected?: any[]
    rowKey?: string
  }>(),
  {
    pageSize: 15,
    loading: false,
    size: "medium",
    rowKey: "id",
  }
)

const pagination = reactive({
  page: 1,
  pageSize: props.pageSize,
  showSizePicker: true,
  pageSizes: [...Array(5).keys()].map((i) => i * 5 + props.pageSize),
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})

const { columns, data } = toRefs(props)

// Column filter handler
columns.value.forEach((_, i) => {
  const column = ref(columns.value[i])

  column.value = {
    ...column.value,
    show: true,
  }

  if (column.value.key == "created_at") {
    column.value = {
      ...column.value,
      sorter: (row1: any, row2: any) => {
        return (
          getUnixTime(new Date(row1.created_at)) -
          getUnixTime(new Date(row2.created_at))
        )
      },
      render(row: any) {
        return format(new Date(row.created_at), "dd MMMM yyyy HH:mm", {
          locale: document.documentElement.lang == "tr" ? tr : enUS,
        })
      },
    }
  }

  if (column.value.key == "updated_at") {
    column.value = {
      ...column.value,
      sorter: (row1: any, row2: any) => {
        return (
          getUnixTime(new Date(row1.updated_at)) -
          getUnixTime(new Date(row2.updated_at))
        )
      },
      render(row: any) {
        return format(new Date(row.updated_at), "dd MMMM yyyy HH:mm", {
          locale: document.documentElement.lang == "tr" ? tr : enUS,
        })
      },
    }
  }

  if (column.value.key == "actions") {
    column.value = {
      ...column.value,
      className: "text-right",
    }
  }

  if (column.value.filterable) {
    column.value = {
      ...column.value,
      filterOptionValue: null,
      filter(value: any, row: any) {
        if (row[column.value.key]) {
          return !!~row[column.value.key]
            .toString()
            .toLowerCase()
            .indexOf(value.toString().toLowerCase())
        }
        return false
      },
      renderFilterMenu: ({ hide }: { hide: any }) => {
        return h(NSpace, { style: { padding: "12px" }, vertical: true }, [
          h(NInput, {
            placeholder: i18n.t("table.filter.placeholder"),
            id: column.value.key + "-filter",
            defaultValue: column.value.filterOptionValue,
          }),
          h(
            NButtonGroup,
            {
              style: "float: right",
            },
            [
              h(NButton, {
                size: "small",
                type: "tertiary",
                "on-click": () => {
                  const filter: any = document.querySelector(
                    "#" + column.value.key + "-filter input"
                  )
                  filter.value = ""
                  column.value.filterOptionValue = null
                  hide()
                },
                style: "font-size: 12px",
                innerHTML: i18n.t("table.filter.clear"),
              }),
              h(NButton, {
                size: "small",
                type: "success",
                "on-click": () => {
                  const filter: any = document.querySelector(
                    "#" + column.value.key + "-filter input"
                  )

                  if (filter.value.length > 0) {
                    column.value.filterOptionValue = filter.value
                  } else {
                    column.value.filterOptionValue = null
                  }
                  hide()
                },
                style: "font-size: 12px",
                innerHTML: i18n.t("table.filter.apply"),
              }),
            ]
          ),
        ])
      },
    }
  }

  columns.value[i] = column.value
})
const emit = defineEmits<{
  (event: "update:selected", ...args: any[]): void
}>()

const selectedKeys = computed({
  get() {
    return props.selected
  },
  set(value) {
    emit("update:selected", value)
  },
})
// Table search handler
const search = ref("")
const tableData = computed<IData[]>(() => {
  if (search.value.length <= 0) {
    return data.value
  }
  return data.value.filter((row: any) => {
    for (const column of columns.value) {
      if (
        row[column.key] &&
        row[column.key]
          .toString()
          .toLowerCase()
          .indexOf(search.value.toString().toLowerCase()) > -1
      ) {
        return true
      }
    }
    return false
  })
})
</script>

<template>
  <n-space
    justify="space-between"
    style="margin-bottom: 15px; align-items: center"
  >
    <div class="table-left-side"></div>
    <div class="table-right-side">
      <n-space>
        <slot name="buttons"></slot>

        <n-input
          v-model:value="search"
          :placeholder="i18n.t('table.search.placeholder')"
        >
          <template #prefix>
            <i class="fas fa-search" style="color: #dedede"></i>
          </template>
        </n-input>
        <!--<ColumnSelector :columns="columns" @change="columns = $event" />-->
      </n-space>
    </div>
  </n-space>

  <n-data-table
    :bordered="true"
    :single-line="false"
    single-column
    :columns="columns"
    :data="tableData"
    :loading="props.loading"
    :pagination="pagination"
    striped
    :size="props.size"
    v-model:checked-row-keys="selectedKeys"
    :row-key="(rowData: IData) => rowData[`${props.rowKey}`]"
  />
</template>
