<template>
  <div class="flex h-screen w-screen bg-_beige02 items-center justify-center">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-center text-2xl font-semibold mb-6">Connexion</h1>
      <form class="flex flex-col space-y-4" @submit.prevent="handleLogin">
        <button
          type="button"
          @click="handleLogin"
          class="w-full py-2 px-4 bg-_beige02 text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-_beige02"
        >
          Connexion avec Netlify Identity
        </button>
        <p v-if="authStore.isAuthenticated">
          ✅ Connecté en tant que {{ authStore.user?.email }}
        </p>
        <button
          v-if="authStore.isAuthenticated"
          @click="handleLogout"
          class="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Déconnexion
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Initialiser Netlify Identity et écouter les changements
onMounted(() => {
  authStore.init()
})

// Surveiller tout changement d'authentification
watch(
  () => authStore.isAuthenticated,
  newVal => {
    if (newVal) {
      console.log('✅ Authentification réussie, redirection vers /gestion')
      router.push('/gestion')
    }
  },
)

const handleLogin = async () => {
  try {
    console.log('🔄 Tentative de connexion...')
    await authStore.login()
    console.log('✅ Connexion réussie !')
  } catch (error) {
    console.error('❌ Erreur lors de la connexion :', error)
  }
}

const handleLogout = async () => {
  try {
    console.log('🔄 Déconnexion en cours...')
    authStore.logout(router) // ✅ Passe le router pour gérer la redirection

    // ✅ Ne pas rouvrir automatiquement Netlify Identity après la déconnexion
    console.log('✅ Déconnexion réussie !')
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion :', error)
  }
}
</script>
