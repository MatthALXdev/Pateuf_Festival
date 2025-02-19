// @ts-nocheck
import { ref } from 'vue'
import netlifyIdentity from 'netlify-identity-widget'

const user = ref(null)

netlifyIdentity.on('init', u => {
  console.log('🔍 Netlify Identity initialized:', u)
  user.value = u
})
netlifyIdentity.on('login', u => {
  console.log('✅ User logged in:', u)
  user.value = u
})

netlifyIdentity.on('logout', () => {
  console.log('🚪 User logged out')
  user.value = null
})

export function useAuth() {
  return {
    user,
    login: () => {
      console.log('🟢 Opening Netlify Identity login modal')
      netlifyIdentity.open()
    },
    logout: () => {
      console.log('🔴 Logging out user')
      netlifyIdentity.logout()
    },
  }
}
