import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: localStorage.getItem('authenticated') === 'true', // Vérification locale
  }),
  actions: {
    login() {
      this.authenticated = true
      sessionStorage.setItem('authenticated', 'true') // Sauvegarde dans localStorage
    },
    logout() {
      this.authenticated = false
      sessionStorage.removeItem('authenticated') // Suppression après déconnexion
    },
  },
})
