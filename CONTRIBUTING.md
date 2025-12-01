# Contributing Guide

## Code Standards

### Backend (Java/Spring)

```java
// Package structure
com.archipellibre.{controller|service|repository|model|dto}

// Naming
class UserService { }          // PascalCase
public void getUserById() { }  // camelCase
private static final String CONSTANT = "";  // UPPER_CASE

// Annotations
@Service
@Transactional
public class UserService { }

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req) { }

@Valid @NotNull @NotBlank
private String username;
```

### Frontend (TypeScript/Angular)

```typescript
// File naming
user.service.ts          // kebab-case
user-detail.component.ts // kebab-case

// Class naming
export class UserService { }           // PascalCase
private getUserById(): Observable { }  // camelCase

// Best practices
- Use reactive forms
- Unsubscribe in onDestroy
- Type everything (avoid any)
- Use trackBy in *ngFor
```

## Testing

**Backend**: 
```bash
mvn test
mvn verify
```

**Frontend**:
```bash
npm test -- --watch=false --code-coverage
npm run lint
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/user-management

# Make changes, test, commit
git add .
git commit -m "feat: add user deletion endpoint"

# Push and create PR
git push origin feature/user-management

# PR review → merge to develop → release branch → main
```

## Commit Message Format

```
type(scope): subject

feat(auth): add JWT refresh token
fix(events): correct pagination offset
refactor(forum): simplify post retrieval
docs(readme): update setup instructions
```

## Pull Request Checklist

- [ ] Tests pass (both backend and frontend)
- [ ] No console errors/warnings
- [ ] Code follows standards (see above)
- [ ] Documentation updated if needed
- [ ] Tested in Swagger (if API change)
- [ ] Tested in browser (if frontend change)

## Security

- ✅ Use BCrypt for passwords (Spring Security default)
- ✅ JWT for API authentication
- ✅ @Secured on admin endpoints
- ✅ Input validation on all endpoints
- ✅ No secrets in code (use environment variables)
- ❌ Don't commit passwords or API keys

---

**Questions?** See [DEVELOPMENT.md](DEVELOPMENT.md) for architecture details.
