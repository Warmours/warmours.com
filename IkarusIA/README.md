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
