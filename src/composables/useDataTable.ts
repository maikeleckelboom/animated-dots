import {computed, readonly, ref, Ref, unref, watch} from "vue";
import {slugify} from "../utils/string";
import {useStore} from "vuex";

interface Row {
    id: Number | String

    [key: string]: any
}


const tables = ref([])


export default function useDataTable(
    tableData: Ref<Array<Row>>,
    tableColumns: Ref<Array<string>>,
    tableOptions: Ref<any>) {

    // todo: params as MaybeRef, then make it a ref
    // const tableData = ref([])
    // const tableColumns = ref([])
    // const tableOptions = ref({})

    const sortBy = ref('name')
    const selected = ref([])

    const store = useStore()

    const searchValue = computed(() => store.state.filters.search)


    const setAndSortByColumn = (column) => {
        if (unref(tableOptions).sortable) {
            sortBy.value = column.name
            toggleSortDirection(column)
        }
    }

    const toggleSortDirection = (column) =>
        (column.sortDirection === 'asc')
            ? sortAsc(column)
            : sortDesc(column)

    const sortAsc = (column) => {
        const {name} = column
        tableData.value.sort((a, b) => a[name] > b[name] ? 1 : -1)
        column.sortDirection = 'desc'
    }

    const sortDesc = (column) => {
        const {name} = column
        tableData.value.sort((a, b) => a[name] < b[name] ? 1 : -1)
        column.sortDirection = 'asc'
    }

    const columns = computed(() => tableColumns.value.map(column => ({
            name: slugify(column),
            label: column.trim().replaceAll('_', ' '),
            sortable: !(column.trim() === ''),
            sortDirection: 'asc',
            active: column === sortBy.value
        })
    ))

    const rows = computed(() => filterBySearch(
        tableData.value.map(row => ({
            ...row,
            selected: selected.value.includes(row.id),
        })))
    )

    // Still unhandled
    const filterBySearch = (source: Array<any>) => {
        const search = searchValue.value.toLowerCase()
        return source.filter(row => {
            return Object.values(row).some(value => `${value}`.toLowerCase().includes(search))
        })
    }

    const setSelected = (row) => Boolean(row.selected)
        ? selected.value = selected.value.filter(id => id !== row.id)
        : selected.value.splice(0, 0, row.id)


    const setAllSelected = () => {
        selected.value = []
        rows.value.forEach(row => selected.value.splice(0, 0, row.id))
    }

    const removeAllSelected = () => {
        selected.value = []
        rows.value.forEach(row => row.selected = false)
    }

    const toggleAllSelected = () =>
        Boolean(selected.value.length === rows.value.length)
            ? removeAllSelected()
            : setAllSelected()

    const allSelected = computed(() => (selected.value.length === rows.value.length))

    watch(selected, (selected) => selected.forEach(id => {
        const row = rows.value.find(row => row.id === id)
        row.selected = selected.includes(id)
    }), {deep: true})


    return {
        rows: readonly(rows),
        allSelected: readonly(allSelected),
        columns,
        selected,
        sortBy,
        toggleAllSelected,
        setSelected,
        setAndSortByColumn,
    }
}