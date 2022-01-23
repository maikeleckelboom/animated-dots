<script lang="ts" setup>
import {computed, Ref, ref, watch} from "vue";
import {useTimestamp} from '@vueuse/core'
import {nanoid} from 'nanoid'
import {ComputedRefValue} from "vue/macros";

// Define all possible animation states.
// This is used to determine the animation state of the dots menu.
const Animation: {
  playing: string
  paused: string
} = {
  playing: 'PLAYING',
  paused: 'PAUSED',
}

// Placeholder ref for animation state, set initial state to paused.
const animationState: Ref<string> = ref(Animation.paused)

// Placeholder ref for the current animation id.
const animationId: Ref<ReturnType<typeof setInterval>> = ref(null)

// Define the animation interval time (in ms).
const intervalTime: Ref<number> = ref(1000)

// Placeholder for the current timestamp.
const startTimestamp: Ref<number> = ref(0)

// Set the timestamp to the current time (in ms).
const updateTimestamp = () => startTimestamp.value = useTimestamp().value

// Start the animation, if it is not already playing.
const startAnimation = () => {
  if (animationState.value === Animation.playing) return
  animationState.value = Animation.playing
  updateTimestamp()
}

// Set the animation to paused
const pauseAnimation = () => animationState.value = Animation.paused

// Try to pause the animation.
// If the animation is already paused, we don't need to do anything.
// If the animation is playing, we need to wait for it to finish.
const finishAnimation = () => {
  if (animationState.value === Animation.paused) return
  const difference = useTimestamp().value - startTimestamp.value
  Boolean(difference < intervalTime.value)
      ? setTimeout(() => pauseAnimation(), intervalTime.value - difference)
      : pauseAnimation()
}

// Keep track of the current animation state
const isPlaying = computed(() => animationState.value === Animation.playing)
const isPaused = computed(() => animationState.value === Animation.paused)

// Computed class bindings for the element, based on the current state
const animationClassBindings: ComputedRefValue<any> = computed(() => ({
  'playing': isPlaying.value,
  'paused': isPaused.value,
}))

// If the animation is playing, update the timestamp,
// otherwise stop the animation by clearing the interval.
watch(isPlaying, (isPlaying: boolean) => (isPlaying)
    ? animationId.value = setInterval(() => updateTimestamp(), intervalTime.value)
    : clearInterval(animationId.value))

// Keep track of the hover state of the element.
const hoverActive: Ref<boolean> = ref(false)

// If the animation is paused, we need to check if the element is still being hovered.
// If it is, we need to repeat the animation.
watch(isPaused, (isPaused: boolean) => {
  if (isPaused && hoverActive.value) {
    startAnimation()
  }
})

// On mouse enter, we need to start the animation.
// Also, we need to set the hoverActive state to true.
const onMouseenter = () => {
  hoverActive.value = true
  startAnimation()
}

// On mouse leave, we need to pause the animation.
// We also need to set the hoverActive state to false,
// so that the animation won't repeat if the element is not being hovered anymore.
const onMouseleave = () => {
  hoverActive.value = false
  finishAnimation()
}

// Keep track of the menu opened state.
const menuActive: Ref<Boolean> = ref(false)

// On click, we need to toggle the menu active state.
const toggleActive = () => {
  menuActive.value = !menuActive.value
}
</script>

<template>
  <div :id="nanoid()"
       :class="[animationClassBindings, {'hover': hoverActive, 'active': menuActive}]"
       class="triple-dots-menu"
       v-on:click="toggleActive"
       v-on:mouseenter="onMouseenter"
       v-on:mouseleave="onMouseleave">
    <span v-for="dot in 3" :key="dot" class="dot"/>
  </div>
  <transition name="slide-fade">
    <div v-if="menuActive" class="triple-dots-menu-content">
      <div class="triple-dots-menu-content-item">
        <p>Hello World 🙂</p>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@use './src/scss/abstracts';

.triple-dots-menu {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  background: #FFFFFF;
  user-select: none;
  transition: ease-out 0.2s;
  will-change: transform;
  transform: translate3d(0, 0, 0);

  &:hover {
    background: #F8F8F8;
    box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  }

  &.paused {
    > .dot {
      animation: none;
    }
  }

  &.playing {
    > .dot {
      animation: dots-animation 1s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: -0.8s;
      }

      &:nth-child(3) {
        animation-delay: -0.7s;
      }
    }
  }

  > .dot {
    display: inline-flex;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #484848;

    &:nth-child(2) {
      margin: 0 3.5px;
    }
  }


  &.active {
    > .dot {


      &:nth-child(1) {
      }

      &:nth-child(2) {
      }

      &:nth-child(3) {

      }
    }
  }
}

.triple-dots-menu-content {
  --padding: 10px;
  position: absolute;
  background: #FFFFFF;
  border-radius: 8px;
  z-index: 1;
  transform: translateY(200%);
  padding: 8px;

  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      margin-bottom: 0;
      white-space: nowrap;
    }
  }
}


@keyframes dots-animation-active {
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-6px);
  }
}

@keyframes dots-animation {
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-8px);
  }
}
</style>