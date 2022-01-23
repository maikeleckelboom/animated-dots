<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {onClickOutside, useUrlSearchParams} from '@vueuse/core'
import {useComponentMode} from "../../../../data-table-component/src/composables/useComponentMode";

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
  path: string,
  per_page: number
  prev_page_url: string | null;
  to: number
  total: number
  on_each_side: number
}

const props = defineProps<{
  pagination: Pagination
  data: Array<any>
}>()

// Template refs
const paginationContainerElement = ref(null)
const paginationContentElement = ref(null)

// Computed pagination properties
const pagination = computed(() => props.pagination)

// Constants
const DEFAULT_ON_EACH_SIDE = 3
const ON_EACH_SIDE = pagination.value.on_each_side || DEFAULT_ON_EACH_SIDE

// Computed getter and setter for the current page
const currentPage = computed({
  get: () => props.pagination.current_page,
  set: (value) => pagination.value.current_page = value
})

// Handle active state for pagination links
const urlParams = useUrlSearchParams('history')
onMounted(() => urlParams.page = Boolean(!urlParams.page) ? '1' : urlParams.page)

// Handles close on click outside paginator menu
const currentlyOpenedMenuElement = ref(null)
onClickOutside(currentlyOpenedMenuElement, (_event) => {
  const openedElement = currentlyOpenedMenuElement.value
  const openedIndex = openedElement.dataset.index
  paginationLinks.value[openedIndex].active = false
})

// Constants
const ELLIPSIS = '...'

// Get the links to display in the pagination
const takePaginationLinks = (link) => !isNaN(Number(link.label)) || link.label === ELLIPSIS
const paginationLinks = computed(() => pagination.value.links.filter(link => takePaginationLinks(link)) || [])

// Checks if the link contains the paginator menu
const isPaginatorMenu = (link: PaginationLink) => (link.label === ELLIPSIS)

// Checks if the paginator menu is active
const isPaginatorMenuActive = (link: PaginationLink) => Boolean(link.label === '...' && link.active)

// Checks if the paginator menu is active by current url params
const isActiveByUrlParams = (link: PaginationLink) => Number(urlParams.page) === Number(link.label)

// Class object for the pagination item
const paginationLinkClasses = (link) => ({
  'active': link.active,
  'active-by-params': isActiveByUrlParams(link),
  'paginator-menu': isPaginatorMenu(link)
})

// Use the component mode
const {observer, mode} = useComponentMode(paginationContainerElement)

// Fires when the user clicks on one of the pagination links
const onPaginate = (link) => {
  if (Number(link.label)) return
  link.active = true
}

// Gets the table records information based on the current page
const getPaginationInformation = () => ({
  short: `${pagination.value.from} / ${pagination.value.to} of ${pagination.value.total}`,
  long: `Showing ${pagination.value.from} to ${pagination.value.to} of ${pagination.value.total} items`,
})

// Gets the pagination links that are not in given by the back-end API.
const makeLinksRange = (links, index: number) => {
  const start = Number(links[index - 1].label) + 1
  const end = Number(links[index + 1].label)
  const range: Array<any> = []
  for (let page = start; page < end; page++) {
    range.push({url: `${pagination.value.path}?page=${page}`, label: `${page}`})
  }
  return range
}
</script>

