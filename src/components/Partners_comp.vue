<template>
  <div class="m-4 px-4">
    <h2 class="font-bold text-xl text-center pb-3">Nos partenaires</h2>
    <div class="flex flex-wrap justify-center gap-2">
      <img
        v-for="partner in imgPartners"
        :key="partner"
        :src="`/src/assets/images/${partner}.png`"
        :alt="partner"
        class="h-14"
      />
    </div>
  </div>
</template>

<script setup>
const imgPartners = [
  'brets',
  'charal',
  'choulette',
  'fdj',
  'holy',
  'leclerc',
  'michelin',
  'peugeot',
  'pilote',
  'trigano',
  'v&b',
]
</script>
