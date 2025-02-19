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
        <a :href="link.url" class="relative group">
          {{ link.name }}
          <span
            class="absolute -bottom-1 left-0 w-0 h-1 bg-_green03 transition-all group-hover:w-full group-focus:w-full"
          ></span>
        </a>
      </li>
      <li>
        <a href="/" @click.prevent="resetToHome">Home</a>
      </li>

      <li v-if="authStore.authenticated">
        <router-link to="/gestion">Gestion</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'

const { login, logout, user } = useAuth()

// Hook to handle routing
const router = useRouter()
const authStore = useAuthStore() // Access authentication state

// Reset to Home route
const resetToHome = () => {
  router.push('/')
}

// Placeholder links
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
