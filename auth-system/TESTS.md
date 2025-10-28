# Guide de Test - Système d'Authentification

## 🧪 Scénarios de test

### 1. Inscription

#### Test 1.1: Inscription valide
```
✓ Aller sur la page
✓ Cliquer sur le formulaire d'inscription
✓ Remplir:
  - Nom d'utilisateur: "TestUser123"
  - Email: "test@example.com"
  - Mot de passe: "Password123"
  - Confirmation: "Password123"
✓ Cliquer sur "S'inscrire"
✓ Vérifier: Message de succès "Inscription réussie"
✓ Vérifier: Redirection vers formulaire de connexion
```

#### Test 1.2: Email déjà utilisé
```
✓ Créer un compte avec "test@example.com"
✓ Cliquer sur "S'inscrire"
✓ Créer un autre compte avec le même email
✓ Vérifier: Message "Cet email est déjà utilisé"
```

#### Test 1.3: Mots de passe non correspondants
```
✓ Remplir:
  - Mot de passe: "Password123"
  - Confirmation: "Password456"
✓ Cliquer sur "S'inscrire"
✓ Vérifier: Message "Les mots de passe ne correspondent pas"
```

#### Test 1.4: Mot de passe trop court
```
✓ Remplir:
  - Mot de passe: "Pass1"
✓ Cliquer sur "S'inscrire"
✓ Vérifier: Message "Le mot de passe doit contenir au moins 6 caractères"
```

#### Test 1.5: Email invalide
```
✓ Remplir:
  - Email: "invalidemail.com" (sans @)
✓ Cliquer sur "S'inscrire"
✓ Vérifier: Message "Veuillez entrer un email valide"
```

#### Test 1.6: Champs vides
```
✓ Laisser des champs vides
✓ Cliquer sur "S'inscrire"
✓ Vérifier: Message "Veuillez remplir tous les champs"
```

---

### 2. Connexion

#### Test 2.1: Connexion valide
```
✓ Créer un compte: "testuser@example.com" / "Password123"
✓ Cliquer sur "Se connecter"
✓ Remplir:
  - Email: "testuser@example.com"
  - Mot de passe: "Password123"
✓ Cliquer sur "Se connecter"
✓ Vérifier: Message de succès "Connexion réussie!"
✓ Vérifier: Redirection vers la page de profil
```

#### Test 2.2: Email incorrect
```
✓ Remplir:
  - Email: "wrong@example.com"
  - Mot de passe: "Password123"
✓ Cliquer sur "Se connecter"
✓ Vérifier: Message "Email ou mot de passe incorrect"
```

#### Test 2.3: Mot de passe incorrect
```
✓ Remplir:
  - Email: "testuser@example.com"
  - Mot de passe: "WrongPassword"
✓ Cliquer sur "Se connecter"
✓ Vérifier: Message "Email ou mot de passe incorrect"
```

#### Test 2.4: Champs vides
```
✓ Laisser les champs vides
✓ Cliquer sur "Se connecter"
✓ Vérifier: Message "Veuillez remplir tous les champs"
```

#### Test 2.5: Persistance de session
```
✓ Se connecter avec un compte
✓ Rafraîchir la page (F5 ou Ctrl+R)
✓ Vérifier: Rester connecté et voir la page de profil
```

---

### 3. Profil

#### Test 3.1: Affichage du profil
```
✓ Se connecter
✓ Vérifier l'affichage du nom d'utilisateur
✓ Vérifier l'affichage de l'email
✓ Vérifier l'affichage de "Membre depuis"
✓ Vérifier l'affichage de "Dernière modification"
```

#### Test 3.2: Les dates se mettent à jour
```
✓ Se connecter et noter la date
✓ Modifier le profil
✓ Revenir au profil
✓ Vérifier: La date "Dernière modification" a changé
```

---

### 4. Modification du profil

#### Test 4.1: Modifier le nom d'utilisateur
```
✓ Se connecter
✓ Cliquer sur "Modifier le profil"
✓ Changer le nom d'utilisateur
✓ Cliquer sur "Enregistrer"
✓ Vérifier: Mise à jour en page de profil
✓ Rafraîchir la page
✓ Vérifier: Le nouveau nom persiste
```

#### Test 4.2: Modifier l'email
```
✓ Cliquer sur "Modifier le profil"
✓ Changer l'email
✓ Cliquer sur "Enregistrer"
✓ Vérifier: Email mis à jour
```

#### Test 4.3: Modifier le mot de passe
```
✓ Cliquer sur "Modifier le profil"
✓ Laisser le champ "Nouveau mot de passe" vide
✓ Cliquer sur "Enregistrer"
✓ Se déconnecter
✓ Se reconnecter avec l'ancien mot de passe
✓ Vérifier: Connexion réussie (mot de passe inchangé)
```

#### Test 4.4: Changer le mot de passe
```
✓ Cliquer sur "Modifier le profil"
✓ Entrer "NewPassword123"
✓ Cliquer sur "Enregistrer"
✓ Se déconnecter
✓ Essayer de se connecter avec l'ancien mot de passe
✓ Vérifier: Échec de connexion
✓ Se connecter avec le nouveau mot de passe
✓ Vérifier: Connexion réussie
```

