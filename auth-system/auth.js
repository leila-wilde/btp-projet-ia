// Classe pour gérer l'authentification
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.initializeApp();
    }

    // Charger les utilisateurs depuis le localStorage
    loadUsers() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : {};
    }

    // Charger l'utilisateur actuellement connecté
    loadCurrentUser() {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    }

    // Sauvegarder les utilisateurs
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Sauvegarder l'utilisateur actuellement connecté
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    // Initialiser l'application
    initializeApp() {
        this.attachEventListeners();
        this.checkAuthStatus();
    }

    // Attacher les écouteurs d'événements
    attachEventListeners() {
        document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignup(e));
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('edit-form').addEventListener('submit', (e) => this.handleEdit(e));
    }

    // Vérifier l'état d'authentification
    checkAuthStatus() {
        if (this.currentUser) {
            this.showProfilePage();
        } else {
            this.showAuthPage();
        }
    }

    // Valider l'email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Hasher un mot de passe (simple hash pour la démo, à remplacer par bcrypt en production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    // Gérer l'inscription
    handleSignup(e) {
        e.preventDefault();

        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            this.showMessage('Veuillez remplir tous les champs', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Veuillez entrer un email valide', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        if (this.users[email]) {
            this.showMessage('Cet email est déjà utilisé', 'error');
            return;
        }

        // Créer l'utilisateur
        this.users[email] = {
            username,
            email,
            password: this.hashPassword(password),
            createdAt: new Date().toLocaleString('fr-FR'),
            updatedAt: new Date().toLocaleString('fr-FR')
        };

        this.saveUsers();
        this.showMessage('Inscription réussie! Veuillez vous connecter.', 'success');

        // Réinitialiser le formulaire
        document.getElementById('signup-form').reset();
        setTimeout(() => this.toggleForm(), 1500);
    }

    // Gérer la connexion
    handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            this.showMessage('Veuillez remplir tous les champs', 'error');
            return;
        }

        const user = this.users[email];
        if (!user || user.password !== this.hashPassword(password)) {
            this.showMessage('Email ou mot de passe incorrect', 'error');
            return;
        }

        this.currentUser = {
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        this.saveCurrentUser();
        this.showMessage('Connexion réussie!', 'success');

        setTimeout(() => {
            document.getElementById('login-form').reset();
            this.showProfilePage();
        }, 1000);
    }

    // Afficher la page d'authentification
    showAuthPage() {
        document.getElementById('auth-container').classList.add('active');
        document.getElementById('profile-container').classList.remove('active');
    }

    // Afficher la page de profil
    showProfilePage() {
        document.getElementById('auth-container').classList.remove('active');
        document.getElementById('profile-container').classList.add('active');
        this.loadProfileData();
    }

    // Charger les données du profil
    loadProfileData() {
        if (this.currentUser) {
            document.getElementById('profile-username').textContent = this.currentUser.username;
            document.getElementById('profile-email').textContent = this.currentUser.email;
            document.getElementById('profile-created').textContent = this.currentUser.createdAt;
            document.getElementById('profile-updated').textContent = this.currentUser.updatedAt;
        }
    }

    // Gérer la modification du profil
    handleEdit(e) {
        e.preventDefault();

        const newUsername = document.getElementById('edit-username').value.trim();
        const newEmail = document.getElementById('edit-email').value.trim();
        const newPassword = document.getElementById('edit-password').value;

        // Validation
        if (!newUsername || !newEmail) {
            this.showMessage('Veuillez remplir tous les champs requis', 'error');
            return;
        }

        if (!this.isValidEmail(newEmail)) {
            this.showMessage('Veuillez entrer un email valide', 'error');
            return;
        }

        if (newPassword && newPassword.length < 6) {
            this.showMessage('Le nouveau mot de passe doit contenir au moins 6 caractères', 'error');
            return;
        }

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (newEmail !== this.currentUser.email && this.users[newEmail]) {
            this.showMessage('Cet email est déjà utilisé', 'error');
            return;
        }

        // Mettre à jour l'utilisateur
        const oldEmail = this.currentUser.email;
        const userToUpdate = this.users[oldEmail];

        userToUpdate.username = newUsername;
        userToUpdate.email = newEmail;
        if (newPassword) {
            userToUpdate.password = this.hashPassword(newPassword);
        }
        userToUpdate.updatedAt = new Date().toLocaleString('fr-FR');

        // Si l'email a changé, créer une nouvelle entrée
        if (newEmail !== oldEmail) {
            this.users[newEmail] = userToUpdate;
            delete this.users[oldEmail];
        }

        this.currentUser.username = newUsername;
        this.currentUser.email = newEmail;
        this.currentUser.updatedAt = userToUpdate.updatedAt;

        this.saveUsers();
        this.saveCurrentUser();

        this.showMessage('Profil mis à jour avec succès!', 'success');

        setTimeout(() => {
            this.cancelEdit();
            this.loadProfileData();
        }, 1000);
    }

    // Afficher un message
    showMessage(message, type) {
        const messageEl = document.getElementById('auth-message');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;

        setTimeout(() => {
            messageEl.className = 'message';
        }, 5000);
    }

    // Se déconnecter
    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
            this.currentUser = null;
            this.saveCurrentUser();
            this.showAuthPage();
            this.resetForms();
        }
    }

    // Supprimer le compte
    deleteAccount() {
        if (this.currentUser) {
            delete this.users[this.currentUser.email];
            this.saveUsers();
            this.currentUser = null;
            this.saveCurrentUser();
            this.showAuthPage();
            this.resetForms();
            this.showMessage('Compte supprimé avec succès.', 'success');
        }
    }

    // Réinitialiser les formulaires
    resetForms() {
        document.getElementById('signup-form').reset();
        document.getElementById('login-form').reset();
        document.getElementById('edit-form').reset();
        document.getElementById('signup-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
    }
}

// Initialiser le système au chargement de la page
let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
});

// Fonctions globales appelées depuis le HTML

function toggleForm() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    signupForm.classList.toggle('active');
    loginForm.classList.toggle('active');

    document.getElementById('auth-message').className = 'message';
}

function editProfile() {
    document.getElementById('profile-view').classList.remove('active');
    document.getElementById('profile-edit').classList.add('active');

    // Pré-remplir le formulaire
    document.getElementById('edit-username').value = authSystem.currentUser.username;
    document.getElementById('edit-email').value = authSystem.currentUser.email;
}

function cancelEdit() {
    document.getElementById('profile-view').classList.add('active');
    document.getElementById('profile-edit').classList.remove('active');
    document.getElementById('edit-form').reset();
}

function showDeleteConfirm() {
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteConfirm() {
    document.getElementById('delete-modal').classList.remove('active');
}

function deleteAccount() {
    closeDeleteConfirm();
    authSystem.deleteAccount();
}

function logout() {
    authSystem.logout();
}
