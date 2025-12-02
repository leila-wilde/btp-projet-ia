# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in L'Archipel Libre, please email **security@archipellibre.dev** with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

**Do not** open public issues for security vulnerabilities.

## Security Measures

### Authentication & Authorization
- ✅ JWT-based authentication with refresh tokens
- ✅ BCrypt password hashing (min cost: 12)
- ✅ Role-based access control (RBAC)
- ✅ Spring Security configuration with CORS protection
- ✅ Secure headers (HSTS, CSP, X-Frame-Options)

### Data Protection
- ✅ PostgreSQL with encrypted connections
- ✅ Secrets management via `.env` files (never committed)
- ✅ Input validation on all API endpoints
- ✅ HTTPS enforcement in production

### Dependencies
- ✅ Weekly OWASP Dependency-Check scans
- ✅ Automated dependency updates via Dependabot
- ✅ Security advisories monitoring

### Code Quality
- ✅ SpotBugs static analysis for bug detection
- ✅ Checkstyle enforcement (Google style guide)
- ✅ Code coverage requirements (70% minimum)
- ✅ ESLint + Prettier for frontend code consistency

## Best Practices for Contributors

1. **Never commit secrets**
   - Use `.env` files (git-ignored)
   - Use GitHub Secrets for CI/CD

2. **Validate all inputs**
   - Server-side validation mandatory
   - XSS protection on frontend
   - SQL injection prevention via JPA

3. **Keep dependencies updated**
   - Run `mvn dependency:check` regularly
   - Update Node packages: `npm audit fix`

4. **Code review requirements**
   - Minimum 1 approval before merge
   - Security checks must pass in CI

5. **Password storage**
   ```java
   // ✅ CORRECT
   passwordEncoder.encode(rawPassword)
   
   // ❌ WRONG
   String plainPassword = request.getPassword()
   ```

## Security Headers Configuration

The backend includes:
```
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Docker Security

- ✅ Non-root user in containers (recommended)
- ✅ Health checks on all services
- ✅ Resource limits (CPU/Memory)
- ✅ No hardcoded secrets in images
- ✅ Alpine base images for minimal attack surface

## Deployment Security Checklist

Before deploying to production:
- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET (256+ bits)
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up WAF (Web Application Firewall)
- [ ] Enable database encryption
- [ ] Configure backup strategy
- [ ] Set up monitoring & alerting
- [ ] Review security group rules
- [ ] Run full security scan

## Third-Party Dependencies

### Backend
- Spring Security 6.x - Authentication & authorization
- JJWT 0.12.3 - JWT token handling
- PostgreSQL Driver 42.x - Database access

### Frontend
- Angular 17 - XSS protection built-in
- Angular Material - Accessible UI components
- RxJS - Reactive streams

## Known Issues & Mitigations

None currently documented. Please report via security email.

---

**Last Updated**: December 2, 2025
