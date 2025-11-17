# 📊 Analyse Technique - COCOTI-WEB

**Date** : 2025-01-27  
**Version** : 0.1.0

---

## 🏗️ Architecture Générale

### Stack Technique
- **Framework** : Next.js 15.5.4 (App Router)
- **React** : 19.1.0
- **TypeScript** : 5.x
- **Styling** : Tailwind CSS 3.4.18
- **Animations** : Framer Motion 12.23.22
- **Icons** : Heroicons 2.2.0
- **i18n** : next-intl 4.3.9
- **QR Codes** : qrcode 1.5.4

### Structure du Projet
```
cocoti-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Routes localisées (fr/en)
│   │   ├── api/               # API Routes Next.js
│   │   ├── cms/               # Interface admin CMS
│   │   └── layout.tsx         # Layout racine
│   ├── components/            # Composants React
│   │   ├── admin/            # Composants admin CMS
│   │   └── sections/         # Sections landing page
│   ├── config/               # Configuration
│   ├── contexts/             # React Contexts
│   ├── hooks/                # Custom React Hooks
│   ├── i18n/                 # Internationalisation
│   ├── services/             # Services API
│   ├── utils/                # Utilitaires
│   └── types/                # Types TypeScript
├── public/                   # Assets statiques
└── docs/                     # Documentation
```

---

## 🌐 Internationalisation (i18n)

### Configuration
- **Locales supportées** : `fr` (par défaut), `en`
- **Système** : `next-intl` avec routing automatique
- **Fichiers de traduction** : `src/i18n/messages/{locale}.json`
- **Routing** : Préfixe de locale obligatoire (`/fr`, `/en`)

### Structure des Messages
- `navigation` - Navigation principale
- `hero` - Section hero
- `solutions` - Solutions proposées
- `how` - Comment ça marche
- `why` - Pourquoi Cocoti
- `pricing` - Tarification (avec `comparisonTable`)
- `testimonials` - Témoignages
- `faq` - FAQ
- `contact` - Contact
- `footer` - Footer
- `causes` - Carrousel de causes
- `whatsapp` - Configuration WhatsApp
- `legal` - Mentions légales
- `moneyPool` - Fonctionnalités Money Pool

---

## 🎨 Design System

### Couleurs Cocoti (Tailwind)
```typescript
sand: "#fdfbf8"        // Fond principal
night: "#2e2e2e"       // Texte principal
sunset: "#ff7c32"      // Orange principal
coral: "#ff5a5f"       // Rouge corail
magenta: "#ff3a81"     // Magenta principal
turquoise: "#00c2a8"   // Turquoise
lilac: "#a259ff"       // Lilas
cloud: "#e0e0e0"       // Gris clair
ivory: "#fff8f0"       // Ivoire
ink-muted: "#2e2e2eb3" // Texte atténué
```

### Typographie
- **Police principale** : Inter (via Google Fonts)
- **Fallback** : System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)

### Animations
- **Framer Motion** pour transitions et animations
- **Variants** : `fadeInUp`, `scaleIn` (réutilisables)

---

## 📄 Pages Principales

