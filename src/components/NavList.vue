<template>
  <nav>
    <ul
      class="list-none flex flex-col text-2xl items-center justify-evenly gap-5 sm:flex-row sm:text-sm md:text-base pr-4"
    >
      <li
        v-for="(link, index) in visibleLinks"
        :key="index"
        :class="linkClasses"
      >
        <router-link
          v-if="link.isRouterLink"
          :to="link.url"
          :class="anchorClasses"
          @click="handleNavigation(link)"
        >
          {{ link.name }}
          <span :class="underlineClasses"></span>
        </router-link>

        <a
          v-else-if="link.onClick"
          href="#"
          :class="anchorClasses"
          @click.prevent="handleClick(link, $event)"
        >
          {{ link.name }}
          <span :class="underlineClasses"></span>
        </a>

        <a
          v-else
          :href="link.url"
          :class="anchorClasses"
          @click.prevent="handleNavigation(link)"
        >
          {{ link.name }}
          <span :class="underlineClasses"></span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useNavigationStore } from '@/stores/useNavigationStore'

const emit = defineEmits(['linkClicked'])
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const navigationStore = useNavigationStore()
const router = useRouter()
const route = useRoute()

const resetToHome = () => {
  router.push('/')
}

const emitLinkClicked = linkName => {
  emit('linkClicked', linkName)
}

const handleClick = (link, event) => {
  emitLinkClicked(link.name)
  if (link.onClick) {
    link.onClick(event)
  }
}

const handleNavigation = link => {
  emitLinkClicked(link.name)
  if (link.url.startsWith('#')) {
    const sectionId = link.url.replace('#', '')
    navigationStore.navigateToSection(sectionId)
  } else {
    router.push(link.url)
  }
}

// Base des liens publics
const baseLinks = ref([
  { name: 'Programmation', url: '#programmation' },
  { name: 'Concert', url: '#concert' },
  { name: 'Billeterie', url: '#billeterie' },
  { name: 'Carte', url: '#carte' },
  { name: 'Forum', url: '#forum' },
  { name: 'Partenaires', url: '#partenaires' },
  { name: 'Reseaux', url: '#reseaux' },
  {
    name: 'Home',
    url: '/',
    onClick: event => {
      event.preventDefault()
      resetToHome()
    },
  },
])

// Lien protégé par authentification (Auth0)
const gestionLink = { name: 'Gestion', url: '/gestion', requiresAuth: true, isRouterLink: true }

// Liens visibles selon l'état d'authentification
const visibleLinks = computed(() => {
  const links = [...baseLinks.value]
  // Ajoute "Gestion" uniquement si l'utilisateur est authentifié (authStore.isAuthenticated via Auth0)
  if (isAuthenticated.value) {
    links.push(gestionLink)
  }
  return links
})

const linkClasses = 'transform transition duration-200 hover:scale-125'
const anchorClasses = 'relative group'
const underlineClasses =
  'absolute -bottom-1 left-0 w-0 h-1 bg-_green03 transition-all group-hover:w-full group-focus:w-full'
</script>
