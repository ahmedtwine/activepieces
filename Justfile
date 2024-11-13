dev:
    @echo "🚀 Starting Activepieces development environment..."
    @echo "📦 Installing dependencies..."
    npm install
    @echo "🔄 Starting backend services..."
    npm run serve:backend & 
    @echo "⌛ Waiting for backend to initialize (5 seconds)..."
    sleep 5
    @echo "🎨 Starting frontend..."
    npm run serve:frontend
    @echo "\n✨ Setup complete! Both services are now running.\n"
    @echo "🌐 Visit: http://localhost:4200"
    @echo "🔑 Login credentials:"
    @echo "    Email: dev@ap.com"
    @echo "    Password: 12345678"
    @echo "Press Ctrl+C to stop all services\n"

git-commit-push-force:
    #!/usr/bin/env bash
    current_date=$(date +"%Y-%m-%d")
    git commit -m "Pique Update - $current_date" --no-verify
    git push origin main --force