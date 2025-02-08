// @ts-nocheck
import { ref } from 'vue'
import netlifyIdentity from 'netlify-identity-widget'

const user = ref(null)

netlifyIdentity.on('init', u => {
  user.value = u
})
netlifyIdentity.on('login', u => {
  user.value = u
})

netlifyIdentity.on('logout', () => {
  user.value = null
})

export function useAuth() {
  return {
    user,
    login: () => netlifyIdentity.open(),
    logout: () => netlifyIdentity.logout(),
  }
}
