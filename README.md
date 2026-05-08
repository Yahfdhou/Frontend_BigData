# Amazon Reviews Frontend (Nuxt 3 + Tailwind)

Frontend analytique moderne pour consommer l'API Flask exposee sur `http://localhost:5000`.

## Fonctionnalites implementees

- Pages:
  - `/dashboard` -> metriques globales (`/api/stats`)
  - `/online` -> flux live (`/api/live`) + metriques (`/api/stats`) avec polling 10s
  - `/offline` -> dataset batch (`/api/offline`) + metriques (`/api/stats`)
- Service API centralise dans `app/composables/useApi.ts`
- Types TypeScript dedies dans `app/types/api.ts`
- Normalisation live/offline pour un rendu unifie:
  - `text = item.text || item.Text`
  - `score = item.score ?? item.Score`
  - `summary = item.summary || item.Summary`
- Etats UX complets: loading, error, empty
- Dashboard visuel moderne (layout, cartes, table, badges sentiment)
- Icones via `lucide-vue-next`

## Configuration

Creer un fichier `.env` a la racine:

```bash
NUXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Le frontend utilise cette valeur pour les appels API. Un `nitro.devProxy` est configure pour `/api` en developpement.

## Lancer le projet

```bash
npm install
npm run dev
```

Application disponible sur `http://localhost:3000`.

## Build production

```bash
npm run build
npm run preview
```

## Structure principale

```text
app/
  app.vue
  assets/css/input.css
  composables/useApi.ts
  components/
    layout/TopNav.vue
    predictions/
      PredictionsTable.vue
      SentimentBadge.vue
    stats/
      StatCard.vue
      StatsOverview.vue
  layouts/default.vue
  pages/
    index.vue
    dashboard.vue
    online.vue
    offline.vue
  types/api.ts
```
