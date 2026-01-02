# Variables d'environnement - Cocoti Web

Ce document liste toutes les variables d'environnement utilisées par `cocoti-web` et leurs valeurs par défaut.

## Variables disponibles

### API Backend

```bash
# URL de l'API backend Cocoti
# En développement: http://localhost:8000
# En production: https://api.cocoti.app/api/v1
# Utilisé pour toutes les requêtes API (y compris l'admin)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### URLs de l'application

```bash
# URL du site web principal (cocoti-web)
# En développement: http://localhost:3000
# En production: https://cocoti.app
# Utilisé pour générer les URLs de partage et les liens internes
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Fichiers légaux (Markdown)

```bash
# Chemin vers les fichiers markdown des documents légaux (côté serveur)
# Par défaut: _resources/legal
# Structure attendue:
#   {NEXT_PUBLIC_LEGAL_FILES_PATH}/
#     fr/
#       privacy-policy.md
#       terms-of-service.md
#       legal-notice.md
#     en/
#       privacy-policy.md
#       terms-of-service.md
#       legal-notice.md
# Note: Utilisé côté serveur pour lire les fichiers markdown
NEXT_PUBLIC_LEGAL_FILES_PATH=_resources/legal
```

### Administration

```bash
# Activation du panneau d'administration
# true: activer l'admin
# false ou non défini: désactiver l'admin
# En développement, l'admin est activé par défaut même si cette variable n'est pas définie
NEXT_PUBLIC_ADMIN_ENABLED=false
```

## Configuration en développement

Créez un fichier `.env.local` à la racine du projet `cocoti-web/` :

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_ENABLED=true
NEXT_PUBLIC_LEGAL_FILES_PATH=_resources/legal
```

## Configuration en production

Configurez ces variables dans votre plateforme de déploiement (Vercel, Coolify, etc.) :

```bash
NEXT_PUBLIC_API_URL=https://api.cocoti.app/api/v1
NEXT_PUBLIC_SITE_URL=https://cocoti.app
NEXT_PUBLIC_ADMIN_ENABLED=false
NEXT_PUBLIC_LEGAL_FILES_PATH=_resources/legal
```

## Notes importantes

1. **Toutes les variables `NEXT_PUBLIC_*` sont exposées au client (navigateur)**
   - ⚠️ Ne jamais mettre de secrets ou de tokens dans ces variables !
   - Elles sont accessibles via `process.env.NEXT_PUBLIC_*` côté client

2. **Architecture des domaines en production** :
   ```
   cocoti.app          → Application web principale (cocoti-web)
   join.cocoti.app     → Page d'invitation (invite-page/)
   api.cocoti.app      → API backend (cocoti-api)
   ```

3. **Variables utilisées dans le code** :
   - `src/config/app.ts` : Configuration principale (API_URL, WEB_APP_URL)
   - `src/config/admin.ts` : Configuration admin (ENABLED uniquement)
   - `src/config/adminApi.ts` : Configuration API admin (utilise NEXT_PUBLIC_API_URL)
   - `src/utils/markdownReader.ts` : Lecture des fichiers markdown légaux (utilise NEXT_PUBLIC_LEGAL_FILES_PATH)

4. **Note sur les liens légaux** :
   - Les liens vers les pages légales (`/terms-of-service`, `/privacy-policy`) utilisent des routes relatives avec le locale
   - Exemple : `/${locale}/terms-of-service` (pas besoin de variables d'environnement)

4. **Simplifications effectuées** :
   - ❌ `NEXT_PUBLIC_DASHBOARD_URL` : Supprimé, utilise `WEB_APP_URL` à la place
   - ❌ `NEXT_PUBLIC_AUTH_API_URL` : Supprimé, utilise `NEXT_PUBLIC_API_URL` (l'URL complète est construite avec `/api/v1`)
   - ❌ `NEXT_PUBLIC_WEB_APP_URL` : Supprimé, utilise uniquement `NEXT_PUBLIC_SITE_URL`

## Fichiers de configuration

Les valeurs par défaut sont définies dans :
- `src/config/app.ts` : URLs principales et configuration générale
- `src/config/admin.ts` : Configuration du panneau d'administration
- `src/config/adminApi.ts` : Configuration de l'API admin

