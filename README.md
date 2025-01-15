# pateuf-festival - dev04

- [ ] Implementation CMS
- Choose CMS and justification
- Host json
- Connect to the project
- Test and document
- [ ] Comment the code

## Ways to improve the design

- Implementation of a new, more advanced design for the map detail
  component - **medium priority**
- Banner_comp font size on large screen - **minimum priority**
- Make the background colors of the components clearer and more natural **medium priority**
- Loading screen **minimum priority**

## Upgrade to be done:

- Comment the code **high priority**
- Identify the code that can be refactored (redundancy and modularity)**medium priority**
- Nav_bar component link **medium priority**
- Network and partner link**medium priority**
- Management of a global state with store **medium priority**
- Implementation CMS **high priority**

## Configuration

1. Créez un compte sur [Mapbox](https://www.mapbox.com/) si vous n'en avez pas déjà un.
2. Générez une clé d'accès en suivant les instructions sur le tableau de bord Mapbox.
3. Clonez ce dépôt.
4. Créez un fichier `.env` à la racine du projet en utilisant le fichier `.env.example` comme modèle.
5. Remplissez votre clé d'accès dans le fichier `.env` :

   ```plaintext
   VITE_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here

   ```

6. Lancez le projet avec les commandes habituelles :

```sh
npm install
npm run dev
```
