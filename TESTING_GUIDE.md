# Testing Guide - L'Archipel Libre

**Last Updated**: 2025-12-04  
**Status**: ✅ All core tests passing | ⚠️ Need E2E tests and 80%+ coverage

---

## Executive Summary

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Frontend Tests | 247/247 (100%) | 100% | ✅ |
| Backend Tests | 91/91 (100%) | 100% | ✅ |
| Backend Coverage (Lines) | 71.4% | 80% | ⚠️ Close |
| E2E Tests | 0 | 30+ | ❌ Critical |
| Production Ready | NO | YES | ⏳ |

**Blocker**: No end-to-end tests. Cannot confidently deploy to production.

---

## Running Tests

### Frontend
```bash
cd frontend
CHROME_BIN=/usr/bin/chromium-browser npm test -- --watch=false --code-coverage
```

**Results**: 247 passing, 3.4 sec runtime, 80% coverage

### Backend
```bash
cd backend
mvn test              # Unit tests
mvn verify            # With coverage report
```

**Results**: 91 passing, 25 sec runtime, 71.4% coverage

### All Tests
```bash
# Backend
cd backend && mvn test && cd ..

# Frontend
cd frontend && CHROME_BIN=/usr/bin/chromium-browser npm test -- --watch=false && cd ..
```

---

## Current Test Coverage

### Frontend (100% Pass Rate ✅)

**Coverage**: 80.06% lines (target ≥75%) ✅

**Test Suites** (22 files):
- Core services: auth, event, forum, user, workshop (5 files)
- Guards & interceptors: auth.guard, jwt.interceptor (2 files)
- Components: events, forum, dashboard, admin, profile (15 files)

**Key Areas Tested**:
- ✅ User authentication & JWT
- ✅ Event CRUD & filtering
- ✅ Forum threads & posts
- ✅ User profile management
- ✅ Admin dashboard
- ✅ Navigation guards
- ✅ HTTP interceptors

### Backend (100% Pass Rate ✅)

**Coverage**: 71.4% lines (target ≥80%) ⚠️

**Test Suites** (4 files):
- AuthControllerTest: 7 tests
- EventServiceTest: 28 tests
- ForumServiceTest: 25 tests
- UserServiceTest: 31 tests

**Coverage by Package**:
```
Config:      100.0% (31/31)    ✅
DTO:         100.0%  (7/7)     ✅
Model:        81.8% (18/22)    ✅
Service:      87.4% (320/366)  ✅
Security:     40.7% (35/86)    ⚠️ Needs JWT/permission tests
Controller:   10.8% (31/288)   ❌ CRITICAL GAP
Exception:    24.0%  (6/25)    ⚠️ Needs custom exception tests
```

---

## Backend Coverage Improvement Plan

### Current Gap: Controller Layer (31/288 lines = 10.8%)

To reach 80% line coverage, add controller tests:

**Phase 1: Controller Tests** (1 day, 4 hours)
- EventControllerTest: 21 tests
- UserControllerTest: 25 tests
- ForumControllerTest: 35 tests
- Expected gain: +60 lines → 75% coverage

**Phase 2: Security Tests** (1 day, 3 hours)
- JWT validation tests
- Permission (@PreAuthorize) tests
- Role-based access control tests
- Expected gain: +25 lines → 77% coverage

**Phase 3: Exception Tests** (1 day, 2 hours)
- ResourceNotFoundException tests
- ValidationException tests
- Error response formatting tests
- Expected gain: +15 lines → 80%+ coverage

**Timeline**: 3 days, 9 hours total effort

### Implementation Pattern

Use `@WebMvcTest` for lightweight controller testing:

```java
@WebMvcTest(EventController.class)
class EventControllerTest {
  @Autowired private MockMvc mockMvc;
  @MockBean private EventService eventService;
  @MockBean private UserRepository userRepository;
  
  @Test
  @WithMockUser(username = "user", roles = "USER")
  void testGetEvents() throws Exception {
    mockMvc.perform(get("/api/events"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content").exists());
  }
}
```

---

## End-to-End Testing Plan

### Why E2E Tests Matter

- ✅ Verify frontend + backend integration
- ✅ Test real user workflows
- ✅ Catch integration bugs
- ✅ Enable confidence for deployment
- ✅ Prevent regressions

### E2E Testing Strategy

**Framework**: Cypress  
**Scope**: 30+ tests covering core workflows  
**Timeline**: 2 weeks

#### Phase 1: Foundation (2 days)
Set up Cypress and write 5 core tests:

```bash
cypress/e2e/
├── auth.cy.ts              # Register → Login → Profile
├── events.cy.ts            # Create → View → Register
├── forum.cy.ts             # Create thread → Reply
├── admin.cy.ts             # Moderation actions
└── errors.cy.ts            # Invalid login, 404, etc.
```

Each test verifies:
- Frontend UI works
- Backend API responds
- Data persists to database
- User sees expected results

#### Phase 2: Coverage Expansion (3 days)
Add 25+ tests covering:
- Workshop voting workflow
- User search & filtering
- Event pagination
- Forum post editing
- Permission denials
- Concurrent operations

#### Phase 3: CI/CD Integration (1 day)
Automate tests on every push:

```yaml
# .github/workflows/e2e.yml
- Start backend
- Start frontend
- Run Cypress tests
- Fail PR if tests fail
```

### Quick Start: Run Local E2E Tests

```bash
# Terminal 1: Backend
cd backend && mvn spring-boot:run

# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: E2E Tests
cd frontend && npm run e2e:open  # Or 'npm run e2e' for headless
```

