<template>
  <div class="bg-_darkBlue01 flex justify-evenly">
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
    customClass: '',
    href: '',
  },
  {
    src: 'src/assets/images/tickets.svg',
    alt: 'Tickets',
    customClass: 'h-10',
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
    customClass: '',
    href: '',
  },
  {
    src: 'src/assets/images/mapIcon.svg',
    alt: 'Map',
    customClass: '',
    href: '',
  },
]
</script>
