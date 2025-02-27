# Changelog

## [0.2.0] - 2025-02-27

### 🔥 Nouvelles fonctionnalités :

- Implémentation de Netlify Identity pour l’authentification.
- Ajout d’un système de redirection sécurisé via `watch` dans `GestionView.vue`.
- Mise en place d'une gestion des logs pour améliorer le suivi des erreurs et actions utilisateurs.

### 🛠 Améliorations :

- Suppression du stockage des tokens dans `localStorage` (passage à `sessionStorage`).
- Nettoyage du code dans `authStore.js` pour améliorer la gestion des sessions.

### 🐛 Corrections :

- Correction d’un bug où l’authentification n'était pas restaurée après un refresh.
- Fix d’une redirection infinie sur `/adminAuth` après déconnexion.
