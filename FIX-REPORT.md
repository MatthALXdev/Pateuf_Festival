# 🛠️ Pateuf Festival - Correctif v0.2.2

## 📌 Bugs et améliorations dans cette version

- ✅ **IMG-001** : Suppression des redondances d'images (logo, fond, tickets, sponsors, zones)
- ✅ **IMG-002** : Centralisation des images dans Sanity via `siteBranding` et `zone`
- ✅ **IMG-003** : Ajout du champ `zoneRef` dans `schedule` et migration auto via script
- ✅ **IMG-004** : Refactor des stores pour utiliser `fetchSanityData.js` (function générique)
- ✅ **IMG-005** : Nettoyage des fonctions Netlify inutiles (`fetchSponsors.js`, etc.)
- ✅ **IMG-006** : Réduction des assets à 6 SVG essentiels (`marker.svg`, `cancel.svg`, réseaux sociaux)
- ✅ **IMG-007** : Images conditionnelles dans `Program_comp.vue` (catégorie music vs. zone)

## 🚀 Plan d'action pour `fix/dev04-images-sanity`

1. **Vérifier tous les composants affectés : `Program`, `Partners`, `Header`, `TicketCarousel`**
2. **Tester la récupération et l’affichage correct des images sur Netlify (`netlify dev` + Deploy Preview)**
3. **Supprimer les fonctions inutiles après refactor**
4. **Fusionner `fix/dev04-images-sanity` dans `dev04`**
5. **Taguer `v0.2.2` et documenter les évolutions dans `CHANGELOG.md`**

## 🔍 Suivi des tests

| Ticket  | Implémenté | Test local (`netlify dev`) | Test Netlify | Résultat   |
| ------- | ---------- | -------------------------- | ------------ | ---------- |
| IMG-001 | ✅ Oui     | ✅                         | ✅           | ✅ Corrigé |
| IMG-002 | ✅ Oui     | ✅                         | ✅           | ✅ Corrigé |
| IMG-003 | ✅ Oui     | ✅ via script Node         | ✅           | ✅ Corrigé |
| IMG-004 | ✅ Oui     | ✅                         | ✅           | ✅ Corrigé |
| IMG-005 | ✅ Oui     | ✅                         | ✅           | ✅ Corrigé |
| IMG-006 | ✅ Oui     | ✅                         | ✅           | ✅ Corrigé |
| IMG-007 | ✅ Oui     | ✅                         | ✅           | ✅ Corrigé |

---

### **📅 Modifications techniques principales :**

- ✅ **Ajout de `zone.image` dans Sanity**
- ✅ **Refactor complet de `useScheduleStore.js` pour intégrer `zoneRef`**
- ✅ **Script `migrateZoneRef.js` pour faire correspondre `location` → `zoneRef` automatiquement (83 entrées)**
- ✅ **Mise à jour des composants `Program_comp.vue`, `Partners_comp.vue`, `TicketCarousel.vue`, `Header_comp.vue`**
- ✅ **Ajout d'une logique conditionnelle : si `music` → `schedule.image`, sinon → `zone.image`**

📌 **Branche** : `fix/dev04-images-sanity`  
🌐 **Objectif** : préparer la version `v0.2.2` avant fusion vers `dev04` et publication.
