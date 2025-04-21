# 📘 README - Branche `dev04`

## 🧭 Objectif de la branche `dev04`

Branche principale de **staging** :

- Sert de base pour tester les fonctionnalités en condition réelle sur Netlify.
- Déploiement continu activé sur : [https://pateuf-dev.netlify.app](https://pateuf-dev.netlify.app)
- Connectée à Netlify Identity ✅

---

## 🔒 Fonctionnalités critiques à tester ici

| Fonctionnalité         | Testable localement | Testable via `dev04` | Commentaire                              |
| ---------------------- | ------------------- | -------------------- | ---------------------------------------- |
| Netlify Identity       | ⚠️ Partiellement    | ✅ Oui               | Token, redirection, sessionStorage       |
| CRUD Sanity (admin)    | ⚠️ Pas sécurisé     | ✅ Oui               | Utilise Netlify Functions + Identity     |
| Affichage conditionnel | ✅ Oui              | ✅ Oui               | Lié aux rôles utilisateurs (admin, etc.) |
| Sécurité CSP           | ❌ Non              | ✅ Oui               | Vérifiable uniquement via headers        |

---

## 🔄 Flux de développement recommandé

### 1. Travailler sur une branche fonctionnelle locale

```bash
git checkout dev04
git pull origin dev04
git checkout -b feat/crud-schedule
```

### 2. Développer localement + tester

- Utiliser `netlify dev` pour les Netlify Functions
- Utiliser `sessionStorage` pour simuler l'utilisateur si nécessaire

### 3. Fusionner dans `dev04` pour test Netlify

```bash
git checkout dev04
git merge feat/crud-schedule
git push origin dev04
```

---

## 🧪 Suivi des tests `dev04`

| Feature            | Branche source       | Statut      | Test Netlify   |
| ------------------ | -------------------- | ----------- | -------------- |
| Authentification   | `dev04`              | ✅ Stable   | ✅ OK          |
| Schedule CRUD      | `feat/crud-schedule` | 🔄 En cours | 🔄 À fusionner |
| Filtres Mapbox     | `fix/v0.2.1`         | ✅ Validé   | ✅ Corrigé     |
| Filtrage par rôles | `feat/roles-access`  | 🔜 À tester | 🔄 Prévu       |

---

## 🧼 Bonnes pratiques

- Toujours **pull la dernière version de \*\***`dev04`\*\* avant de créer une nouvelle branche
- Ne pas coder de fonctionnalités complexes directement sur `dev04`
- Tester localement avant de merge
- Fusionner **uniquement quand la fonctionnalité est prête à être testée sur Netlify**

---

📦 Fichier mis à jour le : 21 avril 2025
