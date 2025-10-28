# Système d'Authentification Complet

Un système d'authentification web moderne et responsif avec interface utilisateur intuitive.

## ✨ Fonctionnalités

- ✅ **Inscription** - Créer un nouveau compte avec validation
- ✅ **Connexion** - Accès sécurisé au compte
- ✅ **Profil** - Consulter ses informations personnelles
- ✅ **Modification du profil** - Mettre à jour username, email et mot de passe
- ✅ **Déconnexion** - Quitter de manière sécurisée
- ✅ **Suppression de compte** - Supprimer définitivement le compte
- ✅ **Persistance** - Données sauvegardées en localStorage
- ✅ **Validation** - Vérification des emails et mots de passe
- ✅ **Responsive** - Interface adaptée à tous les appareils

## 📁 Structure des fichiers

```
auth-system/
├── index.html      # Structure HTML
├── styles.css      # Styles et mise en page
├── auth.js         # Logique d'authentification
├── README.md       # Cette documentation
└── TESTS.md        # Guide de test
```

## 🚀 Utilisation

1. Ouvrir `index.html` dans un navigateur web
2. Créer un compte ou se connecter
3. Gérer son profil

## 📋 Détails des fonctionnalités

### Inscription
- Validation du format email
- Vérification de la force du mot de passe (min 6 caractères)
- Confirmation du mot de passe
- Vérification des doublons

### Connexion
- Authentification par email et mot de passe
- Gestion des sessions avec localStorage
- Messages d'erreur clairs

### Profil
- Affichage du nom d'utilisateur et email
- Date d'inscription
- Date de dernière modification

### Modification du profil
- Changement du nom d'utilisateur
- Changement d'email
- Changement du mot de passe (optionnel)
- Validation complète

### Suppression de compte
- Confirmation obligatoire
- Suppression définitive des données
- Déconnexion automatique

## 🔐 Sécurité

**Important:** Le système actuel utilise un hash simplifié pour la démo. En production, utilisez:
- **bcryptjs** pour le hachage des mots de passe
- **JWT** pour les tokens de session
- **Serveur backend** pour la validation
- **HTTPS** pour le chiffrement des données

## 💾 Stockage des données

Les données sont actuellement stockées en localStorage (côté client):
```javascript
{
  "users": {
    "email@example.com": {
      "username": "NomUtilisateur",
      "email": "email@example.com",
      "password": "hashedPassword",
      "createdAt": "28/10/2025 10:59:00",
      "updatedAt": "28/10/2025 10:59:00"
    }
  },
  "currentUser": { /* Données de l'utilisateur connecté */ }
}
```

## 🧪 Tests

Voir le fichier `TESTS.md` pour les scénarios de test complets.

## 📱 Responsivité

L'interface s'adapte parfaitement à:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🎨 Design

- **Couleur primaire**: #667eea (Violet)
- **Couleur d'alerte**: #e74c3c (Rouge)
- **Couleur de succès**: #27ae60 (Vert)
- **Police**: Segoe UI, Tahoma, Geneva, Verdana

## 🔄 Intégration future

Pour intégrer ce système au projet global:

1. Remplacer le localStorage par une API backend
2. Ajouter l'authentification JWT
3. Intégrer avec les autres modules du projet
4. Implémenter les rôles et permissions

## 📝 Notes

- Les mots de passe sont hachés (simplement en démo)
- Les sessions persistent via localStorage
- Le système est entièrement modulaire et peut être intégré facilement

## 👨‍💻 Développement

Pour modifier les styles, voir `styles.css`
Pour modifier la logique, voir `auth.js`
Pour modifier la structure, voir `index.html`

---

**Version**: 1.0
**Date**: 28/10/2025
