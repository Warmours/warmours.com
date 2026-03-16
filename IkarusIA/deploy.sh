#!/bin/bash
# ICARUS FIREBASE DEPLOY MASTER (copia todo → chmod +x deploy.sh → ./deploy.sh)

echo "🚀 ICARUS IA → FIREBASE LIVE"

# 1. Firebase CLI
npm install -g firebase-tools || sudo npm install -g firebase-tools

# 2. Login
firebase login --reauth

# 3. firebase.json (crea/actualiza)
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}],
    "headers": [{
      "source": "**/*.@(js|css|woff|woff2)",
      "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
    }]
  }
}
EOF

# 4. Init hosting
firebase init hosting << 'EOF'

tu-proyecto-firebase-id

.

No

No

EOF

# 5. Deploy
firebase deploy --only hosting --debug

echo "✅ LIVE: https://tu-proyecto.web.app"
echo "🔥 Próximo: Stripe + leads"
