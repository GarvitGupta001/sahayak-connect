#!/bin/bash

# ML Model Deployment Script
echo "🚀 Starting ML Model Deployment..."

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

# Check if embeddings file exists
if [ ! -f "src/embeddings_final.pkl" ]; then
    echo "❌ embeddings_final.pkl not found in src/ directory"
    echo "Please ensure the embeddings file is present before deployment."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Build and start the service
echo "🔨 Building Docker image..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "🚀 Starting ML Model service..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start service"
    exit 1
fi

# Wait for service to be ready
echo "⏳ Waiting for service to be ready..."
sleep 10

# Check health
echo "🏥 Checking service health..."
for i in {1..10}; do
    if curl -f http://localhost:5000/health &> /dev/null; then
        echo "✅ Service is healthy and running!"
        echo "🌐 ML Model API is available at: http://localhost:5000"
        echo "📊 Health check: http://localhost:5000/health"
        echo "🔍 API endpoint: http://localhost:5000/schemes"
        break
    else
        echo "⏳ Waiting for service to be ready... (attempt $i/10)"
        sleep 5
    fi
done

if [ $i -eq 10 ]; then
    echo "❌ Service failed to become healthy"
    echo "📋 Checking logs..."
    docker-compose logs
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop service: docker-compose down"
echo "  Restart service: docker-compose restart"
echo "  Update service: docker-compose up -d --build"
