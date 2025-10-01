# Variables d'environnement

## Configuration requise

### NEXT_PUBLIC_DASHBOARD_URL
- **Description** : URL du dashboard principal de l'application
- **Valeur par défaut** : `https://app.cocoti.sn`
- **Utilisation** : Utilisée pour rediriger les boutons "Se connecter" et "Commencer maintenant" vers le dashboard
- **Note** : La langue actuelle (`/fr` ou `/en`) est automatiquement ajoutée à l'URL

### Variables existantes

#### NEXT_PUBLIC_API_URL
- **Description** : URL de l'API backend
- **Valeur par défaut** : `http://localhost:8000`

#### NEXT_PUBLIC_SITE_URL
- **Description** : URL du site web
- **Valeur par défaut** : `http://localhost:3000`

#### NEXT_PUBLIC_BASE_URL
- **Description** : URL de base pour les uploads
- **Valeur par défaut** : `http://localhost:4000`

#### NEXT_PUBLIC_ADMIN_ENABLED
- **Description** : Active l'interface d'administration
- **Valeur par défaut** : `true`

#### NEXT_PUBLIC_AUTH_API_URL
- **Description** : URL de l'API d'authentification
- **Valeur par défaut** : `http://localhost:8000/api/v1`

## Configuration

1. Copiez le fichier `.env.example` vers `.env.local`
2. Modifiez les valeurs selon votre environnement
3. Redémarrez le serveur de développement

```bash
cp .env.example .env.local
npm run dev
```

## Exemples d'URLs générées

### Avec la valeur par défaut
- **Français** : `https://app.cocoti.sn/fr`
- **Anglais** : `https://app.cocoti.sn/en`

### Avec une URL personnalisée
Si `NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.mondomaine.com` :
- **Français** : `https://dashboard.mondomaine.com/fr`
- **Anglais** : `https://dashboard.mondomaine.com/en`
