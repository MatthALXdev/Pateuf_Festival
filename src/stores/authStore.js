import { defineStore } from 'pinia'

/**
 * 🔐 Store Pinia pour Auth0 (sans useAuth0 dans le store)
 * - Le composant appelle useAuth0() et passe l'instance "auth" en paramètre
 * - API : init(auth), login(auth), logout(auth), refreshToken(auth)
 * - États : user, token, authenticated, loading, error
 */
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    token: null,
    authenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: state => state.authenticated,
    getUser: state => state.user,
    getToken: state => state.token,
  },

  actions: {
    /**
     * Initialise l'état d'auth à partir de l'instance Auth0 passée par le composant
     */
    async init(auth) {
      if (!auth) throw new Error('Auth0 instance manquante : passez `auth` depuis le composant (useAuth0()).')
      this.loading = true
      this.error = null
      try {
        this.authenticated = !!auth.isAuthenticated?.value
        this.user = auth.user?.value || null
        if (this.authenticated && typeof auth.getAccessTokenSilently === 'function') {
          this.token = await auth.getAccessTokenSilently()
        } else {
          this.token = null
        }
      } catch (e) {
        console.error('authStore.init error:', e)
        this.error = 'init_failed'
      } finally {
        this.loading = false
      }
    },

    /** Démarre le flux de connexion Auth0 */
    async login(auth) {
      if (!auth?.loginWithRedirect) throw new Error('Auth0 instance manquante pour login')
      await auth.loginWithRedirect({
        appState: { target: '/gestion' }
      })
    },

    /** Déconnecte et réinitialise l'état local */
    async logout(auth) {
      if (!auth?.logout) throw new Error('Auth0 instance manquante pour logout')
      await auth.logout({ logoutParams: { returnTo: window.location.origin } })
      this.$reset()
    },

    /** Récupère/rafraîchit l'access_token à la demande */
    async refreshToken(auth) {
      if (!auth?.getAccessTokenSilently) throw new Error('Auth0 instance manquante pour refreshToken')
      try {
        const t = await auth.getAccessTokenSilently()
        this.token = t
        this.authenticated = true
        return t
      } catch (e) {
        console.warn('refreshToken failed:', e)
        this.token = null
        return null
      }
    },
  },
})
