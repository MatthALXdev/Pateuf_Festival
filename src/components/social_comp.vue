<template>
  <div class="m-4 px-4">
    <h2 class="font-bold text-xl text-center pb-3">Nos réseaux</h2>
    <div class="flex flex-wrap justify-evenly">
      <img
        v-for="img in imgSocialMedia"
        :key="img"
        :src="`/src/assets/images/${img}.png`"
        alt="logo de réseaux social"
        class="h-14"
      />
    </div>
  </div>
</template>

<script setup>
const imgSocialMedia = ['insta', 'tiktok', 'x', 'youtube']
</script>
