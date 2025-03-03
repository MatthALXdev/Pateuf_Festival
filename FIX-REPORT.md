# 🛠️ Pateuf Festival - Correctif v0.2.1

## 📌 Bugs corrigés dans cette version

- ✅ **BUG-001** : Correction des polices Google Fonts (CSP)
- ✅ **BUG-004** : Correction des styles et de l’affichage des iframes Netlify Identity
- ✅ **BUG-002** : Correction des logos non affichés
- 🔄 **BUG-003** : Correction de la carte Mapbox qui ne charge pas (Test en cours sur Netlify)

## 🚀 Plan d'action

1. **Tester et valider chaque correction en local (`netlify dev`).**
2. **Déployer une première itération sur Netlify pour vérification.**
3. **Fusionner `fix/v0.2.1` dans `dev04` une fois tous les tests validés.**
4. **Taguer `v0.2.1` et la déployer en production.**

## 🔍 Suivi des tests

| Bug     | Correction appliquée | Test Netlify Deploy Preview | Résultat     |
| ------- | -------------------- | --------------------------- | ------------ |
| BUG-001 | ✅ Oui               | ✅ Testé sur Netlify        | ✅ Corrigé   |
| BUG-004 | ✅ Oui               | ✅ Testé sur Netlify        | ✅ Corrigé   |
| BUG-002 | ✅ Oui               | ✅ Testé sur Netlify        | ✅ Corrigé   |
| BUG-003 | 🔄 En cours          | 🔄 Tentative en cours       | ❌ Non testé |

---

📌 **Tous les correctifs liés à la CSP sont faits dans `_headers`**.

### **📌 Modifications principales :**

- ✅ **Suppression des anciens fichiers `public/data/*.ndjson` et `public/data/*.json` obsolètes.**
- ✅ **Mise à jour de `sanity/schemaTypes/schedule.js` pour corriger la gestion des images et catégories.**
- ✅ **Ajout de `sanity/schemaTypes/category.js` pour structurer les catégories et leurs logos.**
- ✅ **Mise à jour de `useScheduleStore.js` pour refléter les changements dans `schedule.js`.**
- ✅ **Modification de `Program_comp.vue` pour s'adapter aux nouvelles références `category.logo`.**

📌 **Cette branche `fix/v0.2.1` est dédiée à la correction des bugs de `v0.2.0`.**  
📌 **Une fois stable, elle sera fusionnée dans `dev04` pour la sortie officielle de `v0.2.1`.**
