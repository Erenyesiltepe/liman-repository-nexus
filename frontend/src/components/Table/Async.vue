<script setup lang="ts">
import { ref, reactive, onMounted, toRefs } from "vue"
import http from "@/utils/http-common"
import { format } from "date-fns"
import { tr, enUS } from "date-fns/locale"
import ColumnSelector from "@/components/Table/ColumnSelector.vue"

export interface Props {
  endpoint: string
  columns: any[]
  pageSize?: number
  title?: string
  filterChangeQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 15,
  title: "",
  filterChangeQuery: "create_method",
})
const { endpoint, columns, pageSize } = toRefs(props)

columns.value.forEach((column) => {
  column.show = true
  if (column.type === "time") {
    column.render = (row: any) => {
      return format(Date.parse(row.updated_at), "dd MMMM yyyy HH:mm", {
        locale: document.documentElement.lang == "tr" ? tr : enUS,
      })
    }
  }
})

const loading = ref(true)
const data = ref([])
const search = ref("")
const filter = ref("")

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
  query(pagination.page, pagination.pageSize).then((e: any) => {
    e.data.forEach((e: any) => {
      e.key = e.id
    })
    data.value = e.data
    pagination.pageCount = e.pageCount
    pagination.itemCount = e.total
    loading.value = false
  })
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
  if (!sorter || sorter.columnKey === "column1") {
    if (!loading.value) {
      loading.value = true
      query(
        pagination.page,
        pagination.pageSize,
        !sorter ? false : sorter.order
      ).then((e: any) => {
        e.data.forEach((e: any) => {
          e.key = e.id
        })
        data.value = e.data
        pagination.pageCount = e.pageCount
        pagination.itemCount = e.total
        loading.value = false
      })
    }
  }
}

const handleFiltersChange = (filters: any) => {
  if (!loading.value) {
    loading.value = true
    filter.value =
      `&${props.filterChangeQuery}=` +
      filters[props.filterChangeQuery].join(",")
    query(
      pagination.page,
      pagination.pageSize,
      search.value,
      filter.value
    ).then((e: any) => {
      e.data.forEach((e: any) => {
        e.key = e.id
      })
      data.value = e.data
      pagination.pageCount = e.pageCount
      pagination.itemCount = e.total
      loading.value = false
    })
  }
}

const handleSearch = () => {
  if (!loading.value) {
    loading.value = true
    query(
      pagination.page,
      pagination.pageSize,
      search.value,
      filter.value
    ).then((e: any) => {
      e.data.forEach((e: any) => {
        e.key = e.id
      })
      data.value = e.data
      pagination.pageCount = e.pageCount
      pagination.itemCount = e.total
      loading.value = false
    })
  }
}

const handlePageChange = (currentPage: any) => {
  if (!loading.value) {
    loading.value = true
    query(currentPage, pagination.pageSize, search.value, filter.value).then(
      (e: any) => {
        e.data.forEach((e: any) => {
          e.key = e.id
        })
        data.value = e.data
        pagination.page = currentPage
        pagination.pageCount = e.pageCount
        pagination.itemCount = e.total
        loading.value = false
      }
    )
  }
}

function query(page: number, pageSize = 15, search = "", filter = "") {
  return new Promise((resolve) => {
    http
      .get(
        `${endpoint.value}?page=${page}&per_page=${pageSize}&search=${search}${filter}`
      )
      .then((response) => {
        const data = response.data
        resolve({
          pageCount: data.total_pages,
          data: data.records,
          total: data.total_records,
        })
      })
  })
}
</script>

<template>
  <n-space justify="space-between" style="margin-bottom: 15px">
    <h5 class="text-muted text-uppercase">
      {{ props.title }}
    </h5>
    <div class="table-left-side"></div>
    <div class="table-right-side">
      <n-space>
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
        <ColumnSelector :columns="columns" @change="columns = $event" />
      </n-space>
    </div>
  </n-space>
  <n-data-table
    remote
    ref="table"
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    @update:sorter="handleSorterChange"
    @update:filters="handleFiltersChange"
    @update:page="handlePageChange"
    :single-line="false"
    size="small"
  />
</template>
