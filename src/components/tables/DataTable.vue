<script lang="ts" setup>
import {computed, ref} from "vue";

import {isArray} from 'lodash';
import {highlightMatches} from "../../../../data-table-component/src/utils/string";


import TableSelected from "./TableSelected.vue";
import TableSearchBar from "./TableSearchBar.vue";
import TableSortArrows from "./TableSortArrows.vue";
import TablePagination from "./TablePagination.vue";

import useDataTable from "../../../../data-table-component/src/composables/useDataTable";

import {tableDataBuilder} from "../../tableDataBuilder"
import {useStore} from "vuex";

interface Options {
  searchable?: boolean
  selectable?: boolean
  sortable?: boolean
  actionable?: boolean
  paginated?: boolean
  components?: Object
}

const props = defineProps<{
  data: Array<any>
  columns: Array<any>
  options?: Options
  pagination?: Object
  search?: string
}>()

const sortable = computed(() => props.options?.sortable ?? false)
const selectable = computed(() => props.options?.selectable ?? false)
const searchable = computed(() => props.options?.searchable ?? false)
const paginated = computed(() => props.options?.paginated ?? false)
const actionable = computed(() => props.options?.actionable ?? false)

const tableData = computed(() => props.data)
const tableColumns = computed(() => props.columns || [])
const tableOptions = computed(() => props.options || {})

const tableDataProperties = tableDataBuilder(tableData, tableColumns, tableOptions)
const tableDataRef = ref(tableDataProperties)
const tableElement = ref(null)

const search = computed(() => props.search || '')

const {
  rows,
  columns,
  sortBy,
  selected,
  allSelected,
  setSelected,
  toggleAllSelected,
  setAndSortByColumn,
} = useDataTable(tableDataRef, tableColumns, tableOptions)

const pagination = computed(() => !!paginated.value && props.pagination ? props.pagination : {})

const componentStyleBindings = computed(() => [
  {'sortable': sortable},
  {'selectable': selectable},
  {'searchable': searchable},
  {'paginated': paginated},
])


</script>

<template>
  <div ref="tableElement"
       :class="componentStyleBindings"
       class="data-table">
    <div class="data-table-top-bar">
      <div v-if="searchable" data-option="searchable">
        <div class="data-table-row-content">
          <TableSearchBar/>
        </div>
      </div>
    </div>
    <div class="data-table-header">
      <div :class="{'selected': allSelected}"
           class="data-table-row">
        <div class="data-table-row-content">
          <slot name="columns">
            <div v-if="selectable"
                 class="data-table-select select-all"
                 data-option="selectable"
                 data-property="select">
              <label class="data-table-select-checkbox"
                     for="select-all">
                <input id="select-all"
                       :checked="allSelected"
                       type="checkbox"
                       v-on:change="toggleAllSelected"/>
              </label>
            </div>
            <div v-for="(column, index) in columns"
                 :key="index"
                 :class="{'active': column.active}"
                 :data-column="column.name"
                 :data-index="index"
                 class="data-table-row-content-item"
                 v-on:click="setAndSortByColumn(column)">
              <span>{{ column.label }}</span>
              <TableSortArrows v-if="sortable"
                               :column="column"
                               :sort-by="sortBy"
                               :sort-direction="column.sortDirection"
                               data-option="sortable"/>
            </div>
          </slot>
        </div>
      </div>
    </div>
    <div class="data-table-body">
      <template v-for="(row, iterator) in rows" :key="row.id">
        <div :class="{'selected': row.selected}"
             class="data-table-row">
          <div class="data-table-row-content">
            <slot :row="row" name="row">
              <div v-if="selectable"
                   class="data-table-select"
                   data-property="select">
                <label :for="`table-select-${iterator}`"
                       class="data-table-select-checkbox">
                  <input :id="`table-select-${iterator}`"
                         :checked="row.selected"
                         type="checkbox"
                         v-on:change="setSelected(row)"/>
                </label>
              </div>
              <div v-for="(property, index) in tableColumns"
                   :key="`${row.id}-${property}`"
                   :data-index="index"
                   :data-property="property"
                   class="data-table-row-content-item">
                <component :is="rows[iterator][property].tag"
                           v-bind="rows[iterator][property].attrs"
                           v-html="rows[iterator][property].value"/>
              </div>
              <div v-if="actionable"
                   class="data-table-actionable"
                   data-property="actionable">
                <div class="data-table-actionable-dots-button">
                  <svg class="data-table-dots-icon" viewBox="0 0 29.96 122.88" xmlns="http://www.w3.org/2000/svg">
                    <path class="cls-1"
                          d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Zm0,92.93a15,15,0,1,1-15,15,15,15,0,0,1,15-15Zm0-46.47a15,15,0,1,1-15,15,15,15,0,0,1,15-15Z"/>
                  </svg>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </template>
    </div>
    <div class="data-table-footer">
      <div v-if="selected.length" class="data-table-row" data-option="selectable">
        <div class="data-table-row-content">
          <TableSelected :selected="selected" :table-data="rows"/>
        </div>
      </div>
      <div v-if="paginated" class="data-table-row" data-option="paginated">
        <div class="data-table-row-content">
          <TablePagination :data="rows" :pagination="pagination"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "resources/scss/abstracts";

