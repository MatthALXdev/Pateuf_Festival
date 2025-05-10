<template>
  <div class="m-4 px-4 lg:bg-opacity-80 lg:bg-_beige01">
    <h2 class="font-bold text-xl text-center pb-3">Nos réseaux</h2>
    <div class="flex lg:flex-col gap-6 justify-around">
      <img
        v-for="img in imgSocialMedia"
        :key="img"
        :src="`/images/social/${img}.svg`"
        :alt="`logo de ${img}`"
        class="h-12"
      />
    </div>
  </div>
</template>

<script setup>
const imgSocialMedia = ['instagram', 'tiktok', 'X', 'youtube']
</script>
