#!/bin/bash

# ========================================
# ICARUS-IA MASTER SETUP SCRIPT
# Release: T-26D
# ========================================

set -e # Exit on error

echo "🚀 Starting Icarus-IA Setup..."
echo "================================"

# Navigate to project root
cd /home/lucare/Documents/ICARUS_V2.5/

# ============ CREATE DIRECTORY STRUCTURE ============
echo "📁 Creating directory structure..."

# Backend modules
mkdir -p core/backend/modules/tracking
mkdir -p core/backend/modules/leads
mkdir -p core/backend/services/analytics
mkdir -p core/backend/services/integrations

# Frontend assets
mkdir -p core/frontend/public/js
mkdir -p core/frontend/public/css
mkdir -p core/frontend/public/assets

# Backend files
touch core/backend/modules/tracking/{__init__.py,device_detection.py,ip_enrichment.py,socioeconomic_scoring.py}
touch core/backend/modules/leads/{__init__.py,capture.py,storage.py}
touch core/backend/services/analytics/{__init__.py,fingerprint.py}
touch core/backend/services/integrations/{__init__.py,chatling.py,stripe.py,google_sheets.py}
touch core/backend/api/{leads.py,tracking.py}

# Config files
touch core/config/.env.example
touch core/config/vercel.json
touch core/config/firebase.json

# Docs
mkdir -p docs/deployment
touch docs/DEPLOYMENT.md
touch docs/TRACKING.md
touch docs/INTEGRATIONS.md
touch docs/COOKIE_SYSTEM.md

echo "✅ Directory structure created"

# ============ CREATE PYTHON __init__.py FILES ============
echo "📝 Creating Python module files..."

cat > core/backend/modules/tracking/__init__.py << 'EOF'
"""
Tracking module for device fingerprinting and user behavior analysis.
"""
from .device_detection import DeviceDetector
from .ip_enrichment import IPEnricher
from .socioeconomic_scoring import SocioeconomicScorer

__all__ = ['DeviceDetector', 'IPEnricher', 'SocioeconomicScorer']
EOF

cat > core/backend/modules/leads/__init__.py << 'EOF'
"""
Lead management module for capturing and storing user data.
"""
from .capture import LeadCapture
from .storage import LeadStorage

__all__ = ['LeadCapture', 'LeadStorage']
EOF

cat > core/backend/services/analytics/__init__.py << 'EOF'
"""
Analytics service for processing tracking data.
"""
from .fingerprint import Fingerprinter

__all__ = ['Fingerprinter']
EOF

cat > core/backend/services/integrations/__init__.py << 'EOF'
"""
Integration services for external platforms.
"""
from .chatling import ChatlingAPI
from .stripe import StripeAPI
from .google_sheets import GoogleSheetsAPI

__all__ = ['ChatlingAPI', 'StripeAPI', 'GoogleSheetsAPI']
EOF

echo "✅ Python modules initialized"

# ============ CREATE VERCEL CONFIG ============
echo "⚙️ Creating Vercel configuration..."

cat > core/config/vercel.json << 'EOF'
{
  "version": 2,
  "name": "icarus-ia",
  "builds": [
    {
      "src": "core/frontend/public/**",
      "use": "@vercel/static"
    },
    {
      "src": "core/backend/api/**/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "core/backend/api/$1.py"
    },
    {
      "src": "/(.*)",
      "dest": "core/frontend/public/$1"
    }
  ],
  "env": {
    "FIREBASE_PROJECT_ID": "@firebase_project_id",
    "CHATLING_BOT_ID": "@chatling_bot_id",
    "TWILIO_ACCOUNT_SID": "@twilio_account_sid"
  }
}
EOF

echo "✅ Vercel config created"

# ============ CREATE FIREBASE CONFIG ============
echo "🔥 Creating Firebase configuration..."

