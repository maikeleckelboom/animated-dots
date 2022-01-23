<script lang="ts" setup>
import {computed, ref} from "vue";

import DataTable from './DataTable.vue';

import useDataTable from "../../../../data-table-component/src/composables/useDataTable";
import {useTimeAgo} from "@vueuse/core";

interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

interface Pagination {
  current_page: number
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<PaginationLink>
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

const props = defineProps<{ data: any[]; pagination: Pagination }>()

const tableData = computed(() => props.data)

const tableColumns = ref([
  'name',
  'email',
  'website',
  'created_at',
])

const replaceValues = (searchValue: string, args: Array<string>, replaceValue) =>
    args.reduce((accumulator, currentValue) =>
        accumulator.replace(new RegExp(currentValue, 'g'), replaceValue), searchValue)

const tableOptions = ref({
  sortable: true,
  selectable: true,
  searchable: true,
  paginated: true,
  components: {
    created_at: {
      tag: 'span',
      value: (value) => useTimeAgo(value)
    },
    website: {
      tag: 'a',
      value: (value) => replaceValues(value, ['http://', 'https://', 'www.'], ''),
      attrs: {
        target: '_blank',
        href: (value) => value,
      },
    },
    default: {
      tag: 'span',
      value: (value) => value,
    }
  },
})

const {selected} = useDataTable(tableData, tableColumns, tableOptions)

</script>

<template>
  <DataTable :columns="tableColumns"
             :data="tableData"
             :options="tableOptions"
             :pagination="pagination"/>
</template>

<style lang="scss">

</style>


