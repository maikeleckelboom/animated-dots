<script setup lang="ts">
import {computed} from "vue";
import {useStore} from "vuex";

import AppButton from '../app/AppButton.vue'

const store = useStore()

const search = computed({
  get: () => store.state.filters.search,
  set: (query: string) => {
    store.commit('setSearch', query)
  }
})

const buttonText = 'Search'
const inputPlaceholder = 'Search..'
</script>

<template>
  <form class="table-search-form">
    <div class="table-search-form-blocks">
      <div class="table-search-form-input-block">
        <input v-model="search"
               :placeholder="inputPlaceholder"
               class="input input-search"
               name="search"
               type="search">
        <div class="table-search-form-button-block">
          <AppButton :value="buttonText"
                     class="search-btn"/>
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
@import "resources/scss/abstracts";

:root {
  --table-search-form-input-height: #{rem-calc(45)}
}

.table-search-form {
  width: 50%;
  padding: var(--spacing-medium) rem-calc(4);

  .table-search-form-blocks {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: var(--input-border-radius);
    padding: var(--spacing-md) 0;

    .table-search-form-input-block {
      position: relative;
      width: 100%;
      height: 100%;
      background: var(--white);
      border-radius: var(--input-border-radius);

      > input.input-search {
        background: var(--white);
        border: solid rem-calc(1) #ccc;
        height: var(--table-search-form-input-height);
        width: 100%;
        font-size: rem-calc(16);

        &:focus,
        &:focus-within {
          @include focus-shadow();
        }
      }
    }

    .table-search-form-button-block {
      height: 100%;
      min-width: max-content;
      max-width: rem-calc(80);
      background: var(--white);
      border-radius: var(--input-border-radius);
      margin-left: em-calc(1);
      position: absolute;
      inset: 0 0 0 auto;

      @supports not (inset: initial) {
        top: 0;
        right: 0;
        bottom: 0;
      }
    }

    .search-btn {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      height: var(--table-search-form-input-height);
    }
  }
}
</style>