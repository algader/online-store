# Render Deployment - Quick Start

## 🔥 Schnellanleitung

### 1. MongoDB Atlas (5 Minuten)
- Gehe zu https://www.mongodb.com/cloud/atlas/register
- Erstelle kostenlosen Cluster
- Hole Connection String

### 2. Render Backend (5 Minuten)
- Gehe zu https://render.com
- New → Web Service
- Repository: `algader/online-store`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables:
  ```
  MONGODB_URI=dein_mongodb_connection_string
  JWT_SECRET=dein_geheimer_schluessel
  NODE_ENV=production
  ```

### 3. Render Frontend (5 Minuten)
- New → Static Site
- Repository: `algader/online-store`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Environment Variables:
  ```
  REACT_APP_API_URL=https://dein-backend.onrender.com/api
  ```

### 4. CORS anpassen
- Ersetze in `backend/server.js` die Frontend-URL mit deiner echten Render-URL
- Commit + Push → Auto-Deploy

## ✅ Fertig!
Deine App ist live unter:
- Frontend: `https://dein-frontend.onrender.com`
- Backend: `https://dein-backend.onrender.com`

**Siehe RENDER-DEPLOYMENT.md für Details**
