<template>
  <div class="sm:hidden">
    <button class="fixed z-50 bottom-8 right-8 flex-row" @click="toggleNavBar">
      <div v-if="showNavBar">
        <img
          src="/src/assets/images/svg/cancel.svg"
          class="w-8 bg-_blue03 rounded-full"
          alt=""
        />
      </div>
      <div v-else>
        <p class="font-title font-medium self-center bg-_blue03 rounded-md p-1">
          MENU
        </p>
      </div>
    </button>
    <transition :name="transitionName">
      <div
        class="w-screen h-full z-40 fixed top-[60px] bg-_brown01 bg-opacity-60 flex items-center flex-wrap justify-evenly flex-col font-title backdrop-blur"
        v-if="showNavBar"
      >
        <NavList @linkClicked="handleLinkClick" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import NavList from './NavList.vue'
import { ref } from 'vue'

const showNavBar = ref(false)
const transitionName = ref('slide-left')

function toggleNavBar() {
  showNavBar.value = !showNavBar.value
  transitionName.value = showNavBar.value ? 'slide-left' : 'slide-right'
}

function handleLinkClick() {
  transitionName.value = 'slide-right'
  showNavBar.value = false
}
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
