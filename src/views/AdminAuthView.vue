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
        <p v-if="user">✅ Connecté en tant que {{ user.email }}</p>
        <button
          v-if="user"
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
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { watch, onMounted } from 'vue'

const { login, logout, user } = useAuth()
const router = useRouter()

// Vérifier l'utilisateur au chargement initial
onMounted(() => {
  console.log("🔍 Vérification de l'utilisateur au chargement :", user.value)
})

// Rediriger l'utilisateur s'il est connecté
watch(user, newUser => {
  console.log("👀 Changement d'utilisateur détecté :", newUser)
  if (newUser) {
    console.log('✅ Authentification réussie, redirection vers /gestion')
    router.push('/gestion')
  }
})

// Gestion des erreurs de connexion/déconnexion
const handleLogin = async () => {
  try {
    console.log('🔄 Tentative de connexion...')
    await login()
    console.log('✅ Connexion réussie !')
  } catch (error) {
    console.error('❌ Erreur lors de la connexion :', error)
  }
}

const handleLogout = async () => {
  try {
    console.log('🔄 Déconnexion en cours...')
    await logout()
    console.log('✅ Déconnexion réussie !')
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion :', error)
  }
}
</script>
