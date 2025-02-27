import { defineStore } from 'pinia'
import netlifyIdentity from 'netlify-identity-widget'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    authenticated: false,
  }),
  actions: {
    init() {
      if (!window.netlifyIdentity) {
        netlifyIdentity.init({
          APIUrl: 'https://pateuf-dev.netlify.app/.netlify/identity',
        })
      }

      netlifyIdentity.on('init', u => {
        this.setUser(u)
      })

      netlifyIdentity.on('login', u => {
        this.setUser(u)
        netlifyIdentity.close()
      })

      netlifyIdentity.on('logout', () => {
        this.clearUser()
      })

      netlifyIdentity.on('user', u => {
        // ✅ Écoute les changements de session
        this.setUser(u)
      })
    },
    setUser(user) {
      this.user = user
      this.authenticated = !!user
      if (user) {
        sessionStorage.setItem('authUser', JSON.stringify(user)) // ✅ Stocke dans sessionStorage
      } else {
        sessionStorage.removeItem('authUser')
      }
    },
    clearUser() {
      this.user = null
      this.authenticated = false
      sessionStorage.removeItem('authUser') // ✅ Supprime après déconnexion
    },
    login() {
      netlifyIdentity.open('login')
    },
    logout() {
      netlifyIdentity.logout()
      this.clearUser()
    },
    restoreSession() {
      const storedUser = sessionStorage.getItem('authUser')
      if (storedUser) {
        this.user = JSON.parse(storedUser)
        this.authenticated = true
      } else {
        this.authenticated = false // ✅ Assurer la mise à jour correcte
      }
    },
  },
  getters: {
    isAuthenticated: state => state.authenticated,
  },
})
