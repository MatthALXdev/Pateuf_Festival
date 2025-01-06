<template>
  <!-- Header fixe -->
  <div
    class="px-4 py-1 text-xs bg-_beige02 flex flex-wrap gap-2 justify-start items-center fixed top-0 left-0 w-full z-50"
  >
    <h1 class="text-3xl flex-grow">PATEUF</h1>
    <div class="flex flex-col font-title">
      <!-- Compte à rebours -->
      <div class="flex flex-row gap-2 text-center justify-end">
        <div>
          <p class="text-sm font-bold">{{ days }}</p>
          <p class="text-xs">JOURS</p>
        </div>
        <div>
          <p class="text-sm font-bold">{{ hours }}</p>
          <p class="text-xs">HEURES</p>
        </div>

        <div>
          <p class="text-sm font-bold">{{ minutes }}</p>
          <p class="text-xs">MINUTES</p>
        </div>
        <div>
          <p class="text-sm font-bold">{{ seconds }}</p>
          <p class="text-xs">SECONDES</p>
        </div>
        <!-- <div class="">
        <a href="#">
          <img
            class="w-14 h-14"
            src=".\..\assets\images\profil.png"
            alt="logo profile"
          />
        </a>
      </div> -->
      </div>
      <div class="flex flex-row gap-1 justify-end">
        <p class="px-2 text-center bg-_black01 text-_white03 rounded-full">
          Since 1989
        </p>
        <p class="px-2 text-center bg-_black01 text-_white03 rounded-full">
          14 & 15 JUIN 2025
        </p>
      </div>
    </div>
  </div>
  <!-- Image principale -->
  <div>
    <img
      src="./../assets/images/frontImage.png"
      alt="Image principale"
      class="w-full mt-[60px]"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const targetDate = new Date('2025-06-14T14:00:00+02:00')
const days = ref('XXX')
const hours = ref('XX')
const minutes = ref('XX')
const seconds = ref('XX')

const updateCountdown = () => {
  const now = new Date()
  const difference = targetDate - now

  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((difference / (1000 * 60 * 60)) % 24)
    minutes.value = Math.floor((difference / (1000 * 60)) % 60)
    seconds.value = Math.floor((difference / 1000) % 60)
  } else {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
  }
}
onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
})
</script>
