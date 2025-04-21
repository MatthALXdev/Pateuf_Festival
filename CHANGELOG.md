# 📦 CHANGELOG - Pateuf Festival

Toutes les modifications notables du projet **Pateuf Festival** sont documentées ici.

---

## [v0.2.1] - 2025-04-21

### ✅ Correctifs

- **BUG-001** : Correction de l'intégration des Google Fonts via la directive CSP dans `_headers`
- **BUG-002** : Affichage des logos corrigé dans le composant `Program_comp.vue` + mise à jour du store `useNewsStore.js`
- **BUG-003** : La carte Mapbox se charge correctement sur Netlify (correction des sources/layers)
- **BUG-004** : Problèmes d'affichage des iframes Netlify Identity résolus (styles + dimensions)

### 🧼 Nettoyage

- Suppression des fichiers obsolètes : `public/data/*.ndjson` et `public/data/*.json`
- Refactorisation du schéma `schedule.js` (Sanity) et ajout du type `category.js`
- Mise à jour des dépendances locales non critiques

### 🛡️ Sécurité & Performance

- Conformité CSP pour les polices et intégrations externes (`_headers`)

### 📦 Déploiement

- Branche : `fix/v0.2.1`
- Tag Git : `v0.2.1`
- Déployé sur Netlify via branche connectée

---

## [v0.2.0] - 2025-02-28

### 🚀 Fonctionnalités

- Intégration complète de Netlify Identity pour la gestion des connexions
- Protection des routes `/gestion` via authentification
- Intégration des stores Sanity (`faq`, `info`, `location`, etc.) via Pinia
- Affichage dynamique des données sur la carte Mapbox (front + back)

### ⚙️ Configuration

- Ajout de `sanity.json` côté studio
- Intégration des tokens dans les variables d'environnement Netlify
- Configuration des Netlify Functions pour sécuriser les accès aux données

### 🎨 UI/UX

- Intégration TailwindCSS avec composants stylés (NavList, Program, Map, etc.)
- Responsive design adapté mobile/tablette

---

## 📌 À venir

- [ ] `v0.2.2` : Gestion améliorée des erreurs côté back et authentification
- [ ] `v0.3.0` : Interface d’édition sécurisée en production (CRUD sur Sanity via fonctions Netlify + JWT)

---

🗓️ Mis à jour le : 21 avril 2025
