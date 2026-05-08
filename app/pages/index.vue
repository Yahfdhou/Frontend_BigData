<script setup lang="ts">
import { ArrowRight, Zap, Brain, TrendingUp, BarChart3, Shield } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Large animated orbs -->
      <div class="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-300/30 to-cyan-200/20 blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-tl from-indigo-300/30 to-purple-200/20 blur-3xl" style="animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/2 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200/25 to-blue-200/15 blur-3xl" style="animation: pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite; animation-delay: 2s"></div>
      
      <!-- Floating particles animation -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 h-2 w-2 rounded-full bg-indigo-400/40 animate-bounce" style="animation-delay: 0s"></div>
        <div class="absolute top-40 right-20 h-1.5 w-1.5 rounded-full bg-cyan-400/50 animate-bounce" style="animation-delay: 0.5s"></div>
        <div class="absolute top-1/3 left-1/4 h-1 w-1 rounded-full bg-blue-400/40 animate-bounce" style="animation-delay: 1s"></div>
        <div class="absolute bottom-1/3 right-1/4 h-2 w-2 rounded-full bg-indigo-300/40 animate-bounce" style="animation-delay: 1.5s"></div>
        <div class="absolute bottom-20 left-1/2 h-1.5 w-1.5 rounded-full bg-cyan-300/50 animate-bounce" style="animation-delay: 2s"></div>
      </div>

      <!-- Grid pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(90deg,_rgba(148,163,184,0.08)_1px,_transparent_1px),linear-gradient(0deg,_rgba(148,163,184,0.08)_1px,_transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <!-- Hero Section -->
      <section class="min-h-screen flex items-center justify-center px-4 py-20">
        <div class="mx-auto max-w-4xl text-center space-y-8">
          <!-- Animated title -->
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-6 py-3 backdrop-blur-sm border border-indigo-200/50 animate-fade-in">
              <Zap class="h-4 w-4 text-indigo-600" />
              <span class="text-sm font-semibold text-indigo-700">Intelligence Artificielle Appliquée</span>
            </div>

            <h1 class="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-indigo-700 to-cyan-600 bg-clip-text text-transparent animate-fade-in" style="animation-delay: 0.1s">
              Sentiment Intelligence
            </h1>

            <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style="animation-delay: 0.2s">
              Analysez les avis Amazon avec notre système avancé d'intelligence artificielle. Découvrez les sentiments cachés, identifiez les tendances et optimisez votre stratégie produit.
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in" style="animation-delay: 0.3s">
            <NuxtLink
              to="/login"
              class="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:shadow-indigo-500/60 hover:-translate-y-1"
            >
              <span>Se connecter</span>
              <ArrowRight class="h-5 w-5 transition group-hover:translate-x-1" />
            </NuxtLink>

            <NuxtLink
              to="/register"
              class="inline-flex items-center gap-2 rounded-2xl border-2 border-indigo-600 px-8 py-4 text-lg font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              <span>Créer un compte</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="relative py-24 px-4">
        <div class="mx-auto max-w-6xl">
          <div class="text-center mb-20">
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Capacités Exceptionnelles
            </h2>
            <p class="text-lg text-slate-600 max-w-2xl mx-auto">
              Notre plateforme combine machine learning, analyse de données et visualisations interactives pour vous offrir des insights incomparables.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            <!-- Feature 1 -->
            <div class="group relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-2xl hover:-translate-y-2">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/5 to-cyan-600/5 opacity-0 transition group-hover:opacity-100"></div>
              <div class="relative space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                  <Brain class="h-7 w-7" />
                </div>
                <h3 class="text-xl font-bold text-slate-900">Analyse IA Avancée</h3>
                <p class="text-slate-600">
                  Utilise des modèles de deep learning pour classifier les sentiments avec une précision exceptionnelle.
                </p>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="group relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-2xl hover:-translate-y-2">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/5 to-cyan-600/5 opacity-0 transition group-hover:opacity-100"></div>
              <div class="relative space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                  <TrendingUp class="h-7 w-7" />
                </div>
                <h3 class="text-xl font-bold text-slate-900">Tendances en Temps Réel</h3>
                <p class="text-slate-600">
                  Suivez les évolutions du marché et les opinions des clients avec des dashboards en direct.
                </p>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="group relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-2xl hover:-translate-y-2">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/5 to-cyan-600/5 opacity-0 transition group-hover:opacity-100"></div>
              <div class="relative space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <BarChart3 class="h-7 w-7" />
                </div>
                <h3 class="text-xl font-bold text-slate-900">Visualisations Riches</h3>
                <p class="text-slate-600">
                  Explorez vos données via des graphiques interactifs et des tableaux de bord customisés.
                </p>
              </div>
            </div>

            <!-- Feature 4 -->
            <div class="group relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-2xl hover:-translate-y-2">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/5 to-cyan-600/5 opacity-0 transition group-hover:opacity-100"></div>
              <div class="relative space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
                  <Shield class="h-7 w-7" />
                </div>
                <h3 class="text-xl font-bold text-slate-900">Sécurité Enterprise</h3>
                <p class="text-slate-600">
                  Vos données sont protégées avec chiffrement de bout en bout et conformité RGPD.
                </p>
              </div>
            </div>

            <!-- Feature 5 -->
            <div class="group relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-2xl hover:-translate-y-2">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/5 to-cyan-600/5 opacity-0 transition group-hover:opacity-100"></div>
              <div class="relative space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white shadow-lg">
                  <Zap class="h-7 w-7" />
                </div>
                <h3 class="text-xl font-bold text-slate-900">Performance Rapide</h3>
                <p class="text-slate-600">
                  Traitez millions d'avis en secondes avec notre infrastructure optimisée.
                </p>
              </div>
            </div>

            <!-- Feature 6 -->
            <div class="group relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-2xl hover:-translate-y-2">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/5 to-cyan-600/5 opacity-0 transition group-hover:opacity-100"></div>
              <div class="relative space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center text-white shadow-lg">
                  <TrendingUp class="h-7 w-7" />
                </div>
                <h3 class="text-xl font-bold text-slate-900">Prédictions Futures</h3>
                <p class="text-slate-600">
                  Anticipez les tendances futures avec nos modèles de prédiction avancés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ML Pipeline Section -->
      <section class="relative py-24 px-4 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent">
        <div class="mx-auto max-w-7xl">
          <div class="text-center mb-20">
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Notre Pipeline IA Avancé
            </h2>
            <p class="text-lg text-slate-600 max-w-3xl mx-auto">
              Un processus complet d'apprentissage automatique combinant PySpark, NLP et deep learning pour analyser les millions d'avis Amazon.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="group relative animate-scale-in" style="animation-delay: 0s">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 blur-xl opacity-0 transition duration-500 group-hover:opacity-75"></div>
              <div class="relative rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-lg transition group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div class="absolute right-4 top-4 text-5xl opacity-10">📊</div>
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 font-bold text-white">01</div>
                <h3 class="mb-3 text-xl font-bold text-slate-900">Chargement Données</h3>
                <p class="mb-4 text-sm text-slate-600">Ingestion de 568 000 avis Amazon via PySpark avec nettoyage et déduplication automatique.</p>
                <div class="rounded-lg bg-blue-100/50 p-2 text-xs font-mono text-blue-600">CSV → Spark DataFrame</div>
              </div>
            </div>

            <div class="group relative animate-scale-in" style="animation-delay: 0.1s">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 blur-xl opacity-0 transition duration-500 group-hover:opacity-75"></div>
              <div class="relative rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg transition group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div class="absolute right-4 top-4 text-5xl opacity-10">🧹</div>
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 font-bold text-white">02</div>
                <h3 class="mb-3 text-xl font-bold text-slate-900">Nettoyage Texte</h3>
                <p class="mb-4 text-sm text-slate-600">Suppression des caractères spéciaux, expansion des contractions, lemmatisation et gestion des négations.</p>
                <div class="rounded-lg bg-purple-100/50 p-2 text-xs font-mono text-purple-600">NLP → Clean Text</div>
              </div>
            </div>

            <div class="group relative animate-scale-in" style="animation-delay: 0.2s">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 blur-xl opacity-0 transition duration-500 group-hover:opacity-75"></div>
              <div class="relative rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-lg transition group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div class="absolute right-4 top-4 text-5xl opacity-10">⚙️</div>
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 font-bold text-white">03</div>
                <h3 class="mb-3 text-xl font-bold text-slate-900">Feature Engineering</h3>
                <p class="mb-4 text-sm text-slate-600">Création TF-IDF (8000 + 3000 features), extraction temporelle et calcul de ratios d'utilité.</p>
                <div class="rounded-lg bg-emerald-100/50 p-2 text-xs font-mono text-emerald-600">TF-IDF + Temporal</div>
              </div>
            </div>

            <div class="group relative animate-scale-in" style="animation-delay: 0.3s">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-red-400 blur-xl opacity-0 transition duration-500 group-hover:opacity-75"></div>
              <div class="relative rounded-2xl border border-orange-200/50 bg-gradient-to-br from-orange-50 to-red-50 p-8 shadow-lg transition group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div class="absolute right-4 top-4 text-5xl opacity-10">🤖</div>
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 font-bold text-white">04</div>
                <h3 class="mb-3 text-xl font-bold text-slate-900">Entraînement Modèles</h3>
                <p class="mb-4 text-sm text-slate-600">Logistic Regression & LinearSVC (OneVsRest) sur données d'entraînement avec validation croisée.</p>
                <div class="rounded-lg bg-orange-100/50 p-2 text-xs font-mono text-orange-600">Multi-class Classification</div>
              </div>
            </div>

            <div class="group relative animate-scale-in" style="animation-delay: 0.4s">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-400 blur-xl opacity-0 transition duration-500 group-hover:opacity-75"></div>
              <div class="relative rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50 to-blue-50 p-8 shadow-lg transition group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div class="absolute right-4 top-4 text-5xl opacity-10">📈</div>
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 font-bold text-white">05</div>
                <h3 class="mb-3 text-xl font-bold text-slate-900">Évaluation Modèles</h3>
                <p class="mb-4 text-sm text-slate-600">Calcul de l'accuracy et F1-score sur données de test. Sélection du meilleur modèle.</p>
                <div class="rounded-lg bg-indigo-100/50 p-2 text-xs font-mono text-indigo-600">Metrics & Reports</div>
              </div>
            </div>

            <div class="group relative animate-scale-in" style="animation-delay: 0.5s">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-400 blur-xl opacity-0 transition duration-500 group-hover:opacity-75"></div>
              <div class="relative rounded-2xl border border-rose-200/50 bg-gradient-to-br from-rose-50 to-pink-50 p-8 shadow-lg transition group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div class="absolute right-4 top-4 text-5xl opacity-10">💾</div>
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-rose-500 font-bold text-white">06</div>
                <h3 class="mb-3 text-xl font-bold text-slate-900">Stockage & Déploiement</h3>
                <p class="mb-4 text-sm text-slate-600">Sauvegarde dans MongoDB, exposition via API Flask pour prédictions en temps réel.</p>
                <div class="rounded-lg bg-rose-100/50 p-2 text-xs font-mono text-rose-600">MongoDB + Flask API</div>
              </div>
            </div>
          </div>

          <div class="mt-20 grid gap-6 md:grid-cols-4">
            <div class="rounded-2xl border border-slate-200 bg-white/50 p-6 text-center backdrop-blur transition hover:bg-white/80">
              <div class="mb-2 text-4xl font-black text-blue-600">568K</div>
              <p class="font-semibold text-slate-600">Avis Analysés</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white/50 p-6 text-center backdrop-blur transition hover:bg-white/80">
              <div class="mb-2 text-4xl font-black text-purple-600">11K</div>
              <p class="font-semibold text-slate-600">Features Créées</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white/50 p-6 text-center backdrop-blur transition hover:bg-white/80">
              <div class="mb-2 text-4xl font-black text-emerald-600">2</div>
              <p class="font-semibold text-slate-600">Modèles Entraînés</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white/50 p-6 text-center backdrop-blur transition hover:bg-white/80">
              <div class="mb-2 text-4xl font-black text-orange-600">95%</div>
              <p class="font-semibold text-slate-600">Accuracy Max</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="relative py-24 px-4">
        <div class="mx-auto max-w-4xl">
          <div class="relative rounded-3xl overflow-hidden border border-indigo-200/50 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-12 md:p-20 shadow-2xl shadow-indigo-200/30">
            <!-- Background elements -->
            <div class="absolute inset-0 overflow-hidden">
              <div class="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300/20 to-cyan-300/20 blur-3xl"></div>
              <div class="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-tr from-purple-300/20 to-blue-300/20 blur-3xl"></div>
            </div>

            <div class="relative z-10 text-center space-y-8">
              <div class="space-y-4">
                <h2 class="text-4xl md:text-5xl font-black text-slate-900">
                  Prêt à Transformer Vos Données ?
                </h2>
                <p class="text-lg text-slate-600 max-w-2xl mx-auto">
                  Rejoignez des centaines d'entreprises qui utilisent notre plateforme pour optimiser leurs stratégies marketing et produit.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <NuxtLink
                  to="/register"
                  class="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:shadow-indigo-500/60 hover:-translate-y-1"
                >
                  <span>Commencer Gratuitement</span>
                  <ArrowRight class="h-5 w-5 transition group-hover:translate-x-1" />
                </NuxtLink>

                <NuxtLink
                  to="/login"
                  class="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <span>Se connecter</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="relative border-t border-slate-200/50 py-12 px-4 bg-white/30 backdrop-blur">
        <div class="mx-auto max-w-6xl text-center text-slate-600">
          <p>© 2026 Sentiment Intelligence. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
    opacity: 0;
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-scale-in {
    animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
  }
</style>