### 1. Landing Page (`/[locale]/page.tsx`)
- **Composants** : `LandingPage.tsx`, `CompleteLandingPage.tsx`, `SimpleLandingPage.tsx`
- **Sections** :
  - Hero (avec stats, apps badges)
  - Solutions (tontines, cagnottes, crowdfunding, group-buys)
  - How (étapes d'utilisation)
  - Why (valeurs)
  - Pricing (avec tableau de comparaison)
  - Testimonials
  - FAQ
  - Contact
  - Footer
  - Causes Carousel (projets publics)

### 2. Money Pools
- **Liste** : `/[locale]/money-pools/page.tsx`
  - Affichage des cagnottes publiques
  - Pagination client-side
  - Recherche
  - Filtres (actifs/archivés)
  
- **Détails** : `/[locale]/money-pool/[id]/page.tsx`
  - Affichage détaillé d'une cagnotte
  - Contribution (avec PayDunya)
  - Liste des contributeurs
  - Partage (QR code, liens sociaux)
  
- **Création** : `/[locale]/money-pool/create/page.tsx`
  - Formulaire multi-étapes
  - Vérification OTP
  - Upload d'images/vidéos
  - Publication

### 3. Pages Légales
- `/[locale]/terms-of-service/page.tsx`
- `/[locale]/privacy-policy/page.tsx`
- `/[locale]/legal-notice/page.tsx`

### 4. Payment Return
- `/[locale]/payment/return/page.tsx`
  - Gestion du retour PayDunya
  - Vérification du statut de paiement

---

## 🔐 Système Admin (CMS)

### Architecture
- **Route** : `/cms` (protégée)
- **Login** : `/cms/login`
- **Authentification** : Via `cocoti-api` (`/api/v1/auth/login`)
- **Context** : `AdminAuthContext` (React Context)
- **Service** : `adminAuthService.ts`

### Fonctionnalités
- **Gestion de contenu** : Édition des sections de la landing page
- **Sections éditables** :
  - Hero
  - Solutions
  - How
  - Why
  - Pricing (avec tableau de comparaison)
  - Testimonials
  - FAQ
  - Contact
  - Footer
  - Causes Carousel
  - WhatsApp
  - Legal

### Sécurité
- **Protection par variable** : `NEXT_PUBLIC_ADMIN_ENABLED`
- **Session** : Token JWT stocké dans `localStorage`
- **Auto-logout** : Après 30 minutes d'inactivité
- **Permissions** : Vérification des rôles admin

---

## 🔌 API Routes (Next.js)

### `/api/cms/content`
- **GET** : Récupère le contenu depuis `src/i18n/messages/{locale}.json`
- **PUT** : Met à jour une section dans le fichier JSON
- **Note** : Écriture directe dans les fichiers JSON (pas de base de données)

### `/api/auth/set-cookie`
- Gestion des cookies d'authentification

### `/api/upload`
- Upload de fichiers (images, vidéos)

---

## 💰 Money Pool Feature

### Fonctionnalités
1. **Création**
   - Formulaire multi-étapes (info → vérification → activation → success)
   - Upload d'images (max 3) et vidéos (max 2)
   - Configuration de visibilité (public/community/private)
   - Paramètres (montant cible, min/max contribution, participants max)
   - Authentification OTP pour publication

2. **Affichage Public**
   - Liste des cagnottes publiques
   - Détails avec galerie
   - Barre de progression
   - Liste des contributeurs
   - Partage (QR code, réseaux sociaux)

3. **Contribution**
   - Formulaire de contribution
   - Support Cocoti (tip optionnel)
   - Paiement via PayDunya (Orange Money, Wave, CB)
   - Messages de soutien
   - Contribution anonyme (si autorisée)

### Intégration API
- **Endpoint principal** : `${API_URL}/api/v1/money-pools`
- **Endpoints utilisés** :
  - `GET /api/v1/money-pools/public` - Liste publique
  - `GET /api/v1/money-pools/{id}` - Détails
  - `POST /api/v1/money-pools/public/create` - Création
  - `POST /api/v1/money-pools/{id}/participate` - Contribution

---

## 🎯 Composants Clés

### Sections Landing Page
- `HeroSection.tsx` - Hero avec stats et apps
- `SolutionsSection.tsx` - Solutions proposées
- `HowSection.tsx` - Comment ça marche
- `WhySection.tsx` - Pourquoi Cocoti
- `PricingSection.tsx` - Tarification (cartes verticales avec features)
- `TestimonialsSection.tsx` - Témoignages
- `FaqSection.tsx` - FAQ
- `ContactSection.tsx` - Contact
- `FooterSection.tsx` - Footer
- `CausesSection.tsx` - Carrousel de projets publics

### Composants Utilitaires
- `CookieBanner.tsx` - Bannière de cookies
- `WhatsAppButtonBasic.tsx` - Bouton WhatsApp flottant
- `MoneyPoolGallery.tsx` - Galerie d'images/vidéos
- `ShareMenuWithQR.tsx` - Menu de partage avec QR code
- `Notification.tsx` - Système de notifications

### Composants Admin
- `AdminDashboard.tsx` - Dashboard principal
- `AdminGuard.tsx` - Protection des routes admin
- `forms/` - Formulaires d'édition de sections

---

## 🔧 Configuration

### Variables d'Environnement
```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Dashboard (cocoti-dash)
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:5000

# Site Web
NEXT_PUBLIC_SITE_URL=http://localhost:4000

# Admin
NEXT_PUBLIC_ADMIN_ENABLED=true
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8000/api/v1
```

### Configuration App (`src/config/app.ts`)
- `API_URL` - URL de l'API backend
- `DASHBOARD_URL` - URL du dashboard
- `WEB_APP_URL` - URL de l'app web (pour partage)
- `TERMS_URL` - URL des CGU
- `PRIVACY_URL` - URL de la politique de confidentialité

### Configuration Admin (`src/config/admin.ts`)
- `ENABLED` - Activation admin
- `AUTH_API_URL` - URL API auth
- `SECURITY` - Configuration sécurité (session, timeout, etc.)
- `PROTECTED_ROUTES` - Routes protégées
- `PUBLIC_ROUTES` - Routes publiques

---

## 📦 Services

### `contentService.ts`
- Gestion du contenu CMS
- Lecture/écriture des fichiers JSON
- Transformation des données API

### `adminAuthService.ts`
- Authentification admin
- Gestion des tokens (access + refresh)
- Vérification des permissions
- Auto-refresh des tokens

---

## 🎣 Hooks Personnalisés

### `useContent(locale)`
- Charge le contenu depuis l'API ou JSON
- Gère le loading et les erreurs
- Met à jour le contenu via `updateContent()`

### `usePublicProjects(locale)`
- Récupère les projets publics (money pools)
- Filtre les cagnottes actives et publiques
- Formatage des données pour le carrousel

### `useAdminAuth()`
- Gestion de l'authentification admin
- Vérification de session
- Auto-refresh des tokens

### `useCausesCarouselConfig(locale)`
- Configuration du carrousel de causes

### `useCookies()`
- Gestion des préférences cookies

---

## 🚀 Déploiement

### Docker
- **Multi-stage build** : deps → builder → runner
- **Port** : 4000
- **User** : nextjs (non-root)
- **Standalone** : Mode standalone Next.js

### Scripts
- `dev` : Développement (port 4000)
- `build` : Build production
- `start` : Démarrage production (port 4000)
- `start:prod` : Démarrage standalone

---

## 🔍 Points d'Attention

### 1. Gestion du Contenu
- ✅ **Actuel** : Fichiers JSON locaux (`src/i18n/messages/{locale}.json`)
- ⚠️ **Limitation** : Écriture directe dans les fichiers (pas de versioning, pas de backup automatique)
- 💡 **Recommandation** : Considérer une base de données pour le CMS

### 2. Authentification Admin
- ✅ **Actuel** : JWT via `cocoti-api`
- ✅ **Stockage** : `localStorage` (access token + refresh token)
- ⚠️ **Sécurité** : Tokens en `localStorage` (vulnérable au XSS)
- 💡 **Recommandation** : Considérer httpOnly cookies pour production

### 3. Upload de Fichiers
- ✅ **Actuel** : Route `/api/upload` Next.js
- ⚠️ **Limitation** : Pas de gestion de stockage S3 visible
- 💡 **Recommandation** : Vérifier l'intégration avec le backend pour uploads

### 4. Money Pool
- ✅ **Fonctionnel** : Création, affichage, contribution
- ✅ **Paiement** : Intégration PayDunya
- ⚠️ **Note** : Gestion complexe des états (draft, active, closed, etc.)

### 5. i18n
- ✅ **Bien structuré** : next-intl avec routing
- ⚠️ **Fallback** : Pas de fallback automatique si traduction manquante
- 💡 **Recommandation** : Ajouter un système de fallback

---

## 📊 Métriques Techniques

### Dépendances Principales
- **next** : 15.5.4
- **react** : 19.1.0
- **next-intl** : 4.3.9
- **framer-motion** : 12.23.22
- **tailwindcss** : 3.4.18
- **@heroicons/react** : 2.2.0
- **qrcode** : 1.5.4

### Structure des Fichiers
- **Composants** : ~30+ composants
- **Pages** : ~10 pages principales
- **Hooks** : 5 hooks personnalisés
- **Services** : 2 services principaux
- **Routes API** : 4 routes API

---

## 🎯 Fonctionnalités Clés

### ✅ Implémentées
1. Landing page multi-sections
2. CMS admin pour édition de contenu
3. Money Pool (création, affichage, contribution)
4. Intégration PayDunya (paiements)
5. i18n (FR/EN)
6. Partage social avec QR code
7. Upload d'images/vidéos
8. Carrousel de projets publics

### ⚠️ À Vérifier/Améliorer
1. Gestion des erreurs API (retry, fallback)
2. Performance (lazy loading, code splitting)
3. SEO (metadata, sitemap)
4. Analytics (tracking)
5. Tests (unitaires, e2e)

---

## 🔗 Intégrations

### Backend API (`cocoti-api`)
- **Base URL** : `NEXT_PUBLIC_API_URL`
- **Endpoints utilisés** :
  - `/api/v1/money-pools/*` - Money pools
  - `/api/v1/auth/*` - Authentification admin
  - `/api/v1/geography/*` - Géographie (pays, régions)

### Dashboard (`cocoti-dash`)
- **Redirection** : Boutons "Se connecter" → `${DASHBOARD_URL}/${locale}`
- **Création Money Pool** : Redirection après création

### PayDunya
- **Intégration** : SDK PayDunya pour paiements
- **Méthodes** : Orange Money, Wave, Carte Bancaire
- **Webhooks** : Gestion des retours de paiement

---

## 📝 Notes Techniques

### Routing
- **Middleware** : Redirection `/` → `/fr`
- **Locale prefix** : Toujours présent (`/fr`, `/en`)
- **404** : Page `not-found.tsx` personnalisée

### State Management
- **React Context** : `AdminAuthContext`
- **Local State** : `useState` pour composants
- **Pas de Redux** : State management simple

### Performance
- **Image Optimization** : Next.js Image component
- **Code Splitting** : Automatique avec Next.js
- **Lazy Loading** : Composants avec `dynamic import`

---

## 🎨 Design Patterns

### Composants
- **Client Components** : `"use client"` pour interactivité
- **Server Components** : Par défaut (Next.js 15)
- **Composition** : Composants réutilisables

### Styling
- **Tailwind CSS** : Utility-first
- **Design Tokens** : Couleurs Cocoti dans `tailwind.config.ts`
- **Responsive** : Mobile-first

### Animations
- **Framer Motion** : Animations fluides
- **Variants** : Réutilisables (`fadeInUp`, `scaleIn`)

---

## 🔐 Sécurité

### Authentification
- **JWT** : Tokens access + refresh
- **Storage** : `localStorage` (⚠️ XSS risk)
- **Auto-refresh** : Renouvellement automatique

### Protection Routes
- **Admin** : Middleware + `AdminGuard`
- **CMS** : Vérification d'authentification

### CORS
- **Configuration** : Côté backend (`cocoti-api`)

---

## 📚 Documentation

### Fichiers de Documentation
- `docs/ADMIN_DESIGN_SYSTEM.md` - Design system admin
- `docs/ADMIN_SECURITY.md` - Sécurité admin
- `docs/CONTENT_MANAGEMENT_GUIDE.md` - Guide CMS
- `docs/ENV_CONFIG.md` - Configuration env
- `docs/ENV_VARIABLES.md` - Variables d'environnement
- `docs/HYDRATION_FIXES.md` - Fixes hydration

---

## 🚧 Points d'Amélioration Identifiés

### 1. Gestion d'Erreurs
- ⚠️ Pas de système centralisé de gestion d'erreurs
- 💡 Créer un `ErrorBoundary` global
- 💡 Système de retry pour les appels API

### 2. Loading States
- ⚠️ Loading states inconsistants
- 💡 Créer un composant `LoadingSpinner` réutilisable
- 💡 Skeleton loaders pour meilleure UX

### 3. Validation Forms
- ⚠️ Validation côté client basique
- 💡 Ajouter une librairie de validation (Zod, Yup)
- 💡 Messages d'erreur i18n

### 4. Tests
- ⚠️ Pas de tests visibles
- 💡 Ajouter tests unitaires (Jest, React Testing Library)
- 💡 Tests e2e (Playwright, Cypress)

### 5. Performance
- ⚠️ Pas de métriques de performance
- 💡 Ajouter Lighthouse CI
- 💡 Optimiser les images (WebP, lazy loading)

### 6. SEO
- ⚠️ Metadata basique
- 💡 Ajouter Open Graph, Twitter Cards
- 💡 Sitemap dynamique
- 💡 Structured data (JSON-LD)

---

## ✅ Points Forts

1. **Architecture moderne** : Next.js 15 avec App Router
2. **i18n bien implémenté** : next-intl avec routing
3. **Design system cohérent** : Couleurs Cocoti bien définies
4. **CMS fonctionnel** : Édition de contenu sans base de données
5. **Money Pool complet** : Création, affichage, contribution
6. **Intégration PayDunya** : Paiements fonctionnels
7. **Responsive** : Design mobile-first
8. **Animations fluides** : Framer Motion bien utilisé

---

**Status** : ✅ **Analyse complète - Prêt pour développement**

