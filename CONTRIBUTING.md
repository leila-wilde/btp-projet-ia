# Contributing to L'Archipel Libre

Thank you for your interest in contributing to L'Archipel Libre! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/leila-wilde/btp-projet-ia/issues)
2. If not, create a new issue using the Bug Report template
3. Provide detailed information including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
   - Screenshots if applicable

### Suggesting Features

1. Check if the feature has already been requested
2. Create a new issue using the Feature Request template
3. Clearly describe:
   - The problem the feature solves
   - Your proposed solution
   - Alternative solutions considered
   - Any relevant mockups or examples

### Pull Requests

1. **Fork the repository** and create your branch from `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   ./scripts/run-tests.sh
   ```

4. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     ```
     feat: add user profile editing
     fix: resolve JWT token expiration issue
     docs: update API documentation
     test: add integration tests for events
     ```

5. **Push to your fork and submit a pull request**

## 📝 Code Style Guidelines

### Backend (Java)

- Follow standard Java conventions
- Use Lombok annotations to reduce boilerplate
- Write meaningful variable and method names
- Add comments only for complex logic
- Keep methods small and focused (Single Responsibility Principle)
- Use Spring Boot conventions for configuration

Example:
```java
@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    public Event createEvent(CreateEventRequest request, User organizer) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .organizer(organizer)
                .build();
        
        return eventRepository.save(event);
    }
}
```

### Frontend (Angular/TypeScript)

- Follow Angular style guide
- Use meaningful component and service names
- Keep components focused on presentation
- Move business logic to services
- Use RxJS operators effectively
- Prefer async pipe in templates

Example:
```typescript
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events$: Observable<Event[]>;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events$ = this.eventService.getAllEvents();
  }
}
```

## 🧪 Testing Requirements

### Backend Tests

- Write unit tests for services
- Write integration tests for repositories
- Test controllers with MockMvc
- Aim for 80%+ code coverage

Example:
```java
@SpringBootTest
class EventServiceTest {
    
    @Autowired
    private EventService eventService;
    
    @MockBean
    private EventRepository eventRepository;
    
    @Test
    void shouldCreateEvent() {
        // Arrange
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("Test Event");
        
        // Act
        Event result = eventService.createEvent(request, mockUser);
        
        // Assert
        assertNotNull(result);
        assertEquals("Test Event", result.getTitle());
    }
}
```

### Frontend Tests

- Write unit tests for components
- Write unit tests for services
- Test user interactions
- Test error scenarios

Example:
```typescript
describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let eventService: jasmine.SpyObj<EventService>;

  beforeEach(() => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getAllEvents']);
    
    TestBed.configureTestingModule({
      declarations: [ EventListComponent ],
      providers: [
        { provide: EventService, useValue: eventServiceSpy }
      ]
    });
    
    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
  });

  it('should load events on init', () => {
    const mockEvents = [/* mock data */];
    eventService.getAllEvents.and.returnValue(of(mockEvents));
    
    component.ngOnInit();
    
    component.events$.subscribe(events => {
      expect(events).toEqual(mockEvents);
    });
  });
});
```

## 🔒 Security Guidelines

- Never commit secrets, API keys, or passwords
- Use environment variables for sensitive data
- Validate all user input
- Use parameterized queries (JPA does this automatically)
- Implement proper error handling without exposing internal details
- Keep dependencies up to date

## 📚 Documentation

- Update README.md if you change setup steps
- Update API documentation for new endpoints
- Document complex algorithms or business logic
- Keep CHANGELOG.md updated with your changes

## 🌍 Internationalization

- All user-facing text should be translatable
- Provide both English and French translations
- Use i18n for frontend text
- Store messages in message bundles for backend

## ✅ Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] No merge conflicts with target branch
- [ ] Commits are clear and descriptive
- [ ] PR description explains what and why

## 🚀 Release Process

1. All changes merged to `develop` branch
2. Create release branch from `develop`
3. Update version numbers
4. Update CHANGELOG.md
5. Test release candidate
6. Merge to `main` and tag release
7. Deploy to production

## 📞 Getting Help

- Create a discussion for questions
- Check existing issues and PRs
- Review documentation in `/docs`
- Contact maintainers: [Leila Wilde](https://github.com/leila-wilde), [Louis Cordier](https://github.com/louis-cordier)

## 🎯 Development Priorities

Current focus areas:
1. Core authentication and authorization
2. Event management functionality
3. Forum discussion features
4. Workshop proposal system
5. UI/UX improvements

Thank you for contributing to L'Archipel Libre! 🎉

---

# Contribuer à L'Archipel Libre

Merci de votre intérêt pour contribuer à L'Archipel Libre ! Ce document fournit des directives pour contribuer au projet.

## 🤝 Comment Contribuer

### Signaler des Bugs

1. Vérifiez si le bug a déjà été signalé dans [Issues](https://github.com/leila-wilde/btp-projet-ia/issues)
2. Sinon, créez un nouveau problème en utilisant le modèle Bug Report
3. Fournissez des informations détaillées incluant :
   - Étapes pour reproduire
   - Comportement attendu
   - Comportement réel
   - Détails de l'environnement
   - Captures d'écran si applicable

### Suggérer des Fonctionnalités

1. Vérifiez si la fonctionnalité a déjà été demandée
2. Créez un nouveau problème en utilisant le modèle Feature Request
3. Décrivez clairement :
   - Le problème que la fonctionnalité résout
   - Votre solution proposée
   - Solutions alternatives considérées
   - Maquettes ou exemples pertinents

## 📝 Directives de Style de Code

Suivez les conventions standard pour Java et Angular/TypeScript. Gardez le code propre, lisible et bien testé.

## ✅ Liste de Vérification des Pull Requests

Avant de soumettre votre PR, assurez-vous :

- [ ] Le code suit les directives de style du projet
- [ ] Tous les tests passent localement
- [ ] Nouveaux tests ajoutés pour les nouvelles fonctionnalités
- [ ] Documentation mise à jour
- [ ] Pas de conflits de fusion avec la branche cible
- [ ] Les commits sont clairs et descriptifs

Merci de contribuer à L'Archipel Libre ! 🎉
