<template>
  <div class="bg-_black01 flex justify-evenly h-12">
    <a v-for="(icon, index) in icons" :key="index" :href="icon.href">
      <img
        :src="icon.src"
        :alt="icon.alt"
        class="my-1"
        :class="icon.customClass"
      />
    </a>
  </div>
</template>

<script setup>
const icons = [
  {
    src: 'src/assets/images/hamMenu.svg',
    alt: 'Menu',
    customClass: 'h-10',
    href: '',
  },
  {
    src: 'src/assets/images/tickets.svg',
    alt: 'Tickets',
    customClass: 'h-8',
    href: '',
  },
  {
    src: 'src/assets/images/logo.svg',
    alt: 'Logo',
    customClass: '-top-5 relative',
    href: '',
  },
  {
    src: 'src/assets/images/faqIcon.svg',
    alt: 'FAQ',
    customClass: 'h-10',
    href: '',
  },
  {
    src: 'src/assets/images/mapIcon.svg',
    alt: 'Map',
    customClass: 'h-10',
    href: '',
  },
]
</script>