.data-table-option {
  &.active {
    background: #f5f5f5;
  }
}

.data-table-row[data-option='selectable'] {
  .selected-any & {
    //background: #f5f5f5;
  }
}

.data-table-pagination-bar {
  width: 100%;
}

a {
  color: var(--primary-blue);
  font-weight: normal;
  text-decoration: none;
}


.data-table {
  --table-row-border-thickness: #{rem-calc(1)};
  --table-row-spacing-y-condensed: calc(#{rem-calc(40)} + var(--table-row-border-thickness));
  --table-row-spacing-y-regular: calc(#{rem-calc(48)} + var(--table-row-border-thickness));
  --table-row-spacing-y-relaxed: calc(#{rem-calc(56)} + var(--table-row-border-thickness));
  --current-table-row-spacing-y: var(--table-row-spacing-y-relaxed);

  --table-lighter-color: #dbe8f5;
  --table-light-color: #dadada;
  --table-dark-color: #8e8e8e;
  --table-darker-color: #6d6d6d;

  --table-spacing-gap: #{rem-calc(18)};
  --table-box-shadow: 0 #{em-calc(1)} #{em-calc(1)} 0 var(--table-lighter-color);
  --table-border: solid #{em-calc(1)} var(--table-light-color);
  --table-row-border: dashed #{em-calc(1)} rgba(246, 246, 246, 1);

  display: grid;
  align-content: start;
  height: em-calc(840);

  .data-table-top-bar {

  }

  .data-table-row {
    display: flex;
  }

  &.actionable {
    .data-table-row {
      &:hover,
      &.selected {
        .data-table-actionable {
          opacity: 1;
        }
      }
    }

    .data-table-header {
      .data-table-row {
        .data-table-row-content {
          .data-table-row-content-item:last-child {
            //padding-right: rem-calc(34);
          }
        }
      }
    }

    .data-table-body {
      .data-table-row {
        .data-table-row-content {
          .data-table-row-content-item:last-child {
            //padding-right: rem-calc(100);
          }
        }
      }
    }
  }
}

.data-table-actionable {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: rem-calc(80);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;

  &:hover,
  [data-options*="selectable"] {
    opacity: 1;
  }

  &[data-options~="hover-actionable"] {
    display: none;
  }
}


.data-table-actionable-dots-button {
  position: relative;
  padding: rem-calc(12);
  display: flex;
  overflow: hidden;
  cursor: pointer;
  height: rem-calc(38);
  width: rem-calc(38);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  left: rem-calc(8);

  &:hover {
    background: var(--color-primary-light);
  }

  .data-table-dots-icon {
    width: rem-calc(16);
    height: rem-calc(16);
    fill: darkgray;
    image-rendering: pixelated;
  }

}


.data-table-body {
  overflow: auto;
  border-radius: var(--border-radius);
  background: var(--white);
  overscroll-behavior: contain;

  .data-table-row {
    &.selected {
      background: #f9f9f9;
    }

    .data-table-row-content {
      .data-table-row-content-item {
        h1, h2, h3, h4, h5, h6, p, span, a {
          text-overflow: ellipsis;
          overflow: hidden;
          display: inline;
          white-space: nowrap;
          max-width: 24ch;
          margin-bottom: 0;
        }
      }
    }
  }
}


.data-table-select {
  display: flex;
  justify-content: center;
  align-items: center;

  .data-table-select-checkbox {
    --size: #{rem-calc(24)};
    --border-radius: #{rem-calc(8)};

    position: relative;
    width: var(--size);
    height: var(--size);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0;
    cursor: pointer;

    .selected & {
      &::after {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }

      &::before {
        // Checkbox background
      }

      &:hover {
        &::after {
          background: url('/assets/form/minus-black.svg') no-repeat center;
          background-size: cover;
        }
      }
    }

    &:hover {
      &::before,
      &::after {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }

    input[type='checkbox'] {
      visibility: hidden;
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    &::before {
      content: '';
      border: rem-calc(1) solid #dadada;
      border-radius: var(--border-radius);
      width: var(--size);
      height: var(--size);
      background: var(--white);
      opacity: 1;
    }

    &:after {
      position: absolute;
      content: '';
      display: flex;
      justify-content: center;
      align-items: center;
      width: rem-calc(10);
      height: rem-calc(10);
      background: url('/assets/form/cross.svg') no-repeat center;
      background-size: cover;
      opacity: 0;
    }
  }
}

.data-table {
  margin: var(--table-spacing-gap) 0;
  border-radius: rem-calc(12);
  overflow: hidden;

  img, svg {
    width: rem-calc(80);
    border-radius: rem-calc(4);
    object-fit: cover;
  }

  .data-table-header {

    .data-table-row-content {
      display: grid;
      border-radius: rem-calc(4);

      .data-table-row-content-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-transform: capitalize;
        font-weight: 700;
        letter-spacing: em-calc(2);
        font-size: rem-calc(15);
        cursor: pointer;
        height: 100%;
        user-select: none;
        -webkit-user-select: none;

        .sort-direction-arrows {
          margin-left: rem-calc(8);
          opacity: 0;
        }

        &:hover,
        &.active {
          .sort-direction-arrows {
            opacity: 1;
          }
        }
      }
    }
  }

  .data-table-body {
    .data-table-row {
      .data-table-row-content {
        .data-table-row-content-item {
          &:nth-last-child(2) {
            padding-right: 3rem;
          }
        }
      }
    }
  }

  .data-table-row {
    border-radius: rem-calc(4);
    border-bottom: var(--table-row-border);
    transition: none;
    position: relative;
    gap: var(--table-spacing-gap);
    min-height: var(--current-table-row-spacing-y);

    &:nth-last-child(1) {
      border-bottom: none;
    }

    .data-table-row-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
      width: 100%;
      position: relative;
      gap: var(--table-spacing-gap);

      .data-table-row-content-item {
        display: flex;
        align-items: center;
        padding: rem-calc(12);

        &[data-property='phone'] {
          justify-content: flex-end;
        }

        &:not([data-property='select']) {
          grid-column: span 3;
        }

        &[data-property='select'] {
          display: flex;
          align-items: center;
          justify-content: center;
          grid-column: span 1;
        }

        &[data-property='actionable'] {
          justify-content: center;
        }
      }
    }
  }

  .data-table-footer {
    position: relative;

    .selected & {
      //
    }

    .data-table-row,
    .data-table-row-content {


    }

    .data-table-row {
      border-bottom: none;
      //background: var(--white);

      &[data-option='paginated'] {
      }
    }
  }

}
</style>