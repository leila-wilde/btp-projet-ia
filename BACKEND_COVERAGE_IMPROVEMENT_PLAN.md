# Backend Coverage Improvement - Action Plan

**See**: [TESTING_GUIDE.md](TESTING_GUIDE.md) for overview  
**Target**: 80%+ line coverage  
**Current**: 71.4% (2972/4160 lines)  
**Gap**: +8.6% needed

---

## Quick Summary

| Coverage | Current | Target | Gap | Files to Add |
|----------|---------|--------|-----|--------------|
| Lines | 71.4% | 80% | +8.6% | 80 controller tests |
| Instructions | 66.9% | 75% | +8.1% | Security tests |
| Branches | 50.9% | 60% | +9.1% | Exception tests |
| Methods | 68.5% | 75% | +6.5% | - |
| Classes | 100.0% | 100% | 0% | ✅ Complete |

---

## What's Blocking 80%?

**Controller Tests** - Currently 10.8% coverage
- EventController needs 21 tests
- UserController needs 25 tests  
- ForumController needs 35 tests
- **Impact**: +60 lines = 3% gain

**Security Tests** - Currently 40.7% coverage
- JWT validation not tested
- Permission checks (@PreAuthorize) not tested
- **Impact**: +25 lines = 1% gain

**Exception Tests** - Currently 24.0% coverage
- Custom exceptions not tested
- Error responses not tested
- **Impact**: +15 lines = 0.5% gain

---

## 3-Day Implementation Plan

### Day 1: Controller Tests (4 hours)
```bash
# Create these files with @WebMvcTest pattern:
EventControllerTest.java      # 21 tests
UserControllerTest.java       # 25 tests
```
Expected: 71.4% → 73.5%

### Day 2: More Controller Tests (3 hours)
```bash
ForumControllerTest.java      # 35 tests
```
Expected: 73.5% → 75%

### Day 3: Security & Exception Tests (2 hours)
```bash
SecurityConfigTest.java       # Permission tests
ExceptionHandlerTest.java     # Exception tests
```
Expected: 75% → 80%+

---

## Test Template

```java
@WebMvcTest(EventController.class)
class EventControllerTest {
  @Autowired private MockMvc mockMvc;
  @MockBean private EventService eventService;
  @MockBean private UserRepository userRepository;
  
  @Test
  @WithMockUser(username = "user", roles = "USER")
  void testGetEvents() throws Exception {
    when(eventService.getAllEvents(any())).thenReturn(page);
    
    mockMvc.perform(get("/api/events"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content").exists());
  }
}
```

---

## Commands

```bash
# Run tests with coverage
cd backend && mvn verify

# View coverage report
open backend/target/site/jacoco/index.html

# Run specific test
mvn test -Dtest=EventControllerTest
```

---

**Effort**: 9 hours over 3 days  
**Expected Outcome**: 80%+ line coverage  
**Owner**: Backend Team


