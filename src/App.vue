<script lang="ts" setup>
import AppHeader from "../../vite-project/src/components/app/AppHeader.vue";
import AppMain from "../../vite-project/src/components/app/AppMain.vue";
import AppFooter from "../../vite-project/src/components/app/AppFooter.vue";</script>

<template>
  <div id="app-layout-default">
    <AppHeader/>
    <AppMain/>
    <AppFooter/>
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
}

:root {
  --header-background: #FFFFFF;
  --header-height: 74px;
  --footer-height: calc(30vh - calc(var(--header-height) / 2));
  --main-height: calc(70vh - calc(var(--header-height) / 2));
}

#app-layout-default {
  display: flex;
  flex-direction: column;
  height: 100%;

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  > .app-header {
    height: var(--header-height);
    background: var(--header-background);
  }

  > .app-main {
    height: var(--main-height);
    background: #F1F1F1;
  }

  > .app-footer {
    height: var(--footer-height);
  }
}

.app-header {

}

.app-main {

}

.app-footer {

}

</style>
