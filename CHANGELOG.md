# 📦 CHANGELOG - Pateuf Festival

Toutes les modifications notables du projet **Pateuf Festival** sont documentées ici.

---
## [v0.2.2] - 2025-05-10

### 🚀 Fonctionnalités

- Centralisation des images dynamiques (logo, fond, tickets, sponsors, zones) via Sanity
- Création du schéma `siteBranding` dans Sanity pour la gestion du logo, fond et visuels de ticket
- Ajout du champ `image` dans le schéma `zone` pour illustrer les lieux
- Ajout du champ `zoneRef` dans `schedule` (référence à une `zone` Sanity)
- **Mise en place du CRUD générique Sanity :**
  - Netlify Function `updateSanityDoc.js` (mutation PATCH réutilisable)
  - Composable Vue 3 `useSanityCrud.js` pour toutes les collections (`info`, `faq`, etc.)
  - Réécriture du composant `EditInfo.vue` pour intégrer ce système

### 🔄 Refactorisation

- Refactor des stores `useBrandingStore`, `useSponsorStore`, `useScheduleStore` pour utiliser une Netlify Function unique : `fetchSanityData.js`
- Suppression des fonctions spécifiques obsolètes : `fetchBranding.js`, `fetchSponsors.js`
- Nettoyage du dossier `src/assets/images` : il ne reste que les fichiers SVG essentiels (marker, cancel, réseaux sociaux)
- Mise à jour du composant `social_comp.vue` :
  - Chemins d’images corrigés (`/images/social/`)
  - Amélioration de l’accessibilité (`alt="logo de {img}"`)
- Mise à jour de Vite : version `5.4.14` → `5.4.19`

### 🌎 Migration & Données

- Création du script `migrateZoneRef.js` permettant de remplir automatiquement `zoneRef` à partir du champ `location` (83 entrées traitées)

### 🏙️ Composants modifiés

- `Header_comp.vue`, `Banner_comp.vue`, `TicketCarousel.vue`, `Partners_comp.vue`, `Program_comp.vue`, `social_comp.vue`, `EditInfo.vue`
  → Tous utilisent désormais des données ou images issues de Sanity

### 🔐 Sécurité

- Les requêtes de modification Sanity utilisent `SANITY_ACCESS_ADMIN_TOKEN` uniquement côté serveur
- Préparation de l’authentification Netlify Identity pour restreindre les actions d’écriture

### 📅 Déploiement

- Branche : `dev04`
- Fusion des branches `fix/dev04-images-sanity` + CRUD générique Sanity
- Tag Git : `v0.2.2`
- Déployé sur Netlify pour tests en conditions réelles

### ⚠️ BREAKING CHANGE

- Toute modification de données Sanity nécessite désormais :
  - Une authentification via Netlify Identity
  - Le bon paramétrage des variables d’environnement (`SANITY_ACCESS_ADMIN_TOKEN`)

## [v0.2.2] - 2025-05-08

### 🚀 Fonctionnalités

- Centralisation des images dynamiques (logo, fond, tickets, sponsors, zones) via Sanity
- Création du schéma `siteBranding` dans Sanity pour la gestion du logo, fond et visuels de ticket
- Ajout du champ `image` dans le schéma `zone` pour illustrer les lieux
- Ajout du champ `zoneRef` dans `schedule` (référence à une `zone` Sanity)
- Refactor du store `useScheduleStore` pour inclure les données de `zoneRef` (nom + image)
- Refactor du composant `Program.vue` : affichage conditionnel de l'image `schedule.image` ou `zone.image` selon la catégorie
- Nouveau composant dynamique pour les sponsors : récupération via le store `useSponsorStore` et Sanity

### 🔄 Refactorisation

- Refactor des stores `useBrandingStore`, `useSponsorStore`, `useScheduleStore` pour utiliser une Netlify Function unique : `fetchSanityData.js`
- Suppression des fonctions spécifiques obsolètes : `fetchBranding.js`, `fetchSponsors.js`
- Nettoyage du dossier `src/assets/images` : il ne reste que les fichiers SVG essentiels (marker, cancel, réseaux sociaux)

### 🌎 Migration & Données

- Création du script `migrateZoneRef.js` permettant de remplir automatiquement `zoneRef` à partir du champ `location` (83 entrées traitées)

### 🏙️ Composants modifiés

- `Header_comp.vue`, `Banner_comp.vue`, `TicketCarousel.vue`, `Partners_comp.vue`, `Program_comp.vue`
  → Tous utilisent désormais les images dynamiques issues de Sanity

### 📅 Déploiement

- Branche : `fix/dev04-images-sanity`
- Fusion prévue dans `dev04`
- En attente de tag `v0.2.2`

---

## [v0.2.1] - 2025-04-21

### ✅ Correctifs

- **BUG-001** : Correction de l'intégration des Google Fonts via la directive CSP dans `_headers`
- **BUG-002** : Affichage des logos corrigé dans le composant `Program_comp.vue` + mise à jour du store `useNewsStore.js`
- **BUG-003** : La carte Mapbox se charge correctement sur Netlify (correction des sources/layers)
- **BUG-004** : Problèmes d'affichage des iframes Netlify Identity résolus (styles + dimensions)

### 𞷼 Nettoyage

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

- [ ] `v0.2.3` : Internationalisation partielle des vues principales
- [ ] `v0.3.0` : Interface d’édition sécurisée en production (CRUD sur Sanity via fonctions Netlify + JWT)

---

🗓️ Mis à jour le : 10 mai 2025
