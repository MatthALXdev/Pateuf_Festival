<!-- NavList.vue -->
<template>
  <nav>
    <ul
      class="list-none flex flex-col text-2xl items-center justify-evenly gap-5 sm:flex-row sm:text-sm md:text-base pr-4"
    >
      <li
        v-for="(link, index) in links"
        :key="index"
        class="transform transition duration-200 hover:scale-125"
      >
        <a :href="link.url" class="relative group"
          >{{ link.name
          }}<span
            class="absolute -bottom-1 left-0 w-0 h-1 bg-_green03 transition-all group-hover:w-full group-focus:w-full"
          ></span
        ></a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const links = [
  { name: 'Programmation', url: '#' },
  { name: 'Concert', url: '#' },
  { name: 'Billeterie', url: '#' },
  { name: 'Carte', url: '#' },
  { name: 'Forum', url: '#' },
  { name: 'Partenaires', url: '#' },
  { name: 'Reseaux', url: '#' },
]
</script>
