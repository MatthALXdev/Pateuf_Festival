<template>
  <nav>
    <ul
      class="list-none flex flex-col text-2xl items-center justify-evenly gap-5 sm:flex-row sm:text-sm md:text-base pr-4"
    >
      <li v-for="(link, index) in links" :key="index" :class="linkClasses">
        <template v-if="!link.requiresAuth || store.isAuthenticated">
          <router-link
            v-if="link.isRouterLink"
            :to="link.url"
            :class="anchorClasses"
            @click.native="handleNavigation(link)"
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
        </template>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { defineEmits } from 'vue'

const emit = defineEmits(['linkClicked'])
const store = useAuthStore()
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

const links = [
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
  {
    name: 'Gestion',
    url: '/gestion',
    requiresAuth: true,
    isRouterLink: true,
  },
]

const linkClasses = 'transform transition duration-200 hover:scale-125'
const anchorClasses = 'relative group'
const underlineClasses =
  'absolute -bottom-1 left-0 w-0 h-1 bg-_green03 transition-all group-hover:w-full group-focus:w-full'
</script>
