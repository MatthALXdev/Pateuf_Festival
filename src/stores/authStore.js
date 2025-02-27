import { defineStore } from 'pinia'
import netlifyIdentity from 'netlify-identity-widget'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    authenticated: false,
  }),
  actions: {
    init() {
      netlifyIdentity.on('init', u => {
        this.user = u
        this.authenticated = !!u
      })

      netlifyIdentity.on('login', u => {
        this.user = u
        this.authenticated = !!u
        netlifyIdentity.close()
      })

      netlifyIdentity.on('logout', () => {
        this.user = null
        this.authenticated = false
      })
      // En mode développement, on force l'URL Netlify Identity
      // (À supprimer ou masquer en prod si la détection automatique fonctionne)
      netlifyIdentity.init({
        APIUrl: 'https://pateuf-dev.netlify.app/.netlify/identity',
      })
    },
    login() {
      netlifyIdentity.open('login')
    },
    logout() {
      netlifyIdentity.logout()
    },
  },
  getters: {
    isAuthenticated: state => state.authenticated,
  },
})
