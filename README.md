<!-- Banner -->
<p align="center">
  <img src="/project-brand.svg" alt="Project" width="320" />
</p>

# Amazon Reviews Frontend 



---

<!-- Bannière -->
<p align="center">
  <img src="/project-brand.svg" alt="Project" width="320" />
</p>

# Amazon Reviews Frontend — Interface analytique moderne

Une interface claire et moderne construite avec Nuxt 3 pour explorer les avis Amazon, visualiser les sentiments et analyser les prédictions du backend Flask.

- تنظيم مركزي لاستدعاءات API في `app/composables/useApi.ts`.
- توحيد صيغ الردود (live / offline) للعرض بشكل متناسق.
- صفحات: لوحة التحكم، التدفق الحي، التحليل الدفعي، استكشاف النماذج، والآراء الأفضل/الأسوأ.
## Vue d'ensemble

- Centralisation des appels API dans `app/composables/useApi.ts`.
- Normalisation des réponses (live / offline) pour un rendu homogène.
- Pages principales : dashboard, online (flux), offline (batch), model, predictions, sentiments.

## Installation rapide

```bash
npm install
# Si votre backend tourne localement :
export NUXT_PUBLIC_API_BASE_URL=http://localhost:5000
npm run dev
```

Ouvrir `http://localhost:3000`.

## Fichiers où l’IP peut apparaître

- `nuxt.config.ts` — valeur par défaut de `apiBaseUrl` et proxy Nitro.
- `app/composables/useApi.ts` — valeur de secours utilisée si la variable d’environnement est absente.
- `app/composables/useAuth.ts` — mêmes valeurs de secours pour les endpoints d’auth.

Conseil : définissez `NUXT_PUBLIC_API_BASE_URL=http://localhost:5000` pour le développement local.

## Design & UI — couleurs et animations

L’application utilise une palette douce avec accents colorés pour les états. Exemple Tailwind :

- Cartes positives : `bg-emerald-50` / `border-emerald-200`
- Cartes neutres : `bg-amber-50` / `border-amber-200`
- Cartes négatives : `bg-rose-50` / `border-rose-200`

Exemple de carte avec micro-interaction :

```html
<div class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 transition hover:shadow-lg hover:scale-[1.01]">
  <!-- contenu -->
</div>
```

Ajouter une animation dans `tailwind.config.ts` (extrait) :

```js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 250ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
```

## Structure résumée

```text
app/
  composables/
  components/
  pages/
  types/
```

---

Souhaites-tu que j’ajoute :
1. Un bandeau SVG/PNG dans `public/` pour améliorer l’apparence GitHub.
2. Un composant d’exemple `components/ui/AnimatedCard.vue` utilisant les animations.
3. Une version anglaise du README.


