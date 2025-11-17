# ✅ Implémentation du Respect des Préférences Cookies

**Date** : 2025-01-27  
**Status** : ✅ **Implémenté**

---

## 📋 Ce qui a été fait

### 1. Composant ScriptLoader (`src/components/ScriptLoader.tsx`)

✅ **Créé** : Composant qui charge les scripts de tracking conditionnellement selon les préférences cookies.

**Fonctionnalités** :
- Utilise le hook `useCookies` pour vérifier les préférences
- Charge Google Analytics uniquement si `analytics` est accepté
- Charge Facebook Pixel uniquement si `marketing` est accepté
- Ne charge rien si l'utilisateur n'a pas donné son consentement
- Réagit aux changements de préférences en temps réel
- Logs de debug en développement

### 2. Utilitaires Analytics (`src/utils/analytics.ts`)

✅ **Créé** : Fonctions utilitaires pour tracker les événements en respectant les préférences.

**Fonctions disponibles** :
- `trackEvent(eventName, eventData)` - Track un événement Google Analytics
- `trackFacebookEvent(eventName, eventData)` - Track un événement Facebook Pixel
- `trackPageView(path)` - Track une page view
- `trackConversion(type, value, currency)` - Track une conversion

**Sécurité** :
- Vérifie les préférences avant chaque tracking
- Ne fait rien si l'analytics/marketing n'est pas autorisé
- Logs de debug en développement

### 3. Intégration dans le Layout

✅ **Modifié** : `src/app/layout.tsx`
- Ajout de `<ScriptLoader />` dans le layout racine
- Les scripts se chargent automatiquement selon les préférences

### 4. Amélioration du CookieBanner

✅ **Modifié** : `src/components/CookieBanner.tsx`
- Déclenche un événement `cookie-consent-updated` quand les préférences changent
- Permet au `ScriptLoader` de réagir immédiatement aux changements

---

## 🔧 Configuration

### Variables d'Environnement

Ajoutez ces variables dans votre `.env.local` :

```bash
# Google Analytics (optionnel)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Facebook Pixel (optionnel)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1234567890123456
```

**Note** : Si ces variables ne sont pas définies, les scripts ne se chargeront pas (même si les préférences sont acceptées).

---

## 📊 Comment ça fonctionne

### 1. Premier chargement

1. L'utilisateur arrive sur le site
2. Le `CookieBanner` s'affiche si aucune préférence n'est stockée
3. Le `ScriptLoader` vérifie les préférences via `useCookies`
4. Si pas de consentement → aucun script n'est chargé
5. Si consentement donné → les scripts correspondants sont chargés

### 2. Changement de préférences

1. L'utilisateur modifie ses préférences dans le `CookieBanner`
2. Les préférences sont sauvegardées dans `localStorage`
3. Un événement `cookie-consent-updated` est déclenché
4. Le `ScriptLoader` écoute cet événement et se re-render
5. Les scripts sont rechargés selon les nouvelles préférences

### 3. Utilisation des utilitaires

```typescript
import { trackEvent, trackPageView, trackConversion } from '@/utils/analytics';

// Track une page view
trackPageView('/money-pools');

// Track un événement personnalisé
trackEvent('money_pool_created', {
  pool_id: '123',
  amount: 100000,
});

// Track une conversion
trackConversion('money_pool_contribution', 5000, 'XOF');
```

**Important** : Ces fonctions vérifient automatiquement les préférences avant de tracker.

---

## ✅ Conformité RGPD/GDPR

### ✅ Respect des préférences

- ✅ Les scripts ne se chargent que si l'utilisateur a donné son consentement
- ✅ Les préférences sont vérifiées avant chaque tracking
- ✅ L'utilisateur peut modifier ses préférences à tout moment
- ✅ Les changements sont appliqués immédiatement

### ✅ Transparence

- ✅ Le banner explique clairement l'utilisation des cookies
- ✅ L'utilisateur peut personnaliser ses choix
- ✅ Lien vers la politique de confidentialité

---

## 🧪 Tests

### Test 1 : Accept All
1. Ouvrir le site
2. Cliquer sur "Accepter tout"
3. Vérifier dans la console (dev) : `[ScriptLoader] Cookie preferences: { analytics: true, marketing: true }`
4. Vérifier que les scripts se chargent (si les IDs sont configurés)

### Test 2 : Reject All
1. Ouvrir le site
2. Cliquer sur "Refuser tout"
3. Vérifier dans la console : `[ScriptLoader] Cookie preferences: { analytics: false, marketing: false }`
4. Vérifier qu'aucun script ne se charge

### Test 3 : Customize
1. Ouvrir le site
2. Cliquer sur "Personnaliser"
3. Activer uniquement "Analytics"
4. Cliquer sur "Sauvegarder"
5. Vérifier que seul Google Analytics se charge (si configuré)

### Test 4 : Changement de préférences
1. Accepter tout
2. Vérifier que les scripts se chargent
3. Modifier les préférences pour refuser analytics
4. Vérifier que les scripts sont rechargés (analytics désactivé)

---

## 📝 Notes Importantes

### 1. Scripts Next.js

Les scripts utilisent `next/script` avec `strategy="afterInteractive"` pour optimiser les performances.

### 2. Re-render des Scripts

Quand les préférences changent, les scripts sont rechargés grâce à :
- Un événement personnalisé `cookie-consent-updated`
- Une clé `key` qui force le re-render des composants Script

### 3. Développement vs Production

- En développement : Logs de debug dans la console
- En production : Pas de logs, fonctionnement silencieux

### 4. Fallback

Si les variables d'environnement ne sont pas définies, les scripts ne se chargent pas (même si acceptés). C'est normal et souhaitable pour le développement.

---

## 🚀 Prochaines Étapes (Optionnel)

### 1. Ajouter d'autres scripts de tracking

Si vous voulez ajouter d'autres outils (ex: LinkedIn Insight Tag, Twitter Pixel), ajoutez-les dans `ScriptLoader.tsx` :

```typescript
{canUseMarketing() && process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID && (
  <Script id="linkedin-insight" strategy="afterInteractive">
    {/* Code LinkedIn */}
  </Script>
)}
```

### 2. Analytics personnalisé

Si vous voulez créer votre propre système d'analytics, utilisez les fonctions de `analytics.ts` comme base.

### 3. Tests E2E

Ajouter des tests E2E pour vérifier que les préférences sont bien respectées.

---

## ✅ Résumé

**Avant** :
- ❌ Les préférences étaient stockées mais jamais utilisées
- ❌ Aucun script ne respectait les choix de l'utilisateur
- ❌ Non-conforme RGPD/GDPR

**Après** :
- ✅ Les préférences sont stockées ET utilisées
- ✅ Tous les scripts respectent les choix de l'utilisateur
- ✅ Conforme RGPD/GDPR
- ✅ L'utilisateur peut modifier ses préférences à tout moment
- ✅ Les changements sont appliqués immédiatement

**Status** : ✅ **Conforme et fonctionnel**