#### Test 4.5: Email déjà utilisé lors de la modification
```
✓ Créer 2 comptes: "user1@example.com" et "user2@example.com"
✓ Se connecter avec "user1@example.com"
✓ Cliquer sur "Modifier le profil"
✓ Changer l'email en "user2@example.com"
✓ Cliquer sur "Enregistrer"
✓ Vérifier: Message "Cet email est déjà utilisé"
```

#### Test 4.6: Annuler les modifications
```
✓ Cliquer sur "Modifier le profil"
✓ Remplir avec d'autres données
✓ Cliquer sur "Annuler"
✓ Vérifier: Retour à la vue profil sans sauvegarde
```

---

### 5. Déconnexion

#### Test 5.1: Déconnexion simple
```
✓ Se connecter
✓ Cliquer sur "Se déconnecter"
✓ Vérifier: Confirmation demandée
✓ Cliquer sur "Ok"
✓ Vérifier: Retour à la page de connexion
```

#### Test 5.2: Annuler la déconnexion
```
✓ Se connecter
✓ Cliquer sur "Se déconnecter"
✓ Cliquer sur "Annuler"
✓ Vérifier: Rester sur la page de profil
```

#### Test 5.3: Session supprimée après déconnexion
```
✓ Se connecter
✓ Cliquer sur "Se déconnecter" et confirmer
✓ Rafraîchir la page
✓ Vérifier: Rester sur la page de connexion
```

---

### 6. Suppression de compte

#### Test 6.1: Suppression avec confirmation
```
✓ Se connecter
✓ Cliquer sur "Supprimer le compte"
✓ Vérifier: Modal de confirmation
✓ Cliquer sur "Supprimer définitivement"
✓ Vérifier: Retour à la page de connexion
✓ Essayer de se connecter avec ce compte
✓ Vérifier: Impossible de se connecter
```

#### Test 6.2: Annuler la suppression
```
✓ Cliquer sur "Supprimer le compte"
✓ Cliquer sur "Annuler"
✓ Vérifier: Rester sur la page de profil
✓ Le compte doit toujours exister
```

#### Test 6.3: Vérifier la suppression complète
```
✓ Se connecter et noter l'email
✓ Créer un nouveau compte avec le même email après suppression
✓ Vérifier: Nouveau compte créé avec succès
```

---

### 7. Tests de responsivité

#### Test 7.1: Desktop (1920px)
```
✓ Ouvrir sur desktop
✓ Vérifier: Tous les éléments bien positionnés
✓ Vérifier: Texte lisible
```

#### Test 7.2: Tablet (768px)
```
✓ Redimensionner à 768px
✓ Vérifier: Interface adaptée
✓ Vérifier: Boutons accessibles
```

#### Test 7.3: Mobile (375px)
```
✓ Redimensionner à 375px
✓ Vérifier: Mise en page sur une colonne
✓ Vérifier: Boutons cliquables
```

---

### 8. Tests de performance

#### Test 8.1: Vitesse de chargement
```
✓ Mesurer le temps de chargement initial
✓ Vérifier: < 1 secondes
```

#### Test 8.2: Réactivité de l'interface
```
✓ Cliquer sur les boutons
✓ Vérifier: Réponse immédiate
```

#### Test 8.3: Gestion de nombreux utilisateurs
```
✓ Créer 100 comptes
✓ Vérifier: Pas de ralentissement
✓ Vérifier: Les performances restent bonnes
```

---

### 9. Tests de sécurité

#### Test 9.1: XSS (Injection de code)
```
✓ Essayer d'injecter du HTML: <script>alert('XSS')</script>
✓ Vérifier: Pas d'exécution du code
```

#### Test 9.2: Stockage des mots de passe
```
✓ Ouvrir la console du navigateur
✓ Taper: localStorage.getItem('users')
✓ Vérifier: Les mots de passe sont hachés
```

---

### 10. Cas limites

#### Test 10.1: Très long nom d'utilisateur
```
✓ Créer un compte avec 200 caractères
✓ Vérifier: Fonctionne correctement
```

#### Test 10.2: Caractères spéciaux
```
✓ Créer un compte avec: "Üsèr@123!#$%"
✓ Vérifier: Fonctionne correctement
```

#### Test 10.3: Espaces dans les champs
```
✓ Créer un compte avec des espaces
✓ Vérifier: Les espaces en début/fin sont supprimés
```

---

## ✅ Checklist finale

- [ ] Tous les formulaires valident correctement
- [ ] Les messages d'erreur sont clairs
- [ ] Les transitions sont fluides
- [ ] Les données persistent après rafraîchissement
- [ ] L'interface est responsive
- [ ] La sécurité basique est assurée
- [ ] Pas de console d'erreur
- [ ] Les boutons sont cliquables sur mobile
- [ ] Les champs de saisie sont accessibles

---

## 🔍 Comment signaler un bug

1. Reproduire le comportement
2. Noter les étapes exactes
3. Vérifier la console (F12 > Console)
4. Documenter avec des captures d'écran

---

**Dernière mise à jour**: 28/10/2025
