#!/bin/bash
set -e

echo "🚀 Setting up L'Archipel Libre Development Environment"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Java 21 is installed
if ! command -v java &> /dev/null; then
    echo "⚠️  Java is not installed. Backend development requires Java 21."
else
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d. -f1)
    if [ "$JAVA_VERSION" -lt 21 ]; then
        echo "⚠️  Java version is $JAVA_VERSION. Java 21 or higher is recommended."
    else
        echo "✅ Java $JAVA_VERSION found"
    fi
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed. Frontend development requires Node.js 18+."
else
    NODE_VERSION=$(node -v | cut -d. -f1 | sed 's/v//')
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "⚠️  Node.js version is $NODE_VERSION. Version 18 or higher is recommended."
    else
        echo "✅ Node.js v$NODE_VERSION found"
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DB_USERNAME=archipellibre
DB_PASSWORD=changeme
POSTGRES_DB=archipellibre

# JWT Configuration
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBe256BitsOrMoreForHS512Algorithm

# Application Configuration
SPRING_PROFILES_ACTIVE=dev
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Start Docker Compose services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

echo ""
echo "✅ Development environment setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Backend: cd backend && mvn spring-boot:run"
echo "   2. Frontend: cd frontend && npm install && npm start"
echo "   3. Access the application:"
echo "      - Frontend: http://localhost:4200"
echo "      - Backend API: http://localhost:8080"
echo "      - Swagger UI: http://localhost:8080/swagger-ui.html"
echo ""
echo "🛑 To stop services: docker-compose down"