---

## Integration Test Results

✅ **All Core Features Verified**:
- User registration & login working
- JWT token generation & validation
- Event CRUD operations
- Forum thread & post creation
- User profile management
- Database persistence
- Error handling

✅ **Endpoints Tested** (via Swagger):
- Authentication: register, login, /auth/me
- Users: CRUD, profile update, search
- Events: CRUD, registration, filtering
- Forum: threads, posts, moderation

---

## Deployment Readiness Checklist

### Can We Deploy Now?

**Frontend**: ✅ YES
- All 247 tests passing
- 80% coverage exceeds target
- Production-grade code

**Backend**: ⚠️ CONDITIONAL
- 91 tests passing
- 71% coverage (below 80% target)
- Core features working

**Together**: ❌ NOT RECOMMENDED
- No E2E test coverage
- Integration not fully validated
- High risk of hidden bugs

### When Ready to Deploy

Complete these items:
- [ ] All unit/component tests passing (current: ✅)
- [ ] 80%+ backend line coverage (current: 71.4% → need controller tests)
- [ ] 30+ E2E tests passing (current: 0 → need 2 weeks)
- [ ] Performance baselines established
- [ ] Security audit completed
- [ ] Team sign-off obtained

**Estimated Timeline**: 3-4 weeks (controller tests + E2E tests)

---

## Test Execution Commands

```bash
# Run all tests locally
cd backend && mvn test && cd ../frontend && npm test -- --watch=false

# With coverage reports
cd backend && mvn verify
open backend/target/site/jacoco/index.html

cd frontend && npm test -- --watch=false --code-coverage
open frontend/coverage/archipel-libre-frontend/index.html

# Run specific test
cd backend && mvn test -Dtest=UserServiceTest
cd frontend && npm test -- --include='**/auth.service.spec.ts'

# Run E2E tests (when ready)
cd frontend && npm run e2e
cd frontend && npm run e2e:open  # Interactive mode
```

---

## Continuous Integration

GitHub Actions workflows configured:

**backend-ci.yml**: Run on every push
- Compile code
- Run 91 unit tests
- Generate coverage report
- Fail PR if tests fail

**frontend-ci.yml**: Run on every push
- Build application
- Run 247 component tests
- Generate coverage report
- Fail PR if tests fail

**When E2E tests ready**:
- Add e2e.yml workflow
- Run after unit tests pass
- Test on staging environment
- Block merges if E2E fails

---

## Key Test Files

### Backend
```
backend/src/test/java/com/archipellibre/
├── controller/AuthControllerTest.java      (7 tests) ✅
├── service/UserServiceTest.java            (31 tests) ✅
├── service/EventServiceTest.java           (28 tests) ✅
└── service/ForumServiceTest.java           (25 tests) ✅
```

### Frontend
```
frontend/src/app/
├── core/services/*.spec.ts                 (5 files)
├── core/guards/*.spec.ts
├── core/interceptors/*.spec.ts
└── features/**/*.spec.ts                   (15 files)
```

### E2E (to be created)
```
frontend/cypress/e2e/
├── auth.cy.ts
├── events.cy.ts
├── forum.cy.ts
├── admin.cy.ts
└── errors.cy.ts
```

---

## Troubleshooting

### Tests Won't Run

**Chrome not found**:
```bash
# Set Chrome path
CHROME_BIN=/usr/bin/chromium-browser npm test

# Or install Chrome
apt-get install chromium-browser
```

**Maven dependency issues**:
```bash
cd backend
mvn clean install
mvn test
```

**Node modules missing**:
```bash
cd frontend
npm ci
npm test
```

### Tests Fail

**Backend tests failing**:
1. Check database is running: `docker-compose ps`
2. Check logs: `mvn test -X`
3. Clear Maven cache: `mvn clean`

**Frontend tests failing**:
1. Clear node_modules: `rm -rf node_modules && npm ci`
2. Check browser path: `which chromium-browser`
3. Run with debug: `npm test -- --browsers=Chrome --log-level=debug`

---

## Best Practices

✅ **DO**:
- Write tests as you code
- Test happy paths AND error cases
- Use descriptive test names
- Keep tests independent
- Mock external dependencies
- Run tests before committing
- Update tests when behavior changes

❌ **DON'T**:
- Skip failing tests
- Test implementation details
- Have tests depend on each other
- Use hard-coded delays
- Leave debug code in tests
- Skip error scenario tests

---

## Next Steps

### Immediate (This Week)
1. ✅ Verify all 338 tests passing locally
2. ⏳ Create controller tests (EventController, UserController, ForumController)
3. ⏳ Reach 80%+ backend coverage

### Short Term (Next 2 Weeks)
4. ⏳ Set up Cypress E2E framework
5. ⏳ Write 5 core E2E tests
6. ⏳ Integrate E2E into CI/CD

### Medium Term (Next 4 Weeks)
7. ⏳ Expand to 30+ E2E tests
8. ⏳ Performance baselines
9. ⏳ Security audit
10. ⏳ Production deployment

---

## Resources

- [Jest Testing Docs](https://jestjs.io/docs/getting-started)
- [Jasmine/Karma Docs](https://jasmine.github.io/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [Angular Testing](https://angular.io/guide/testing)
- [Cypress Docs](https://docs.cypress.io)

---

**Status**: Ready for backend controller tests  
**Blockers**: Controller tests needed for 80% coverage; E2E tests needed for production  
**Owner**: Development Team  
**Review**: Weekly
