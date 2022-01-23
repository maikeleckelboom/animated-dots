<script setup lang="ts">
import {computed} from "vue";

interface Props {
  column: any;
  sortDirection: string;
  sortBy: string;
}

const props = withDefaults(defineProps<Props>(), {
  sortBy: 'name',
  column: {
    name: ''
  }
})

const asc = computed(() => Boolean(props.sortDirection === 'asc'))
const desc = computed(() => Boolean(props.sortDirection === 'desc'))

</script>

<template>
  <div v-if="column.sortable"
       class="sort-direction-arrows"
       :class="sortBy === column.name ? 'focused' : ''">
    <div :class="{'active': asc && (sortBy === column.name)}">
      <svg xmlns="http://www.w3.org/2000/svg"
           width="512"
           height="512"
           viewBox="0 0 292.362 292.362"
           class="sort-icon sort-icon-asc">
        <title>asc</title>
        <g transform="matrix(-1,-1.2246467991473532e-16,1.2246467991473532e-16,-1,292.36199951171875,292.3629837036133)">
          <path
              d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424   C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428   s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z"
              fill="#16161d"
              class="sort-asc-path"/>
        </g>
      </svg>
    </div>
    <div :class="{'active': desc && (sortBy === column.name)}">
      <svg xmlns="http://www.w3.org/2000/svg"
           width="512"
           height="512"
           viewBox="0 0 292.362 292.362"
           class="sort-icon sort-icon-desc">
        <title>desc</title>
        <path
            d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424   C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428   s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z"
            fill="#16161d"
            class="sort-desc-path"/>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "resources/scss/abstracts";

.sort-direction-arrows {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: rem-calc(18);

  &.focused {
    > div {
      .sort-desc-path,
      .sort-asc-path {
        opacity: 1;
      }
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .sort-desc-path,
    .sort-asc-path {
      opacity: 0.6;
    }

    &.active {
      .sort-desc-path,
      .sort-asc-path {
        fill: var(--primary-blue);
        opacity: 1;
      }
    }
  }
}

.sort-icon {
  height: rem-calc(8);
}

</style>