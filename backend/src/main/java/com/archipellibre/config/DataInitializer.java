package com.archipellibre.config;

import com.archipellibre.model.*;
import com.archipellibre.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final ForumThreadRepository forumThreadRepository;
    private final ForumPostRepository forumPostRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create users - Provence locals
        User admin = createUser(
            "admin_provence",
            "admin@archipellibre.fr",
            "Admin123!",
            UserRole.ADMIN,
            "Admin de L'Archipel",
            "Marseille, Provence"
        );

        User moderator1 = createUser(
            "marie_marseille",
            "marie@archipellibre.fr",
            "Marie123!",
            UserRole.MODERATOR,
            "Marie Dubois",
            "Marseille"
        );

        User moderator2 = createUser(
            "pierre_aix",
            "pierre@archipellibre.fr",
            "Pierre123!",
            UserRole.MODERATOR,
            "Pierre Moreau",
            "Aix-en-Provence"
        );

        User user1 = createUser(
            "jean_marseille",
            "jean@example.fr",
            "Jean123!",
            UserRole.USER,
            "Jean Leclerc",
            "Marseille - Vieux Port"
        );

        User user2 = createUser(
            "sophie_aix",
            "sophie@example.fr",
            "Sophie123!",
            UserRole.USER,
            "Sophie Bernard",
            "Aix-en-Provence"
        );

        User user3 = createUser(
            "luc_avignon",
            "luc@example.fr",
            "Luc123!",
            UserRole.USER,
            "Luc Garnier",
            "Avignon, Provence"
        );

        User user4 = createUser(
            "alice_salon",
            "alice@example.fr",
            "Alice123!",
            UserRole.USER,
            "Alice Fontaine",
            "Salon-de-Provence"
        );

        User user5 = createUser(
            "thomas_aubagne",
            "thomas@example.fr",
            "Thomas123!",
            UserRole.USER,
            "Thomas Rousseau",
            "Aubagne, Provence"
        );

        // Create forum threads - Community discussions about Provence
        ForumThread thread1 = createForumThread(
            "Bienvenue à L'Archipel Libre!",
            "Bonjour à tous les habitants de la Provence! Cette plateforme est dédiée au lien social " +
            "et à la technologie au service de nos communautés locales. Partagez vos idées, vos projets " +
            "et vos initiatives pour créer ensemble un avenir meilleur.",
            "Bienvenue",
            user1,
            false,
            false
        );

        ForumThread thread2 = createForumThread(
            "Initiatives numériques à Marseille",
            "Discussion sur les projets technologiques et digitaux en cours à Marseille. " +
            "Comment peut-on utiliser la technologie pour renforcer les liens sociaux dans notre ville?",
            "Technologie",
            user2,
            true,
            false
        );

        ForumThread thread3 = createForumThread(
            "Événements culturels Aix-en-Provence",
            "Partagez les événements culturels et sociaux à Aix. Des festivals aux ateliers en passant " +
            "par les rencontres communautaires, tous les événements qui rassemblent nos voisins.",
            "Culture",
            moderator1,
            false,
            false
        );

        ForumThread thread4 = createForumThread(
            "Challenges technologiques pour la souveraineté numérique",
            "Discutons des enjeux de souveraineté numérique en Provence. Comment protéger nos données? " +
            "Quelles alternatives aux géants du web? Partagez vos connaissances et expériences.",
            "Souveraineté Numérique",
            user3,
            false,
            false
        );

        // Create forum posts
        createForumPost(
            "Merci de cette initiative! J'suis ravi de rejoindre cette communauté locale. " +
            "Marseille a besoin de plus de projets comme celui-ci.",
            user2,
            thread1
        );

        createForumPost(
            "Excellente idée! Comment puis-je contribuer au projet?",
            user4,
            thread1
        );

        createForumPost(
            "À Marseille, on pourrait développer des ateliers numériques gratuits pour les jeunes du quartier.",
            user1,
            thread2
        );

        createForumPost(
            "Je suis intéressé par un partenariat. Nous avons un fab lab à Aix qui pourrait collaborer.",
            moderator2,
            thread2
        );

        createForumPost(
            "Le Festival de la Lumière revient en décembre à Aix! Incontournable pour ceux qui apprécient l'art numérique.",
            user2,
            thread3
        );

        createForumPost(
            "Les marchés de Provence sont aussi des lieux de rencontre importants. Peut-être créer des événements là?",
            user5,
            thread3
        );

        createForumPost(
            "La sécurité des données est cruciale. Nous devrions promouvoir l'utilisation de services décentralisés.",
            moderator1,
            thread4
        );

        // Create events - Local Provence events
        createEvent(
            "Atelier Numérique - Les bases du code",
            "Apprenez les bases de la programmation avec Python. Cet atelier gratuit est ouvert à tous, " +
            "du débutant au confirmé.",
            "Marseille - Centre Culturel",
            LocalDateTime.of(2025, 12, 15, 14, 0),
            LocalDateTime.of(2025, 12, 15, 17, 0),
            50,
            moderator1
        );

        createEvent(
            "Rencontre : Souveraineté Numérique en Provence",
            "Rejoignez-nous pour une discussion sur les enjeux de souveraineté numérique. " +
            "Acteurs locaux, développeurs et citoyens intéressés sont bienvnus!",
            "Aix-en-Provence - Café Polyglotte",
            LocalDateTime.of(2025, 12, 18, 19, 0),
            LocalDateTime.of(2025, 12, 18, 21, 0),
            30,
            moderator2
        );

        createEvent(
            "Festival d'Art Numérique",
            "Un événement célébrant la convergence de l'art et de la technologie. Installations interactives, " +
            "expositions et performances numériques.",
            "Marseille - Mucem",
            LocalDateTime.of(2025, 12, 20, 10, 0),
            LocalDateTime.of(2025, 12, 22, 18, 0),
            200,
            admin
        );

        createEvent(
            "Hackathon Social - Provence Digitale",
            "48 heures pour créer des solutions technologiques aux défis sociaux de notre région. " +
            "Équipes, mentors et prix à la clé!",
            "Salon-de-Provence - Innovation Hub",
            LocalDateTime.of(2026, 1, 10, 9, 0),
            LocalDateTime.of(2026, 1, 12, 17, 0),
            100,
            moderator1
        );

        createEvent(
            "Marché du Samedi - Rencontres entre Entrepreneurs Locaux",
            "Chaque samedi matin, rencontrez les entrepreneurs de Provence et discutez de vos projets. " +
            "Gratuit et ouvert à tous!",
            "Avignon - Place de l'Horloge",
            LocalDateTime.of(2025, 12, 6, 9, 0),
            LocalDateTime.of(2025, 12, 6, 12, 0),
            50,
            user3
        );

        createEvent(
            "Café Technique - Sécurité en ligne",
            "Café du dimanche matin dédié à la sécurité informatique. Apportez votre problème, " +
            "trouvez des solutions!",
            "Marseille - Café Victor",
            LocalDateTime.of(2025, 12, 7, 10, 0),
            LocalDateTime.of(2025, 12, 7, 11, 30),
            20,
            user1
        );
    }

    private User createUser(String username, String email, String password, UserRole role, 
                           String displayName, String location) {
        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .bio(displayName + " | " + location)
                .active(true)
                .build();
        return userRepository.save(user);
    }

    private ForumThread createForumThread(String title, String content, String category,
                                         User creator, boolean pinned, boolean locked) {
        ForumThread thread = ForumThread.builder()
                .title(title)
                .content(content)
                .category(category)
                .creator(creator)
                .pinned(pinned)
                .locked(locked)
                .posts(new ArrayList<>())
                .build();
        return forumThreadRepository.save(thread);
    }

    private ForumPost createForumPost(String content, User author, ForumThread thread) {
        ForumPost post = ForumPost.builder()
                .content(content)
                .author(author)
                .thread(thread)
                .build();
        return forumPostRepository.save(post);
    }

    private Event createEvent(String title, String description, String location, 
                            LocalDateTime startTime, LocalDateTime endTime,
                            int maxParticipants, User organizer) {
        Event event = Event.builder()
                .title(title)
                .description(description)
                .location(location)
                .startTime(startTime)
                .endTime(endTime)
                .maxParticipants(maxParticipants)
                .organizer(organizer)
                .status(EventStatus.SCHEDULED)
                .build();
        return eventRepository.save(event);
    }
}
