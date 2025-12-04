# Quick Reference - Testing & Coverage

## Run Tests

```bash
# Frontend (247 tests)
cd frontend && CHROME_BIN=/usr/bin/chromium-browser npm test -- --watch=false

# Backend (91 tests)
cd backend && mvn test

# Both with coverage
cd backend && mvn verify
cd frontend && CHROME_BIN=/usr/bin/chromium-browser npm test -- --watch=false --code-coverage
```

## Current Status

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Frontend Tests | 247/247 | ✅ 100% | ✅ PASS |
| Backend Tests | 91/91 | ✅ 100% | ✅ PASS |
| Frontend Coverage | 80.06% | ≥75% | ✅ OK |
| Backend Coverage | 71.4% | ≥80% | ⚠️ Need 8.6% |
| E2E Tests | 0 | ≥30 | ❌ Need 30+ |

## Blockers for Deployment

- [ ] Backend coverage 80%+ (currently 71.4%)
- [ ] 30+ E2E tests passing (currently 0)

## Next Week Actions

**Backend Coverage** (3 days):
1. Create EventControllerTest.java
2. Create UserControllerTest.java  
3. Create ForumControllerTest.java

**Result**: 71.4% → 80%+

## View Coverage Reports

```bash
# Frontend
open frontend/coverage/archipel-libre-frontend/index.html

# Backend
open backend/target/site/jacoco/index.html
```

## Documentation

- **TESTING_GUIDE.md** - Complete testing guide with commands
- **BACKEND_COVERAGE_IMPROVEMENT_PLAN.md** - 3-day plan to reach 80%
- **TESTING_DEPLOYMENT.md** - Deploy & integration info