cat > core/config/firebase.json << 'EOF'
{
  "hosting": {
    "public": "core/frontend/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "core/backend",
    "runtime": "python39"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
EOF

echo "✅ Firebase config created"

# ============ CREATE .gitignore ============
echo "🚫 Creating .gitignore..."

cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.production

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Firebase
.firebase/
firebase-debug.log

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Secrets
*serviceAccountKey*.json
*credentials*.json
secrets/

# Logs
*.log
logs/

# Build
dist/
build/
*.egg-info/

# Testing
.coverage
.pytest_cache/
EOF

echo "✅ .gitignore created"

# ============ CREATE README ============
echo "📖 Creating README..."

cat > README.md << 'EOF'
# ICARUS-IA | Cognitive Financial Intelligence

**Release:** T-26D

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp core/config/.env.example .env

# Edit .env with your credentials
nano .env
```

### 2. Install Dependencies

```bash
# Python backend
cd core/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend (if using build tools)
cd ../frontend
npm install
```

### 3. Deploy

#### Option A: Vercel
```bash
vercel --prod
```

#### Option B: Firebase
```bash
firebase deploy
```

#### Option C: Google Cloud Run
```bash
gcloud run deploy icarus-ia \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## 📁 Project Structure

```
ICARUS_V2.5/
├── core/
│   ├── backend/
│   │   ├── api/              # API endpoints
│   │   ├── modules/
│   │   │   ├── tracking/     # Device fingerprinting
│   │   │   └── leads/        # Lead management
│   │   └── services/
│   │       ├── analytics/    # Data processing
│   │       └── integrations/ # External APIs
│   ├── frontend/
│   │   └── public/
│   │       ├── index.html    # Landing page
│   │       ├── core.html     # Architecture page
│   │       ├── survey.html   # Survey page
│   │       ├── thanks.html   # Thank you page
│   │       ├── demo.html     # Demo confirmation
│   │       └── dashboard.html # Public dashboard
│   └── config/
│       ├── .env.example
│       ├── vercel.json
│       └── firebase.json
└── docs/                     # Documentation
```

## 🔧 Configuration

### Required Environment Variables

1. **Firebase**: Project ID, API keys
2. **Chatling**: Bot ID
3. **Twilio**: Account SID, Auth Token, Phone Number
4. **Google Sheets**: Webhook URL
5. **Stripe**: Payment links

See `.env.example` for complete list.

## 🎯 Features

### Frontend
- ✅ Popup lead capture with cookies
- ✅ Device fingerprinting
- ✅ Personalized welcome messages
- ✅ Survey with 5 questions
- ✅ Real-time tracking
- ✅ Public dashboard

### Backend
- ✅ IP geolocation
- ✅ Socioeconomic scoring (A/B/C/D)
- ✅ B2B vs B2C detection
- ✅ Google Sheets integration
- ✅ Chatling integration
- ✅ Stripe integration

## 📊 Tracking System

The system captures:
- IP address & geolocation
- Device type (iPhone, MacBook, etc.)
- Browser & OS
- Screen resolution & GPU
- Installed fonts
- Network speed
- Mouse movements & clicks
- Time on page

## 🔒 Security

- Rate limiting: 100 req/min per IP
- CORS configured
- Secrets in Google Secret Manager
- Webhook signature verification
- No sensitive data in cookies

## 📝 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Tracking System](docs/TRACKING.md)
- [Integrations](docs/INTEGRATIONS.md)
- [Cookie System](docs/COOKIE_SYSTEM.md)

## 🆘 Support

Contact: [your-email@icarus-ia.com]

## 📜 License

Proprietary - All Rights Reserved
EOF

echo "✅ README created"

# ============ CREATE REQUIREMENTS.TXT ============
echo "📦 Creating requirements.txt..."

cat > core/backend/requirements.txt << 'EOF'
# Core
python-dotenv==1.0.0
pydantic==2.5.0

# Firebase
firebase-admin==6.3.0

# API
fastapi==0.105.0
uvicorn==0.25.0

# HTTP
requests==2.31.0
httpx==0.25.0

# Google Cloud
google-cloud-firestore==2.13.0
google-cloud-secret-manager==2.16.4
google-cloud-storage==2.10.0

# Twilio
twilio==8.10.0

# Stripe
stripe==7.5.0

# Data processing
pandas==2.1.4
numpy==1.26.2

# Utilities
python-dateutil==2.8.2
pytz==2023.3
EOF

echo "✅ requirements.txt created"

# ============ SUMMARY ============
echo ""
echo "================================"
echo "✅ SETUP COMPLETE!"
echo "================================"
echo ""
echo "📂 Project structure created at:"
echo "   /home/lucare/Documents/ICARUS_V2.5/"
echo ""
echo "📋 Next steps:"
echo "   1. Copy .env.example to .env and fill in your values"
echo "   2. Install Python dependencies: cd core/backend && pip install -r requirements.txt"
echo "   3. Copy the HTML files from artifacts to core/frontend/public/"
echo "   4. Copy tracking.js to core/frontend/public/js/"
echo "   5. Test locally, then deploy to Vercel/Firebase"
echo ""
echo "🔗 Useful commands:"
echo "   - Test locally: cd core/frontend/public && python3 -m http.server 8000"
echo "   - Deploy Vercel: vercel --prod"
echo "   - Deploy Firebase: firebase deploy"
echo ""
echo "📚 Read docs/ for detailed instructions"
echo ""
echo "🚀 Happy coding!"
echo ""

# Display tree
echo "📁 Final structure:"
tree core/ -L 3 -I '__pycache__|*.pyc'
