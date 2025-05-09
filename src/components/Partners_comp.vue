<template>
  <div class="m-4 px-4">
    <h2 class="font-bold text-xl text-center pb-3">Nos partenaires</h2>
    <div class="flex flex-wrap justify-center gap-2">
      <a
        v-for="sponsor in sponsorStore.sponsors"
        :key="sponsor.name"
        :href="sponsor.url || '#'"
        target="_blank"
        rel="noopener"
      >
        <img
          :src="sponsor.logo.asset.url"
          :alt="sponsor.name"
          class="h-14 lg:h-24"
        />
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSponsorStore } from '@/stores/useSponsorStore'

const sponsorStore = useSponsorStore()

onMounted(() => {
  if (sponsorStore.sponsors.length === 0) {
    sponsorStore.fetchSponsors()
  }
})
</script>
