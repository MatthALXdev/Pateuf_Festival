<template>
  <div class="flex h-screen w-screen bg-_beige02 items-center justify-center">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-center text-2xl font-semibold mb-6">Connexion</h1>

      <!-- Etat de chargement Auth0 -->
      <div v-if="authLoading" class="text-center text-sm opacity-70 mb-4">Initialisation d'Auth…</div>

      <form class="flex flex-col space-y-4" @submit.prevent>
        <!-- Bouton Login -->
        <button
          type="button"
          @click="handleLogin"
          :disabled="authLoading || authStore.loading || isAuthenticated"
          class="w-full py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          :class="[
            (authLoading || authStore.loading || isAuthenticated)
              ? 'bg-_beige02/60 cursor-not-allowed'
              : 'bg-_beige02 hover:bg-opacity-90 focus:ring-_beige02'
          ]"
        >
          <span v-if="!isAuthenticated">Connexion avec Auth0</span>
          <span v-else>Déjà connecté</span>
        </button>

        <!-- Infos utilisateur -->
        <p v-if="isAuthenticated" class="text-center text-sm">
          ✅ Connecté en tant que <strong>{{ userEmail }}</strong>
        </p>

        <!-- Bouton Logout -->
        <button
          v-if="isAuthenticated"
          type="button"
          @click="handleLogout"
          :disabled="authLoading || authStore.loading"
          class="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Déconnexion
        </button>

        <!-- Erreurs -->
        <p v-if="errorMsg" class="text-center text-sm text-red-600">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const auth = useAuth0() // ✅ Toujours dans setup() (contexte d'injection OK)

const authLoading = computed(() => auth.isLoading?.value === true)
const isAuthenticated = computed(() => auth.isAuthenticated?.value === true)
const userEmail = computed(() => auth.user?.value?.email || authStore.getUser?.email || '')
const errorMsg = ref('')

// Initialiser le store d'auth avec l'instance auth0
onMounted(async () => {
  try {
    // Passe l'instance "auth" au store (qui ne doit JAMAIS appeler useAuth0 lui-même)
    await (authStore.init?.(auth) ?? Promise.resolve())
  } catch (e) {
    console.error('Erreur init authStore:', e)
  }
})

// Redirection vers /gestion après authentification effective
watch(
  () => ({ loading: authLoading.value, ok: isAuthenticated.value }),
  async ({ loading, ok }) => {
    if (!loading && ok) {
      // Optionnel : attendre un court instant pour que le store récupère le token
      await new Promise(r => setTimeout(r, 50))
      router.push('/gestion')
    }
  },
  { immediate: true },
)

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    if (isAuthenticated.value) return
    // Appel via store (qui forward vers auth.loginWithRedirect)
    if (typeof authStore.login === 'function') {
      await authStore.login(auth)
    } else {
      // Fallback si le store n'est pas encore refactoré
      await auth.loginWithRedirect?.()
    }
  } catch (error) {
    console.error('❌ Erreur lors de la connexion :', error)
    errorMsg.value = 'Impossible de démarrer la connexion.'
  }
}

const handleLogout = async () => {
  errorMsg.value = ''
  try {
    if (typeof authStore.logout === 'function') {
      await authStore.logout(auth)
    } else {
      await auth.logout?.({ logoutParams: { returnTo: window.location.origin } })
    }
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion :', error)
    errorMsg.value = 'Impossible de se déconnecter.'
  }
}
</script>
