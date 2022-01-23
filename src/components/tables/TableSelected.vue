<script lang="ts" setup>
import {computed, ref, unref} from "vue";

const props = defineProps<{
  tableData: Array<any>;
  selected: Array<any>;
}>()

const emit = defineEmits(['clear-selected', 'delete-selected'])

const onClearSelected = () => emit('clear-selected')

const onDeleteSelected = () => emit('delete-selected')

const tableData = computed(() => props.tableData)

const selectedIds = computed(() => props.selected)

const selectedRows = computed((): any[] => selectedIds.value.map(id => getSelectedRow(id)))

const selectedNumberCounter = computed((): number => selectedRows.value.length)

const getSelectedRow = (id) => unref(tableData.value.find(row => unref(row).id === id)) ?? ''

const selectableActions = ref([
  {
    name: 'delete-selected',
    label: 'Delete Selected',
  },
  {
    name: 'clear-selected',
    label: 'Clear Selected',
  },
])

const selectionDisabled = computed(() => selectedNumberCounter.value === 0)

const selectedNames = computed(() => {
  const names = selectedRows.value.map(row => unref(row).name)
  return names.slice(0, 8)
})

</script>

<template>
  <div id="data-table-selected-component" class="data-table-selected">
    <div id="selected-names-row" class="selected-names-row">
      <div v-for="(label, index) in selectedNames" :id="`${index}-selected`" :key="index"
           class="selected-names-item">
        <span class="data-table-list-text">{{ label.value }}</span>
      </div>
    </div>
    <div class="selectable-actions">
      <div class="selected-counter">
        <em>{{ selectedNames.length }}</em>
      </div>
      <select class="select select-actions">
        <option v-if="!selectionDisabled" class="selection-disabled icon-angle-right" disabled="disabled" readonly="true" selected>
          Select an action to execute
        </option>
        <option v-for="(option, index) in selectableActions" :key="index" :value="option.name">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<style lang="scss">
@import "resources/scss/abstracts";

.selected-counter {
  position: absolute;
  right: calc(calc(var(--spacing-large) * 2) + var(--spacing-small));
  z-index: 1;
  pointer-events: none;
  font-family: var(--font-family-tertiary);
}

.selected-names-row {
  position: relative;
}

.icon-angle-right {
  height: rem-calc(40);
  width: rem-calc(40);
  position: relative;
}

.selectable-actions {
  position: relative;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    position: absolute;
    width: rem-calc(14);
    height: rem-calc(14);
    background: url(/assets/icons/electric.svg) no-repeat center;
    pointer-events: none;
    top: rem-calc(20);
    right: rem-calc(20);
    background-size: cover;
    opacity: 0.9;
  }

  select {
    width: 100%;
    min-width: rem-calc(240);
    border-radius: rem-calc(6);
    background: var(--white);
    color: var(--black);
    border: solid rem-calc(1) var(--input-border-color);
    height: rem-calc(45);
    font-size: rem-calc(16);
    font-weight: 500;
    margin: 0;
    cursor: pointer;
    outline: none;
    padding: rem-calc(13) rem-calc(12) rem-calc(12);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    option {
      background: var(--white);
      color: #000;
      font-size: rem-calc(16);
      font-weight: 500;
      padding: rem-calc(12);
      margin: 0;
      cursor: pointer;
      outline: none;
      line-height: normal;
    }

    &:focus-visible {
      border-color: var(--input-border-color);
      box-shadow: none;
    }
  }
}

.data-table-list-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: max-content;
  min-width: rem-calc(40);
  width: auto;
  font-size: rem-calc(16);
  line-height: normal;
  padding: rem-calc(4) rem-calc(8);
  border-radius: rem-calc(6);
  text-align: center;
  font-weight: 500;
  color: var(--tag-orange-dark);
  background: var(--tag-orange-lighter);
  font-style: oblique;

}

.data-table .data-table-row > .data-table-row-content > div.data-table-selected {
  display: grid;
  grid-template-columns: 1fr minmax(rem-calc(240), 1fr);
  grid-template-rows: 1fr;
  gap: 0 rem-calc(18);

  .selected-names-row {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0 rem-calc(8);
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right,
          transparent, transparent, transparent,
          transparent, transparent, inherit 100%);
      pointer-events: none;
    }

    .selected-names-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: max-content;
      position: relative;
      cursor: pointer;
      max-width: rem-calc(200);
      height: 100%;
    }
  }
}
</style>