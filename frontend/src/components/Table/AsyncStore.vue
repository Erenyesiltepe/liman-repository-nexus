<script setup lang="ts">
import ColumnSelector from "@/components/Table/ColumnSelector.vue"
import type { IData } from "@/models/Data"
import type { IFilter } from "@/models/Filter"
import type { IPaginator } from "@/models/Paginator"
import { format } from "date-fns"
import { enUS, tr } from "date-fns/locale"
import { NButton, NButtonGroup, NDataTable, NInput, NSpace } from "naive-ui"
import { computed, h, onMounted, reactive, ref, toRefs, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

export interface Props {
  dispatcher: (payload?: IFilter) => Promise<any>
  data: IPaginator<any>
  columns: any[]
  pageSize?: number
  title?: string
  filter?: any
  showTimePicker?: boolean
  selected?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 15,
  title: "",
  showTimePicker: false,
})

const { t } = useI18n()

const loading = ref(true)
const search = ref("")
const filters = ref([] as IData[])
const sort = ref("")
const daterange = ref<number[]>([])
const route = useRoute()

if (props.showTimePicker) {
  daterange.value = [
    (new Date() as unknown as number) - 1000 * 60 * 60 * 24 * 7,
    new Date() as unknown as number,
  ]
}

const escapeSelector = (s: string) => {
  return s.replace(/(:|\.|\[|\])/g, "\\$1")
}

const { columns, pageSize } = toRefs(props)

columns.value.forEach((column, i) => {
  column.show = true
  if (column.type === "time") {
    column.width = 210

    column.render = (row: any) => {
      return format(Date.parse(row.updated_at), "dd MMMM yyyy HH:mm", {
        locale: document.documentElement.lang == "tr" ? tr : enUS,
      })
    }
  }

  if (column.filterable) {
    column = {
      ...column,
      filterOptionValue: null,
      filter: () => true,
      renderFilterMenu: ({ hide }: { hide: any }) => {
        return h(NSpace, { style: { padding: "12px" }, vertical: true }, [
          h(NInput, {
            placeholder: t("table.filter.placeholder"),
            id: column.key + "-filter",
            defaultValue: column.filterOptionValue,
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
                  const filterInput: any = document.querySelector(
                    "#" + escapeSelector(column.key) + "-filter input"
                  )
                  filterInput.value = ""
                  columns.value[i].filterOptionValue = null
                  filters.value = filters.value.filter((item: IData) => {
                    return item.key != column.key
                  })

                  query().then(() => hide())
                },
                style: "font-size: 12px",
                innerHTML: t("table.filter.clear"),
              }),
              h(NButton, {
                size: "small",
                type: "success",
                "on-click": () => {
                  const filterInput: any = document.querySelector(
                    "#" + escapeSelector(column.key) + "-filter input"
                  )

                  if (filterInput.value.length > 0) {
                    columns.value[i].filterOptionValue = filterInput.value
                    filters.value = filters.value.filter((item: IData) => {
                      return item.key != column.key
                    })
                    filters.value.push({
                      key: column.key,
                      value: filterInput.value,
                    })

                    query().then(() => hide())
                  } else {
                    columns.value[i].filterOptionValue = null
                    filterInput.value = null

                    hide()
                  }
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

  if (column.defaultFilterOptionValues) {
    filters.value.push({
      key: column.key,
      value: column.defaultFilterOptionValues,
    })
  }

  columns.value[i] = column
})
const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: pageSize.value,
  itemCount: 0,
  prefix({ itemCount }: any) {
    return `Total: ${itemCount}`
  },
})

onMounted(() => {
  query(pagination.page)
})

const createDebounce = () => {
  let timeout: number | undefined = 0
  return function (fnc: () => void, delayMs: any) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fnc()
    }, delayMs || 500)
  }
}
const searchDebounce = createDebounce()

const handleSorterChange = (sorter: any) => {
  sort.value = sorter
  if (sorter.order == false) {
    sort.value = ""
  } else {
    switch (sorter.order) {
      case "descend":
        sort.value = `-${sorter.columnKey}`
        break
      case "ascend":
        sort.value = `+${sorter.columnKey}`
        break
      default:
        sort.value = ""
        break
    }
  }
  query()
}

const handleSearch = () => {
  query()
}

const handlePageChange = (currentPage: any) => {
  query(currentPage)
}

const handleFilterChange = (filters: any) => {
  loading.value = true
  Object.keys(filters).forEach((item) => {
    filters.value = filters.value.filter((i: IData) => {
      return i.key != item
    })
    if (filters[item] && filters[item].length > 0) {
      filters.value.push({
        key: item,
        value: filters[item],
      })
    }
  })
  query()
}

function query(page = 1) {
  loading.value = true
  const obj = { page: page, per_page: props.pageSize } as IFilter
  if (search.value != "") {
    obj.search = search.value
  }

  filters.value.forEach((item: any) => {
    if (item.type == "query") {
      // Clear specified filter
      filters.value = filters.value.filter((i: IData) => {
        return i.key != item.key
      })
    }
  })

  if (props.filter && props.filter()) {
    filters.value.push(...props.filter())
  }

  if (filters.value.length > 0) {
    obj.filter = JSON.stringify(filters.value)
  }

  if (daterange.value.length > 0) {
    obj.date = JSON.stringify([
      Number(((daterange.value[0] as unknown as number) / 1000).toFixed(0)),
      Number(((daterange.value[1] as unknown as number) / 1000).toFixed(0)),
    ])
  }

  if (sort.value != "") {
    obj.sort = sort.value
  }

  return props.dispatcher(obj).then(() => {
    loading.value = false
  })
}

watch(
  () => props.data,
  () => {
    pagination.page = props.data.current_page
    pagination.pageCount = props.data.total_pages
    pagination.itemCount = props.data.total_records
  }
)

watch(
  () => daterange.value,
  () => {
    query()
  }
)

const refresh = () => {
  if (props.showTimePicker) {
    daterange.value[1] = Number(new Date())
  }

  query()
}

watch(
  () => route.query,
  () => {
    query()
  }
)

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
</script>

<template>
  <h5 class="text-muted text-uppercase mb-4" v-if="showTimePicker">
    {{ props.title }}
  </h5>
  <n-space
    justify="space-between"
    style="margin-bottom: 15px; align-items: center"
  >
    <template v-if="showTimePicker">
      <n-date-picker
        v-model:value="daterange"
        type="datetimerange"
        v-if="showTimePicker"
      />
    </template>
    <template v-else>
      <h5 class="text-muted text-uppercase">
        {{ props.title }}
      </h5>
    </template>

    <div class="table-right-side">
      <n-space class="items-center">
        <slot name="buttons"></slot>

        <n-input
          v-model:value="search"
          @input="
            searchDebounce(() => {
              handleSearch()
            }, 1000)
          "
        >
          <template #prefix>
            <i class="fas fa-search" style="color: #dedede"></i>
          </template>
        </n-input>

        <n-button ghost @click="refresh()"
          ><i class="fa-solid fa-sync fa-fw"></i
        ></n-button>

        <ColumnSelector :columns="columns" @change="columns = $event" />
      </n-space>
    </div>
  </n-space>
  <n-data-table
    :row-key="(rowData: IData) => rowData.id"
    remote
    ref="table"
    :columns="columns"
    :data="props.data.records"
    :loading="loading"
    :pagination="pagination"
    @update:sorter="handleSorterChange"
    @update:page="handlePageChange"
    @update:filters="handleFilterChange"
    :single-line="false"
    striped
    size="small"
    v-model:checked-row-keys="selectedKeys"
  />
</template>
