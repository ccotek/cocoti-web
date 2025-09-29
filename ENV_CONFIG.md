# Configuration de l'Environnement

Pour configurer l'URL de l'API, créez un fichier `.env.local` dans le dossier `cocoti-web/` avec le contenu suivant :

```bash
# Configuration de l'API
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1

# Configuration admin (optionnel)
NEXT_PUBLIC_ADMIN_ENABLED=true
```

## Variables d'Environnement Disponibles

- `NEXT_PUBLIC_API_URL` : URL de l'API FastAPI (défaut: `http://localhost:8001/api/v1`)
- `NEXT_PUBLIC_ADMIN_ENABLED` : Activer l'interface admin (défaut: `true` en développement)

## Exemple de Configuration

### Développement Local
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
NEXT_PUBLIC_ADMIN_ENABLED=true
```

### Production
```bash
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api/v1
NEXT_PUBLIC_ADMIN_ENABLED=false
```

## Utilisation

1. Créez le fichier `.env.local` dans `cocoti-web/`
2. Ajoutez les variables d'environnement
3. Redémarrez le serveur de développement (`npm run dev`)