<template>
  <div ref="paginationContainerElement"
       :class="mode.name"
       class="data-table-pagination">
    <div ref="paginationContentElement"
         class="data-table-pagination-content">
      <div class="data-table-pagination-item to-first-page">
        <a :aria-disabled="!pagination.first_page_url"
           :class="{'disabled':!pagination.first_page_url}"
           :href="pagination.first_page_url"
           class="pagination-link">
          <i class="fas fa-angle-double-left"></i>
        </a>
      </div>
      <div class="data-table-pagination-item to-prev-page">
        <a :aria-disabled="!pagination.first_page_url"
           :class="{'disabled':!pagination.first_page_url}"
           :href="pagination.prev_page_url"
           class="pagination-link">
          <i class="fas fa-angle-left"></i>
        </a>
      </div>
      <div class="data-table-pagination-item pagination-links">
        <div v-for="(link, index) in paginationLinks" :key="index"
             :class="paginationLinkClasses(link)"
             class="data-table-pagination-item">
          <a :data-index="index"
             :href="link.url"
             :readonly="!link.url"
             class="pagination-link"
             v-on:click="onPaginate(link)">
            <span>{{ link.label }}</span>
          </a>
          <div v-if="isPaginatorMenuActive(link)"
               :ref="el => { if (el) currentlyOpenedMenuElement = el }"
               :data-index="index"
               class="pagination-paginator-menu"
               data-direction="top">
            <div class="pagination-paginator-menu-grid">
              <div v-for="link in makeLinksRange(paginationLinks, index)" :key="link.name"
                   class="pagination-paginator-menu-grid-item">
                <a :class="{'active': link.active}"
                   :href="link.url"
                   class="pagination-link">
                  <span>{{ link.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-table-pagination-item to-next-page">
        <a :aria-disabled="!pagination.last_page_url"
           :class="{'disabled': !pagination.last_page_url}"
           :href="pagination.last_page_url"
           class="pagination-link">
          <i class="fas fa-angle-right"></i>
        </a>
      </div>
      <div class="data-table-pagination-item to-last-page">
        <a :aria-disabled="!pagination.last_page_url"
           :class="{'disabled':pagination.last_page_url}"
           :href="pagination.last_page_url"
           class="pagination-link">
          <i class="fas fa-angle-double-right"></i>
        </a>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
@import "resources/scss/abstracts";

.pagination-link {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-family-monospace);
  padding: var(--spacing-medium);
  height: rem-calc(40);
  width: rem-calc(40);
  position: relative;
  font-weight: 500;
  user-select: none;
  -webkit-user-select: none;
  color: var(--black);

  &:hover {
    color: var(--primary-blue-dark);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: rem-calc(3);
    width: 100%;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    background: var(--primary-blue-dark);
    opacity: 0;
  }

  > span {
    position: relative;
    z-index: 2;
  }

  .active-by-params > & {

    > span {
      color: var(--primary-blue-dark);
    }

    &::before {
      opacity: 1;
    }
  }
}

.data-table-pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  z-index: 1;

  .data-table-pagination-content {
    width: fit-content;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    border-radius: var(--border-radius);
    border: none;
    margin: 0;

    .data-table-pagination-item {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: var(--border-radius);
      cursor: pointer;
      text-align: center;
      position: relative;
      height: 100%;

      &.paginator-menu {

        .pagination-paginator-menu {
          position: absolute;
          border-radius: var(--border-radius);
          z-index: 99;
          bottom: calc(100% + var(--spacing-regular));

          &[data-direction="top"] {
            bottom: calc(100% + var(--spacing-regular));

            &::before {
              transform: rotate(315deg);
              top: initial;
              bottom: rem-calc(-8);
            }

            .pagination-paginator-menu-grid {
              box-shadow: rgba(0, 0, 0, 0.1) 0 em-calc(1) em-calc(3) 0,
              rgba(0, 0, 0, 0.06) 0 em-calc(1) em-calc(2) 0;
            }
          }

          &[data-direction="bottom"] {
            top: calc(-100% + var(--spacing-regular));

            &::before {
              transform: rotate(135deg);
              top: rem-calc(-8);
              bottom: initial;
            }

            .pagination-paginator-menu-grid {
              box-shadow: 0 em-calc(1) em-calc(1) 0 #dbe8f5;
            }
          }

          .pagination-paginator-menu-grid {
            display: grid;
            grid-template-columns: repeat(4, rem-calc(40));
            grid-template-rows: repeat(auto, rem-calc(40));
            padding: rem-calc(4);
            position: relative;
            width: 100%;
            background: var(--white);
            //max-height: rem-calc(112);
            max-height: rem-calc(118);
            min-height: rem-calc(40);
            border-radius: var(--border-radius);
            scroll-snap-type: y mandatory;
            overscroll-behavior-y: contain;
            overflow-y: auto;

            .pagination-paginator-menu-grid-item {
              position: relative;
              z-index: 1;
              scroll-snap-align: start;
              > .pagination-link::before {
                display: none;
              }
            }
          }

          &::before {
            content: '';
            display: flex;
            height: rem-calc(16);
            width: rem-calc(16);
            background-color: inherit;
            border: inherit;
            position: absolute;
            left: calc(50% - #{rem-calc(8)});
            clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
            border-radius: 0 0 0 rem-calc(4);
            background: var(--white);
            transform: rotate(135deg);
            top: rem-calc(-8);
            z-index: 1;
            pointer-events: none;
            //background: #555555;
            box-shadow: rgba(var(--lighter-black), 0.25) 0 em-calc(1) em-calc(1),
            rgba(var(--lighter-black), 0.13) 0 0 em-calc(1) em-calc(1);
          }
        }

        &:hover,
        &.active {
          > .pagination-link {
            color: var(--primary-blue-dark);
          }

          &::before {
            display: none;
          }

          &::after {
            opacity: 1;
          }
        }

        &.active {
          > .pagination-link {
            pointer-events: none;
          }
        }

        &::after {
          content: '';
          display: flex;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: rem-calc(34);
          width: rem-calc(34);
          border-radius: 50%;
          background: rgba(#F9F9F9, 0.9);
          pointer-events: none;
          opacity: 0;
        }
      }

      &::before {
        content: '';
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        height: rem-calc(3);
        position: absolute;
        opacity: 0;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        background: var(--primary-blue-dark);
        pointer-events: none;
      }

      &.to-prev-page,
      &.to-next-page {
        width: rem-calc(60);

        .pagination-link::before {
          display: none;
        }
      }

      &.to-first-page,
      &.to-last-page {
        display: none;
      }

      &.pagination-links {
        font-size: rem-calc(14);

        @include set-breakpoint(smartphone, down) {
          font-size: rem-calc(14);
        }
      }
    }
  }
}
</style>