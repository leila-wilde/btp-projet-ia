#!/bin/bash
set -e

echo "🧪 Running L'Archipel Libre Test Suite"

# Backend tests
echo "📦 Running Backend Tests..."
cd backend
mvn test
cd ..

# Frontend tests
echo "🎨 Running Frontend Tests..."
cd frontend
if [ -d "node_modules" ]; then
    npm test -- --watch=false --browsers=ChromeHeadless
else
    echo "⚠️  Frontend dependencies not installed. Run 'npm install' first."
fi
cd ..

echo "✅ All tests completed!"
