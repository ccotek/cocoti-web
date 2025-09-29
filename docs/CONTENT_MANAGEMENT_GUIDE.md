# 📝 Guide de Gestion de Contenu - Cocoti

## 🎯 Vue d'ensemble

Ce guide explique comment utiliser le système de gestion de contenu intégré à Cocoti. Le système permet de modifier le contenu du site web directement depuis l'interface d'administration.

## 🏗️ Architecture

### Frontend (cocoti-web)
- **Interface Admin** : `/admin` - Dashboard de gestion de contenu
- **Composants** : Formulaires d'édition génériques
- **Services** : Communication avec l'API backend
- **Hooks** : Gestion de l'état du contenu

### Backend (tontease-api)
- **API Endpoints** : `/admin/content/*` - Gestion du contenu
- **Base de données** : MongoDB - Stockage du contenu
- **Authentification** : Sécurisé par tokens admin

## 🚀 Démarrage Rapide

### 1. Initialiser le contenu
```bash
cd tontease-api
python scripts/init_content.py
```

### 2. Démarrer l'API
```bash
cd tontease-api
uvicorn app.main:application --reload --port 8000
```

### 3. Démarrer le frontend
```bash
cd cocoti-web
npm run dev
```

### 4. Accéder à l'admin
- URL : `http://localhost:3000/admin`
- Interface de gestion de contenu

## 📋 Sections Disponibles

| Section | Description | Contenu |
|---------|-------------|---------|
| `hero` | Section principale | Titre, sous-titre, boutons, statistiques |
| `solutions` | Solutions proposées | Liste des services |
| `how` | Comment ça marche | Étapes du processus |
| `why` | Pourquoi nous choisir | Valeurs et avantages |
| `pricing` | Tarifs | Plans et prix |
| `testimonials` | Témoignages | Avis clients |
| `faq` | FAQ | Questions fréquentes |
| `contact` | Contact | Informations de contact |
| `footer` | Pied de page | Liens et réseaux sociaux |

## 🔧 Utilisation

### 1. Accéder au Dashboard
1. Allez sur `http://localhost:3000/admin`
2. Sélectionnez la section à modifier
3. Utilisez le formulaire d'édition

### 2. Modifier le Contenu
- **Champs texte** : Saisie directe
- **Champs longs** : Zone de texte
- **Listes** : Ajout/suppression d'éléments
- **Objets imbriqués** : Édition hiérarchique

### 3. Sauvegarder
- Cliquez sur "Sauvegarder"
- Le contenu est envoyé à l'API
- Mise à jour en temps réel

### 4. Prévisualiser
- Cliquez sur "Voir le site"
- Le contenu modifié s'affiche

## 🌐 Gestion Multi-langues

### Langues Supportées
- **Français (fr)** : Langue par défaut
- **Anglais (en)** : Version internationale

### Basculer de Langue
1. Dans l'admin, utilisez le sélecteur de langue
2. Chaque langue a son propre contenu
3. Les modifications sont indépendantes

## 🔌 API Endpoints

### Récupérer le Contenu
```http
GET /api/v1/admin/content/content?locale=fr
```

### Récupérer une Section
```http
GET /api/v1/admin/content/content/{section}?locale=fr
```

### Mettre à Jour
```http
PUT /api/v1/admin/content/content/{section}?locale=fr
Content-Type: application/json

{
  "content": {
    "title": "Nouveau titre",
    "subtitle": "Nouveau sous-titre"
  }
}
```

### Publier
```http
POST /api/v1/admin/content/content/{section}/publish?locale=fr
```

### Historique
```http
GET /api/v1/admin/content/content/{section}/history?locale=fr
```

## 🛠️ Développement

### Structure des Fichiers
```
cocoti-web/
├── src/
│   ├── app/admin/           # Pages admin
│   ├── components/admin/    # Composants admin
│   ├── services/           # Services API
│   ├── hooks/              # Hooks React
│   └── config/             # Configuration
```

### Ajouter une Nouvelle Section
1. Ajoutez la section dans `CONTENT_SECTIONS`
2. Créez le contenu par défaut
3. Ajoutez la section dans le dashboard admin

### Personnaliser un Formulaire
1. Créez un composant spécifique
2. Remplacez `GenericSectionForm`
3. Ajoutez la logique métier

## 🔒 Sécurité

### Authentification
- Token admin requis
- Sessions sécurisées
- Logs d'audit

### Validation
- Validation côté API
- Sanitisation des données
- Protection XSS

### Permissions
- Accès admin uniquement
- Audit des modifications
- Historique des changements

## 📊 Monitoring

### Logs
- Toutes les modifications sont loggées
- Historique complet disponible
- Traçabilité des changements

### Métriques
- Nombre de modifications
- Utilisateurs actifs
- Sections les plus modifiées

## 🚨 Dépannage

### Problèmes Courants

#### 1. API Non Accessible
```bash
# Vérifier que l'API fonctionne
curl http://localhost:8000/api/v1/health
```

#### 2. Contenu Non Sauvegardé
- Vérifier les logs de l'API
- Contrôler l'authentification
- Vérifier la connexion DB

#### 3. Interface Admin Vide
- Vérifier la configuration API
- Contrôler les variables d'environnement
- Vérifier les imports

### Logs Utiles
```bash
# Logs API
tail -f tontease-api/logs/app.log

# Logs Frontend
npm run dev 2>&1 | grep -i error
```

## 📈 Améliorations Futures

### Fonctionnalités Prévues
- [ ] Éditeur WYSIWYG
- [ ] Prévisualisation en temps réel
- [ ] Versioning avancé
- [ ] Workflow d'approbation
- [ ] Templates de contenu
- [ ] Import/Export
- [ ] Analytics de contenu

### Optimisations
- [ ] Cache intelligent
- [ ] CDN pour les assets
- [ ] Compression des données
- [ ] Lazy loading

## 📞 Support

### Documentation
- [Guide API](../tontease-api/docs/)
- [Guide Frontend](./FRONTEND_GUIDE.md)
- [Guide Déploiement](./DEPLOYMENT_GUIDE.md)

### Contact
- **Email** : dev@cocoti.com
- **Slack** : #cocoti-dev
- **GitHub** : Issues et PR

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 1.0.0  
**Auteur** : Équipe Cocoti
