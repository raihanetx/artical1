#!/bin/bash

echo "🚀 Initializing Article Hub..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your DATABASE_URL, NEXTAUTH_SECRET, and NEXTAUTH_URL"
    exit 1
fi

# Start the development server in background
echo "📦 Starting development server..."
bun run dev > /dev/null 2>&1 &
DEV_PID=$!

# Wait for server to start
sleep 5

# Initialize database
echo "🗄️  Initializing database..."
curl -X POST http://localhost:3000/api/init -s > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully!"
    echo ""
    echo "🎉 Article Hub is ready!"
    echo ""
    echo "📱 Open http://localhost:3000 to view the site"
    echo "🔐 Admin login: http://localhost:3000/admin"
    echo "   Email: admin@example.com"
    echo "   Password: admin123"
    echo ""
    echo "🛑 Press Ctrl+C to stop the server"
else
    echo "❌ Failed to initialize database"
    kill $DEV_PID
    exit 1
fi

# Wait for user to stop
wait $DEV_PID