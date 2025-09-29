# 🎨 Design System Admin - Cocoti

## 🎯 Charte Graphique Appliquée

L'interface admin respecte entièrement la charte graphique Cocoti pour maintenir la cohérence visuelle.

## 🎨 Palette de Couleurs

### Couleurs Principales
```css
/* Couleurs de base */
--sand: #fdfbf8        /* Arrière-plan principal */
--night: #2e2e2e        /* Texte principal */
--ivory: #fff8f0        /* Arrière-plan secondaire */
--cloud: #e0e0e0        /* Bordures et séparateurs */
--ink-muted: #2e2e2eb3  /* Texte secondaire */
```

### Couleurs d'Accent
```css
/* Gradients Cocoti */
--sunset: #ff7c32       /* Orange chaleureux */
--magenta: #ff3a81      /* Rose vibrant */
--turquoise: #00c2a8    /* Bleu-vert */
--lilac: #a259ff        /* Violet */
--coral: #ff5a5f        /* Rouge corail */
```

## 🎨 Application dans l'Admin

### 1. **Page de Connexion**
```tsx
// Arrière-plan
className="min-h-screen bg-sand"

// Carte principale
className="bg-white rounded-4xl shadow-2xl border border-cloud"

// Bouton principal
className="bg-gradient-to-r from-sunset to-magenta rounded-2xl shadow-glow"

// Champs de saisie
className="border border-cloud rounded-2xl bg-ivory focus:ring-magenta"
```

### 2. **Dashboard Principal**
```tsx
// Layout principal
className="flex h-screen bg-sand"

// Sidebar
className="bg-white border-r border-cloud"

// Navigation active
className="bg-gradient-to-r from-sunset/10 to-magenta/10 border border-sunset/20"

// Cartes de section
className="bg-white rounded-2xl border border-cloud hover:border-sunset/20"
```

### 3. **Éléments Interactifs**
```tsx
// Boutons primaires
className="bg-gradient-to-r from-sunset to-magenta text-white rounded-2xl shadow-glow"

// Boutons secondaires
className="border border-cloud text-night rounded-2xl hover:bg-ivory"

// Boutons de danger
className="text-coral hover:bg-coral/10 rounded-2xl"
```

## 🎨 Composants Spécialisés

### 1. **Header Admin**
```tsx
<header className="bg-white shadow-sm border-b border-cloud">
  <div className="flex items-center justify-between h-16 px-6">
    {/* Logo avec gradient Cocoti */}
    <div className="w-8 h-8 bg-gradient-to-br from-sunset to-magenta rounded-lg shadow-glow">
      <span className="text-white font-bold text-sm">C</span>
    </div>
  </div>
</header>
```

### 2. **Navigation Sidebar**
```tsx
<nav className="mt-6 px-3">
  <button className={`
    w-full flex items-center px-3 py-2 text-sm font-medium rounded-2xl transition-colors
    ${isActive 
      ? 'bg-gradient-to-r from-sunset/10 to-magenta/10 text-night border border-sunset/20'
      : 'text-ink-muted hover:bg-ivory hover:text-night'
    }
  `}>
    <Icon className="mr-3 h-5 w-5" />
    {title}
  </button>
</nav>
```

### 3. **Cartes de Contenu**
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  className="bg-white rounded-2xl shadow-sm border border-cloud p-6 cursor-pointer hover:shadow-lg transition-shadow hover:border-sunset/20"
>
  <div className="flex items-center mb-4">
    <div className="p-3 rounded-2xl bg-gradient-to-br from-sunset to-magenta shadow-glow">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="ml-3 text-lg font-semibold text-night">{title}</h3>
  </div>
  <p className="text-ink-muted text-sm">{description}</p>
</motion.div>
```

## 🎨 États et Interactions

### 1. **États de Boutons**
```css
/* Normal */
.btn-primary {
  @apply bg-gradient-to-r from-sunset to-magenta text-white rounded-2xl shadow-lg;
}

/* Hover */
.btn-primary:hover {
  @apply shadow-glow;
}

/* Focus */
.btn-primary:focus {
  @apply ring-2 ring-magenta ring-offset-2;
}

/* Disabled */
.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}
```

### 2. **États de Formulaire**
```css
/* Input normal */
.form-input {
  @apply border border-cloud rounded-2xl bg-ivory;
}

/* Input focus */
.form-input:focus {
  @apply ring-2 ring-magenta border-magenta;
}

/* Input error */
.form-input.error {
  @apply border-coral ring-2 ring-coral/20;
}
```

### 3. **États de Navigation**
```css
/* Item normal */
.nav-item {
  @apply text-ink-muted hover:bg-ivory hover:text-night;
}

/* Item actif */
.nav-item.active {
  @apply bg-gradient-to-r from-sunset/10 to-magenta/10 text-night border border-sunset/20;
}
```

## 🎨 Responsive Design

### 1. **Mobile First**
```tsx
// Sidebar mobile
className="fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0"

// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### 2. **Breakpoints**
```css
/* Mobile */
@media (max-width: 768px) {
  .admin-sidebar {
    @apply -translate-x-full;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .admin-sidebar {
    @apply translate-x-0;
  }
}
```

## 🎨 Animations et Transitions

### 1. **Transitions Douces**
```css
.transition-smooth {
  @apply transition-all duration-300 ease-in-out;
}
```

### 2. **Animations Framer Motion**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Contenu */}
</motion.div>
```

### 3. **Hover Effects**
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="cursor-pointer transition-shadow hover:shadow-lg"
>
  {/* Contenu */}
</motion.div>
```

## 🎨 Accessibilité

### 1. **Contraste**
- Texte principal : `#2e2e2e` sur `#fdfbf8` (ratio 12.6:1)
- Texte secondaire : `#2e2e2eb3` sur `#fdfbf8` (ratio 4.5:1)
- Boutons : Blanc sur gradient (ratio > 4.5:1)

### 2. **Focus States**
```css
.focus-visible {
  @apply ring-2 ring-magenta ring-offset-2 outline-none;
}
```

### 3. **États Visuels**
```css
/* Loading */
.loading {
  @apply animate-spin border-b-2 border-magenta;
}

/* Error */
.error {
  @apply border-coral text-coral;
}

/* Success */
.success {
  @apply border-turquoise text-turquoise;
}
```

## 🎨 Bonnes Pratiques

### 1. **Cohérence**
- Toujours utiliser les couleurs de la palette Cocoti
- Respecter les espacements et bordures arrondies
- Maintenir la hiérarchie visuelle

### 2. **Performance**
- Utiliser les classes Tailwind optimisées
- Éviter les styles inline
- Préférer les transitions CSS aux animations JS

### 3. **Maintenabilité**
- Créer des composants réutilisables
- Documenter les variations de style
- Utiliser des tokens de design cohérents

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 1.0.0  
**Statut** : ✅ Appliqué
