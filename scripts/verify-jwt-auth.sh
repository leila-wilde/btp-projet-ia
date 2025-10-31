#!/bin/bash

# Integration Verification Script
# Run this to verify the JWT authentication setup is complete

echo "======================================"
echo "Angular JWT Authentication Verification"
echo "======================================"
echo ""

# Check frontend directory
echo "✓ Checking frontend structure..."
MISSING=0

check_file() {
  if [ -f "$1" ]; then
    echo "  ✓ $1"
  else
    echo "  ✗ MISSING: $1"
    MISSING=$((MISSING + 1))
  fi
}

echo ""
echo "Core Services & Guards:"
check_file "frontend/src/app/core/services/auth.service.ts"
check_file "frontend/src/app/core/services/auth.service.spec.ts"
check_file "frontend/src/app/core/interceptors/jwt.interceptor.ts"
check_file "frontend/src/app/core/interceptors/jwt.interceptor.spec.ts"
check_file "frontend/src/app/core/guards/auth.guard.ts"

echo ""
echo "Components:"
check_file "frontend/src/app/features/auth/login/login.component.ts"
check_file "frontend/src/app/features/auth/register/register.component.ts"
check_file "frontend/src/app/features/home/home.component.ts"

echo ""
echo "Configuration:"
check_file "frontend/src/app/app.routes.ts"
check_file "frontend/src/app/app.component.ts"
check_file "frontend/src/main.ts"
check_file "frontend/src/app/models/user.model.ts"

echo ""
echo "Documentation:"
check_file "docs/FRONTEND_JWT_AUTH.md"
check_file "docs/FRONTEND_AUTH_SUMMARY.md"
check_file "docs/JWT_QUICK_REFERENCE.md"

echo ""
echo "======================================"
if [ $MISSING -eq 0 ]; then
  echo "✅ All files present!"
else
  echo "❌ Missing $MISSING files!"
  exit 1
fi

# Check for required dependencies
echo ""
echo "Checking npm dependencies..."
cd frontend

if grep -q "@angular/router" package.json; then
  echo "  ✓ @angular/router"
else
  echo "  ✗ Missing @angular/router"
  MISSING=$((MISSING + 1))
fi

if grep -q "@angular/forms" package.json; then
  echo "  ✓ @angular/forms"
else
  echo "  ✗ Missing @angular/forms"
  MISSING=$((MISSING + 1))
fi

if grep -q "rxjs" package.json; then
  echo "  ✓ rxjs"
else
  echo "  ✗ Missing rxjs"
  MISSING=$((MISSING + 1))
fi

echo ""
echo "======================================"
echo "Build Test"
echo "======================================"

npm run build > /tmp/build.log 2>&1

if grep -q "Build at:" /tmp/build.log; then
  echo "✅ Build successful!"
  grep "Build at:" /tmp/build.log
  grep "Initial total" /tmp/build.log
else
  echo "❌ Build failed!"
  tail -20 /tmp/build.log
  exit 1
fi

echo ""
echo "======================================"
echo "✅ ALL CHECKS PASSED!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Start frontend: npm start"
echo "2. Start backend: cd ../backend && ./mvnw spring-boot:run"
echo "3. Visit: http://localhost:4200"
echo "4. Register or login with test credentials"
echo "5. Check Network tab (DevTools) to see Authorization header"
echo ""
echo "Endpoints to test:"
echo "  - http://localhost:4200/auth/login"
echo "  - http://localhost:4200/auth/register"
echo "  - http://localhost:4200/dashboard (protected)"
echo ""
