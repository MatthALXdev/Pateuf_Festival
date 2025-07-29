// src/composables/useSanitySync.js
import { ref, watch } from 'vue'

// Référence partagée pour détecter les mises à jour Sanity\const lastSanityUpdate = ref(Date.now())
const lastSanityUpdate = ref(Date.now())
/**
 * Utilitaire global pour synchroniser les composants avec les modifications Sanity.
 * @param {Function} callback - Fonction à exécuter lorsqu'une mise à jour est détectée.
 * @returns {Object} - Méthode notifySanityUpdate à appeler après une modif côté admin.
 */
export function useSanitySync(callback) {
  // Fonction appelée dans les composants admin pour signaler un changement
  const notifySanityUpdate = () => {
    lastSanityUpdate.value = Date.now()
  }

  // Watcher global : déclenché dans les composants visiteurs
  watch(lastSanityUpdate, () => {
    if (typeof callback === 'function') {
      const scrollY = window.scrollY
      callback().then(() => {
        window.scrollTo({ top: scrollY, behavior: 'auto' })
      })
    }
  })

  return { notifySanityUpdate }
}
