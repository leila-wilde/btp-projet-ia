# Guide d'Intégration du Système d'Authentification

## 📌 Vue d'ensemble

Ce guide explique comment intégrer le système d'authentification au projet global une fois qu'il sera contrôlé et efficace.

## 🔄 Étapes d'intégration

### Phase 1: Préparation du backend

#### 1.1 Créer une API REST

Créer des endpoints pour:
- `POST /api/auth/signup` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/profile` - Récupérer le profil
- `PUT /api/auth/profile` - Modifier le profil
- `DELETE /api/auth/profile` - Supprimer le compte

#### 1.2 Exemple avec Node.js/Express

```javascript
// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Valider les données
  // Hasher le mot de passe avec bcryptjs
  // Sauvegarder en base de données
  // Retourner le token JWT
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Vérifier les identifiants
  // Comparer les mots de passe avec bcryptjs
  // Générer et retourner un token JWT
});

// ... autres endpoints
```

### Phase 2: Modification du système d'authentification

#### 2.1 Remplacer le localStorage par les appels API

```javascript
// Dans auth.js
async handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Sauvegarder le token JWT
      localStorage.setItem('token', data.token);
      this.currentUser = data.user;
      this.showProfilePage();
    } else {
      this.showMessage(data.message, 'error');
    }
  } catch (error) {
    this.showMessage('Erreur de connexion', 'error');
  }
}
```

#### 2.2 Ajouter les headers d'authentification

```javascript
// Fonction helper pour les requêtes authentifiées
async function apiCall(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(endpoint, options);
  return response.json();
}
```

### Phase 3: Intégration avec le reste du projet

#### 3.1 Créer un conteneur principal

```html
<!-- main.html -->
<html>
<head>
    <link rel="stylesheet" href="auth-system/styles.css">
</head>
<body>
    <div id="main-app">
        <!-- Système d'authentification -->
        <div id="auth-module"></div>
        
        <!-- Autres modules du projet -->
        <div id="other-modules"></div>
    </div>
    
    <script src="auth-system/auth.js"></script>
    <script src="other-modules/module1.js"></script>
</body>
</html>
```

#### 3.2 Créer un middleware d'authentification

```javascript
// middleware/auth.js
class AuthMiddleware {
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  
  static requireAuth(callback) {
    if (!this.isAuthenticated()) {
      window.location.href = '/auth-system/index.html';
      return;
    }
    callback();
  }
  
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}

// Utilisation
AuthMiddleware.requireAuth(() => {
  console.log('User authenticated:', AuthMiddleware.getCurrentUser());
});
```

#### 3.3 Ajouter une barre de navigation globale

```html
<nav class="global-navbar">
  <div class="logo">Mon App</div>
  <div class="nav-links">
    <a href="/">Accueil</a>
    <a href="/dashboard">Tableau de bord</a>
  </div>
  <div class="user-menu">
    <span id="username"></span>
    <button onclick="logout()">Déconnexion</button>
  </div>
</nav>
```

### Phase 4: Gestion des rôles et permissions

#### 4.1 Ajouter les rôles à la base de données

```javascript
// Dans le modèle utilisateur
{
  id: 1,
  username: "testuser",
  email: "test@example.com",
  password: "hashedPassword",
  role: "user", // admin, moderator, user
  permissions: ["read", "write"],
  createdAt: "2025-10-28",
  updatedAt: "2025-10-28"
}
```

#### 4.2 Vérifier les permissions

```javascript
function hasPermission(permission) {
  const user = AuthMiddleware.getCurrentUser();
  return user.permissions && user.permissions.includes(permission);
}

function canModerate() {
  const user = AuthMiddleware.getCurrentUser();
  return user.role === 'admin' || user.role === 'moderator';
}

// Utilisation
if (hasPermission('delete')) {
  showDeleteButton();
}
```

### Phase 5: Gestion des sessions

#### 5.1 Implémenter la validation du token

```javascript
// auth.js
async validateToken() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const response = await fetch('/api/auth/validate', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

#### 5.2 Gérer l'expiration du token

```javascript
setInterval(async () => {
  if (!await authSystem.validateToken()) {
    authSystem.logout();
    alert('Votre session a expiré. Veuillez vous reconnecter.');
  }
}, 5 * 60 * 1000); // Toutes les 5 minutes
```

### Phase 6: Tests d'intégration

#### 6.1 Tester avec une vraie base de données

```bash
# Installer les dépendances
npm install express bcryptjs jsonwebtoken mysql2

# Lancer le serveur
npm start

# Tester les endpoints
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test123"}'
```

#### 6.2 Tester le flux complet

```javascript
// test.js
async function testIntegration() {
  // 1. Signup
  const signupRes = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123'
    })
  });
  console.log('Signup:', signupRes.ok);
  
  // 2. Login
  const loginRes = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'Test123'
    })
  });
  const loginData = await loginRes.json();
  console.log('Login:', loginRes.ok, 'Token:', !!loginData.token);
  
  // 3. Get profile
  const profileRes = await fetch('/api/auth/profile', {
    headers: { 'Authorization': `Bearer ${loginData.token}` }
  });
  console.log('Profile:', profileRes.ok);
}
```

## 🗂️ Structure du projet après intégration

```
projet-ia/
├── auth-system/
│   ├── index.html
│   ├── styles.css
│   ├── auth.js
│   └── README.md
├── api/
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   └── authController.js
│   └── models/
│       └── User.js
├── frontend/
│   ├── pages/
│   ├── components/
│   └── styles/
├── database/
│   └── schema.sql
├── server.js
└── package.json
```

## 🔒 Considérations de sécurité

- ✅ Utiliser HTTPS en production
- ✅ Valider toutes les entrées côté serveur
- ✅ Utiliser bcryptjs pour hasher les mots de passe
- ✅ Implémenter CSRF protection
- ✅ Ajouter rate limiting pour les tentatives de connexion
- ✅ Utiliser les cookies HttpOnly pour les tokens
- ✅ Implémenter l'authentification à deux facteurs (2FA)

## 📊 Checklist d'intégration

- [ ] Backend API créé
- [ ] Base de données configurée
- [ ] JWT implémenté
- [ ] Tests du backend passés
- [ ] Frontend modifié pour l'API
- [ ] Middleware d'authentification en place
- [ ] Permissions et rôles implémentés
- [ ] Tests d'intégration passés
- [ ] Documentation mise à jour
- [ ] Sécurité vérifiée
- [ ] Déploiement en staging
- [ ] Tests de charge effectués
- [ ] Prêt pour la production

## 🚀 Déploiement

```bash
# Variables d'environnement (.env)
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
NODE_ENV=production

# Déployer sur Heroku/AWS/etc.
git push heroku main
```

---

**Dernière mise à jour**: 28/10/2025
