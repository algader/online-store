# 🚀 Deployment auf Render - Schritt-für-Schritt Anleitung

## 📋 Vorbereitung

### 1. MongoDB Atlas einrichten (Cloud-Datenbank)

Da Render keine lokale MongoDB unterstützt, brauchst du **MongoDB Atlas** (kostenlos):

1. Gehe zu: https://www.mongodb.com/cloud/atlas/register
2. Erstelle einen Account
3. Erstelle ein **Cluster** (wähle FREE Tier - M0)
4. Wähle Region (z.B. Frankfurt, AWS)
5. Warte bis Cluster erstellt ist (~3 Minuten)

### 2. MongoDB Connection String holen

1. Klicke auf **"Connect"** bei deinem Cluster
2. Wähle **"Connect your application"**
3. Kopiere den Connection String:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Ersetze:
   - `<username>` mit deinem Benutzernamen
   - `<password>` mit deinem Passwort
   - Füge Datenbanknamen hinzu (z.B. `/online-store`)

**Beispiel:**
```
mongodb+srv://admin:MeinPasswort123@cluster0.abc123.mongodb.net/online-store?retryWrites=true&w=majority
```

---

## 🌐 Backend auf Render deployen

### Schritt 1: Render Account erstellen

1. Gehe zu: https://render.com/
2. Klicke auf **"Get Started"**
3. Melde dich mit **GitHub** an (verbinde deinen Account)

### Schritt 2: Backend Service erstellen

1. Klicke auf **"New +"** → **"Web Service"**
2. Verbinde dein GitHub Repository: **algader/online-store**
3. Konfiguration:

**Basic Settings:**
- **Name:** `online-store-backend`
- **Region:** `Frankfurt (EU Central)`
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

**Advanced Settings:**
- **Plan:** `Free`

### Schritt 3: Environment Variables hinzufügen

Klicke auf **"Environment"** und füge hinzu:

```
MONGODB_URI = mongodb+srv://admin:MeinPasswort123@cluster0.abc123.mongodb.net/online-store?retryWrites=true&w=majority

JWT_SECRET = dein_super_geheimer_schluessel_2024_production

NODE_ENV = production

PORT = 5001
```

**Wichtig:** Verwende deine echten MongoDB-Daten!

### Schritt 4: Deploy starten

1. Klicke auf **"Create Web Service"**
2. Render startet automatisch das Deployment
3. Warte ~5 Minuten
4. Deine Backend-URL: `https://online-store-backend.onrender.com`

---

## 💻 Frontend auf Render deployen

### Schritt 1: Frontend für Production vorbereiten

**Wichtig:** Du musst die Backend-URL im Frontend anpassen!

Bearbeite `frontend/src/utils/api.js`:

```javascript
// Alte Version (lokal):
const API_URL = 'http://localhost:5001/api';

// Neue Version (Production):
const API_URL = process.env.REACT_APP_API_URL || 'https://online-store-backend.onrender.com/api';
```

### Schritt 2: Frontend Service erstellen

1. Gehe zurück zu Render Dashboard
2. Klicke auf **"New +"** → **"Static Site"**
3. Wähle dein Repository: **algader/online-store**

**Configuration:**
- **Name:** `online-store-frontend`
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`

### Schritt 3: Environment Variables (Frontend)

```
REACT_APP_API_URL = https://online-store-backend.onrender.com/api
```

**Ersetze die URL** mit deiner echten Backend-URL von Schritt "Backend auf Render"!

### Schritt 4: Deploy starten

1. Klicke auf **"Create Static Site"**
2. Warte ~10 Minuten (Frontend-Build dauert länger)
3. Deine Frontend-URL: `https://online-store-frontend.onrender.com`

---

## 🔧 CORS im Backend anpassen

Da Frontend und Backend jetzt verschiedene URLs haben, musst du CORS anpassen:

**Bearbeite `backend/server.js`:**

```javascript
// Alte Version:
app.use(cors());

// Neue Version:
app.use(cors({
  origin: [
    'https://online-store-frontend.onrender.com',
    'http://localhost:3000'  // Für lokale Entwicklung
  ],
  credentials: true
}));
```

**Dann:**
1. Commit und push zu GitHub
2. Render deployed automatisch neu!

---

## ✅ Deployment-Checkliste

- [ ] MongoDB Atlas Cluster erstellt
- [ ] Connection String kopiert
- [ ] Render Account mit GitHub verbunden
- [ ] Backend Service erstellt mit Environment Variables
- [ ] Backend deployed (URL notiert)
- [ ] Frontend `api.js` angepasst mit Backend-URL
- [ ] Frontend Service erstellt
- [ ] Frontend deployed
- [ ] CORS im Backend angepasst
- [ ] Änderungen zu GitHub gepusht
- [ ] Website funktioniert! 🎉

---

## 🐛 Troubleshooting

### Problem: Backend startet nicht

**Lösung:** Überprüfe die Logs in Render:
1. Gehe zu deinem Backend Service
2. Klicke auf **"Logs"**
3. Suche nach Fehlern (meist MongoDB Connection)

### Problem: Frontend kann Backend nicht erreichen

**Lösung:** 
1. Überprüfe `REACT_APP_API_URL` in Frontend Environment Variables
2. Überprüfe CORS-Einstellungen im Backend
3. Stelle sicher, Backend ist deployed und läuft

### Problem: MongoDB Connection Error

**Lösung:**
1. Überprüfe `MONGODB_URI` in Environment Variables
2. Stelle sicher, IP Whitelist in MongoDB Atlas ist auf `0.0.0.0/0` gesetzt
3. Überprüfe Username/Password

### Problem: Free Tier schläft ein

**Hinweis:** Render Free Tier schläft nach 15 Minuten Inaktivität
- Erste Anfrage nach Schlaf dauert ~30 Sekunden
- Lösung: Upgrade auf Paid Plan oder akzeptieren

---

## 📝 Nach dem Deployment

### URLs:
- **Frontend:** https://online-store-frontend.onrender.com
- **Backend:** https://online-store-backend.onrender.com
- **API:** https://online-store-backend.onrender.com/api

### Test-URLs:
```bash
# Products laden:
https://online-store-backend.onrender.com/api/products

# Health Check:
https://online-store-backend.onrender.com/
```

### Custom Domain (optional):
1. Gehe zu Service Settings
2. Klicke auf **"Custom Domain"**
3. Füge deine Domain hinzu (z.B. `mein-shop.de`)
4. Konfiguriere DNS-Einträge

---

## 💰 Kosten

- **MongoDB Atlas M0:** Kostenlos (512MB Storage)
- **Render Free Tier:** Kostenlos (750 Stunden/Monat)
- **Total:** 0€ pro Monat 🎉

---

**Viel Erfolg mit dem Deployment!** 🚀
