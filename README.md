# Amazon Reviews Frontend

Dashboard analytique moderne construit avec Nuxt 3 pour explorer les avis Amazon, les sentiments et les prédictions du backend Flask. L’interface utilise un style visuel soigné avec des cartes, des dégradés légers et des animations discrètes pour rendre la navigation plus fluide.

## Ce que fait l’application

- Centralise les appels API dans `app/composables/useApi.ts`.
- Normalise les réponses live et offline pour un rendu homogène.
- Affiche les métriques globales, les flux temps réel, les datasets batch et les meilleurs / pires avis.
- Fournit une interface claire avec cartes, badges, tableaux et graphiques.

## Stack technique

- Nuxt 3
- Vue 3 Composition API
- TypeScript
- Tailwind CSS
- Chart.js + vue-chartjs
- lucide-vue-next

## Architecture

```text
app/
  assets/css/         Styles globaux
  composables/        Couche d’accès API et logique partagée
  components/         Composants UI par domaine
    charts/           Graphiques
    model/            Exploration des prédictions
    predictions/      Tableaux et badges sentiment
    stats/            Cartes de statistiques
    ui/               Composants transverses
  layouts/            Layouts Nuxt
  middleware/         Protection des routes
  pages/              Routes de l’application
  types/              Contrats TypeScript de l’API
server/api/           Proxy backend et routes serveur
```

## Pages principales

- `/dashboard` : statistiques globales.
- `/online` : flux live avec actualisation.
- `/offline` : analyse batch.
- `/model` : métriques et exploration des prédictions.
- `/predictions` : prédictions et avis les plus pertinents.
- `/sentiments` : vue synthétique des sentiments.

## Configuration

Créer un fichier `.env` à la racine si nécessaire:

```bash
NUXT_PUBLIC_API_BASE_URL=http://3.88.50.172:5000
```

Le frontend utilise cette variable pour cibler l’API. Le proxy Nitro est configuré dans `nuxt.config.ts` pour simplifier le développement local.

Si vous lancez l’API sur votre machine, remplacez l’adresse IP par `localhost` pour que l’application fonctionne en local:

```bash
NUXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Fichiers où l’IP est configurée

- `nuxt.config.ts` : définit la valeur par défaut de `apiBaseUrl` et le proxy Nitro. C’est le point principal à modifier si vous changez d’environnement.
- `app/composables/useApi.ts` : utilise aussi une valeur de secours pour appeler le backend si la variable d’environnement n’est pas définie.
- `app/composables/useAuth.ts` : contient la même logique de secours pour les appels liés à l’authentification.

Si votre backend tourne en local, il faut donc remplacer l’IP distante par `localhost` dans ces fichiers ou, mieux, définir `.env` avec `NUXT_PUBLIC_API_BASE_URL=http://localhost:5000`.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Build production

```bash
npm run build
npm run preview
```

## API utilisées

- `GET /api/stats`
- `GET /api/live`
- `GET /api/offline`
- `GET /api/sentiments`
- `GET /api/sentiments/distribution`
- `GET /api/predictions/best`
- `GET /api/predictions/worst`
- `POST /api/predict`

## Notes de projet

- Les types API sont regroupés dans `app/types/api.ts`.
- Les composants privilégient la Composition API et `<script setup>`.
- Les dossiers générés par Nuxt (`.nuxt/`, `.output/`) ne doivent pas être modifiés à la main.
