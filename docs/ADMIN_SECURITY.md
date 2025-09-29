# 🔐 Guide de Sécurité Admin - Cocoti

## 🛡️ Couches de Protection

### 1. **Authentification Obligatoire**
- ✅ Page de connexion : `/admin/login`
- ✅ Vérification des identifiants
- ✅ Gestion des sessions
- ✅ Déconnexion automatique

### 2. **Middleware de Protection**
- ✅ Redirection automatique si non authentifié
- ✅ Vérification des tokens
- ✅ Protection des routes sensibles

### 3. **Variables d'Environnement**
- ✅ Activation/désactivation de l'admin
- ✅ Configuration sécurisée
- ✅ Protection en production

## 🔧 Configuration

### Variables d'Environnement
```bash
# .env.local
NEXT_PUBLIC_ADMIN_ENABLED=true
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8000/api/v1
```

### Désactiver l'Admin en Production
```bash
# .env.production
NEXT_PUBLIC_ADMIN_ENABLED=false
```

## 🚀 Utilisation

### 1. **Accès à l'Admin**
```
URL: http://localhost:3000/admin
→ Redirection automatique vers /admin/login si non connecté
```

### 2. **Connexion**
```
Email: admin@cocoti.com
Mot de passe: admin123
```

### 3. **Sécurité**
- Session limitée à 24h
- Auto-logout après 30min d'inactivité
- Max 5 tentatives de connexion
- Blocage temporaire après échecs

## 🔒 Bonnes Pratiques

### 1. **En Développement**
```typescript
// Utiliser des identifiants de test
const TEST_CREDENTIALS = {
  email: "admin@cocoti.com",
  password: "admin123"
};
```

### 2. **En Production**
```typescript
// Utiliser l'API d'authentification réelle
const API_AUTH = {
  endpoint: process.env.NEXT_PUBLIC_AUTH_API_URL,
  credentials: "secure-credentials"
};
```

### 3. **Sécurité Renforcée**
- Changer les identifiants par défaut
- Utiliser HTTPS en production
- Implémenter 2FA
- Logs d'audit

## 🚨 Désactivation d'Urgence

### 1. **Via Variable d'Environnement**
```bash
NEXT_PUBLIC_ADMIN_ENABLED=false
```

### 2. **Via Code**
```typescript
// Dans config/admin.ts
export const ADMIN_CONFIG = {
  ENABLED: false // Désactive complètement l'admin
};
```

### 3. **Via Middleware**
```typescript
// Redirection forcée
if (pathname.startsWith('/admin')) {
  return NextResponse.redirect(new URL('/fr', request.url));
}
```

## 📊 Monitoring

### 1. **Logs d'Accès**
```typescript
// Logger les tentatives de connexion
console.log(`Admin login attempt: ${email} at ${new Date()}`);
```

### 2. **Métriques de Sécurité**
- Nombre de tentatives de connexion
- Échecs d'authentification
- Sessions actives
- Actions admin

### 3. **Alertes**
```typescript
// Alerte en cas de tentative suspecte
if (loginAttempts > 3) {
  sendSecurityAlert(email, ip);
}
```

## 🔧 Dépannage

### Problèmes Courants

#### 1. **Redirection en Boucle**
```bash
# Vérifier les cookies
document.cookie

# Nettoyer le localStorage
localStorage.clear();
```

#### 2. **Token Expiré**
```typescript
// Vérifier la validité du token
const token = localStorage.getItem('admin_token');
if (!token || isExpired(token)) {
  logout();
}
```

#### 3. **Admin Non Accessible**
```bash
# Vérifier la variable d'environnement
echo $NEXT_PUBLIC_ADMIN_ENABLED

# Redémarrer le serveur
npm run dev
```

## 🚀 Déploiement Sécurisé

### 1. **Variables d'Environnement**
```bash
# Production
NEXT_PUBLIC_ADMIN_ENABLED=true
NEXT_PUBLIC_AUTH_API_URL=https://api.cocoti.com/v1
```

### 2. **Configuration Serveur**
```nginx
# Nginx - Protection supplémentaire
location /admin {
    # IP whitelist
    allow 192.168.1.0/24;
    deny all;
}
```

### 3. **Monitoring**
```typescript
// Alertes de sécurité
const securityAlerts = {
  failedLogins: 0,
  suspiciousActivity: false,
  adminAccess: []
};
```

## 📈 Améliorations Futures

### 1. **Authentification Avancée**
- [ ] 2FA (TOTP/SMS)
- [ ] SSO (Single Sign-On)
- [ ] OAuth2/OpenID Connect

### 2. **Audit et Logs**
- [ ] Logs détaillés
- [ ] Audit trail complet
- [ ] Alertes temps réel

### 3. **Sécurité Renforcée**
- [ ] Rate limiting
- [ ] IP whitelisting
- [ ] Détection d'intrusion

---

**Dernière mise à jour** : Décembre 2024  
**Niveau de sécurité** : 🔒 Élevé  
**Statut** : ✅ Opérationnel
