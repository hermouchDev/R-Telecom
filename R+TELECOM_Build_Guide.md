# R+ TELECOM — Complete Build Guide
> Plateforme de Vente d'Abonnements Internet & Mobile  
> Stack : Next.js · Node.js · Supabase · Tailwind CSS · Resend · Gemini AI

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Antigravity Prompts](#3-antigravity-prompts)
4. [Frontend — Next.js](#4-frontend--nextjs)
5. [Backend — Node.js + Express](#5-backend--nodejs--express)
6. [Database — Supabase](#6-database--supabase)
7. [AI Chatbot — Gemini](#7-ai-chatbot--gemini)
8. [Smart Calculator](#8-smart-calculator)
9. [PDF Contract Generator](#9-pdf-contract-generator)
10. [Document Upload](#10-document-upload)
11. [QR Code Generator](#11-qr-code-generator)
12. [Notifications — Email via Resend](#12-notifications--email-via-resend)
13. [Admin Dashboard](#13-admin-dashboard)
    - 13.1 [Login Page](#131-admin-login-page)
    - 13.2 [Layout & Sidebar](#132-admin-layout--sidebar)
    - 13.3 [Overview Dashboard](#133-overview-dashboard)
    - 13.4 [Subscriptions Manager](#134-subscriptions-manager)
    - 13.5 [Documents Viewer](#135-documents-viewer)
    - 13.6 [Statistics & Charts](#136-statistics--charts)
    - 13.7 [Backend Admin API](#137-backend-admin-api)
14. [Environment Variables](#14-environment-variables)
15. [Deployment](#15-deployment)

---

## 1. Project Overview

**R+ TELECOM** is a professional web platform for selling Internet and Mobile subscriptions.

| Feature | Detail |
|---|---|
| Name | R+ TELECOM |
| Stack | Next.js 14, Node.js, Supabase, Tailwind CSS |
| Colors | Red `#CC0000`, White `#FFFFFF`, Black `#111111` |
| Users | Grand Public, Fondations (−25%), Admin |
| Offers | Fibre, Box 5G, ADSL, Mobile, 4G+ |
| Email | Resend (resend.com) |
| AI | Google Gemini 1.5 Flash |

---

## 2. Folder Structure

```
rplus-telecom/
├── frontend/                  # Next.js App
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout
│   │   ├── offres/
│   │   │   ├── fibre/page.tsx
│   │   │   ├── mobile/page.tsx
│   │   │   ├── 5g/page.tsx
│   │   │   └── adsl/page.tsx
│   │   ├── calculateur/page.tsx
│   │   ├── souscrire/page.tsx
│   │   └── admin/
│   │       ├── login/page.tsx         # Admin login
│   │       ├── layout.tsx             # Admin layout + sidebar
│   │       ├── page.tsx               # Overview dashboard
│   │       ├── demandes/
│   │       │   ├── page.tsx           # Subscriptions list
│   │       │   └── [id]/page.tsx      # Subscription detail
│   │       ├── documents/page.tsx     # Uploaded documents viewer
│   │       └── statistiques/page.tsx  # Charts & analytics
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── OfferCard.tsx
│   │   ├── Calculator.tsx
│   │   ├── Chatbot.tsx
│   │   ├── QRCode.tsx
│   │   ├── UploadForm.tsx
│   │   ├── Footer.tsx
│   │   └── admin/
│   │       ├── AdminSidebar.tsx
│   │       ├── StatsCard.tsx
│   │       ├── SubscriptionTable.tsx
│   │       ├── SubscriptionDetail.tsx
│   │       ├── DocumentViewer.tsx
│   │       └── StatusBadge.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── adminAuth.ts
│   │   └── utils.ts
│   ├── public/
│   │   └── logo.png           # R+ TELECOM logo
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                   # Node.js API
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── routes/
│   │   │   ├── offers.js
│   │   │   ├── subscriptions.js
│   │   │   ├── uploads.js
│   │   │   ├── contracts.js
│   │   │   ├── chat.js
│   │   │   ├── qrcode.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   └── services/
│   │       ├── pdf.js
│   │       ├── email.js        # Resend service
│   │       └── qrcode.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 3. Antigravity Prompts

Copy and paste these prompts one by one into Antigravity in order.

---

### PROMPT 1 — Project Setup

```
Create a new Next.js 14 project called "rplus-telecom" with:
- TypeScript
- Tailwind CSS
- App Router
- ESLint

Configure tailwind.config.ts with custom colors:
- primary: #CC0000 (R+ red)
- dark: #111111
- light: #F9F9F9

Install these dependencies:
- @supabase/supabase-js
- axios
- lucide-react
- framer-motion
- react-hot-toast
- qrcode.react
- react-dropzone
- recharts
```

---

### PROMPT 2 — Navbar Component

```
Create frontend/components/Navbar.tsx

Build a professional sticky navbar for R+ TELECOM:
- Logo left: bold "R+" in red (#CC0000) + "TELECOM" in black
- Nav links: Accueil, Offres (dropdown: Fibre, 5G Box, ADSL, Mobile), Calculateur, Contact
- Red "Souscrire" CTA button on the right
- Mobile hamburger menu
- Smooth shadow on scroll
- White background, red accents, Tailwind CSS
```

---

### PROMPT 3 — Hero Section

```
Create frontend/components/Hero.tsx

Build a full-width hero section:
- Dark background (#111111) with red gradient glow on the right
- Headline: "Restez Connecté avec R+ TELECOM"
- Subtitle: "Internet Fibre, 5G Box, Mobile et ADSL — Des offres pour tous"
- Buttons: "Voir nos offres" (red filled) + "Calculer mon tarif" (white outlined)
- Animated stats: "99.9% Disponibilité", "500K+ Clients", "Depuis 2010"
- Fully responsive, framer-motion entrance animations
```

---

### PROMPT 4 — Offer Card Component

```
Create frontend/components/OfferCard.tsx

Reusable offer card with props:
- title, speed, price, originalPrice?, features[], badge?, color?

Design:
- White card, subtle shadow, 1px border
- Red top accent bar (4px)
- Badge as red pill (top-right corner)
- Speed bold and large
- Price in big red numbers + "/mois"
- Feature list with red checkmarks
- Full-width red "Souscrire" button
- Hover lifts with shadow (framer-motion)
- Tailwind CSS
```

---

### PROMPT 5 — Homepage

```
Create frontend/app/page.tsx

Full R+ TELECOM homepage with sections:

1. <Hero />

2. "Nos Offres Internet" — tabbed offer cards:
   Fibre: 100Mbps/400DH, 200Mbps/500DH, 1Gbps/1000DH (Fondation -25%)
   5G Box: El Manzil 100Mbps/400DH — Ultra rapide, Plug & Play, Gaming ready
   ADSL: 20Mbps/250DH, 20Mbps+Ligne fixe/300DH
   Mobile (top 4): 99DH, 165DH, 249DH, 349DH

3. Why Us — 3 cards:
   "Réseau Fiable" (99.9% uptime), "Support 24/7", "Meilleurs Prix"

4. <Calculator />

5. <Chatbot /> (floating button)

6. <Footer /> with contact info and links
```

---

### PROMPT 6 — Smart Calculator

```
Create frontend/components/Calculator.tsx

Interactive price calculator:

Offers data:
const offers = [
  { id: 'fibre-100', name: 'Fibre 100 Mbps', price: 400, serviceFee: 0 },
  { id: 'fibre-200', name: 'Fibre 200 Mbps', price: 500, serviceFee: 0 },
  { id: 'fibre-1000', name: 'Fibre 1 Gbps', price: 1000, serviceFee: 0 },
  { id: '5g-box', name: '5G Box El Manzil', price: 400, serviceFee: 200, routerFee: 350 },
  { id: 'adsl-20', name: 'ADSL 20 Mbps', price: 250, serviceFee: 0 },
  { id: 'adsl-fixe', name: 'ADSL + Ligne Fixe', price: 300, serviceFee: 0 },
  { id: 'mobile-99', name: 'Mobile 20Go+1H', price: 99, serviceFee: 0 },
  { id: 'mobile-165', name: 'Mobile 140Go+14H', price: 165, serviceFee: 0 },
  { id: '4g-199', name: '4G+ 40Go+1H', price: 199, serviceFee: 0 },
]

Logic:
- discount = isFondation ? price * 0.25 : 0
- serviceFee = isFondation ? 0 : offer.serviceFee
- total = (price - discount) + serviceFee + (routerFee || 0)

Result card:
- Prix de base / Remise -25% (green, if fondation) / Frais service / Frais routeur (5G only)
- TOTAL in large red
- "Souscrire maintenant" button

Fondation toggle switch, animated number transitions (framer-motion)
```

---

### PROMPT 7 — AI Chatbot (Gemini)

```
Create frontend/components/Chatbot.tsx

Floating chatbot widget:
- Fixed red circle button (bottom-right) with chat icon
- Opens 350x500px chat window
- Red header: "Assistant R+ TELECOM"
- Scrollable messages area + input + send button

Behavior:
- POST user message to /api/chat
- Animated typing indicator while waiting
- Response shown as chat bubble

Quick replies (chips):
- "Quelle offre pour Netflix ?"
- "Prix Fibre 200 Mbps ?"
- "Offre Fondation ?"
- "Contacter un agent"

"Contacter un agent" → show:
"Appelez-nous au +212 5XX-XXXXXX ou écrivez à contact@rplusTelecom.ma"

White background, red accents, framer-motion animations
```

---

### PROMPT 8 — Backend API Setup

```
Create Node.js + Express backend in /backend folder.
File: backend/src/index.js

Setup:
- Express on port 5000
- CORS for http://localhost:3000
- JSON body parser, Morgan logging, dotenv

Mount routers:
- /api/offers          → routes/offers.js
- /api/subscriptions   → routes/subscriptions.js
- /api/uploads         → routes/uploads.js
- /api/contracts       → routes/contracts.js
- /api/chat            → routes/chat.js
- /api/admin           → routes/admin.js (protected)
- /api/qrcode          → routes/qrcode.js

Install:
npm install express cors morgan dotenv multer @supabase/supabase-js
resend puppeteer qrcode jsonwebtoken bcryptjs axios @google/generative-ai
```

---

### PROMPT 9 — Offers API Route

```
Create backend/src/routes/offers.js

GET /api/offers — return all offers as JSON array.

Each offer: { id, category, name, speed, price, fondationPrice, serviceFee, routerFee, features[] }

All offers to include:
FIBRE: 100Mbps/400DH(fond:300), 200Mbps/500DH(fond:375), 1Gbps/1000DH(fond:750)
5G: El Manzil 100Mbps/400DH (serviceFee:200, routerFee:350, fondation:serviceFee=0)
ADSL: 20Mbps/250DH, 20Mbps+Fixe/300DH
MOBILE: 20Go+1H/99, 15Go+5H/119, 22Go+2H/119, 140Go+14H/165,
        30Go+3H/165, 120Go+22H/220, 250Go+20H/249, 450Go+5H/249, 550Go+15H/349
4G+: 40Go+1H/199, 70Go+2H/350, 90Go+3H/450
All mobile/4G fondationPrice = price * 0.75
```

---

### PROMPT 10 — Subscription Route

```
Create backend/src/routes/subscriptions.js

POST /api/subscriptions
Body: { offerId, clientName, clientEmail, clientPhone, clientCIN, isFondation, address }
1. Validate required fields
2. Calculate final price (apply 25% if fondation)
3. Insert into Supabase "subscriptions" table with status "pending"
4. Call sendWelcomeEmail + sendAdminNotification from services/email.js
5. Return { subscriptionId, totalPrice }

GET /api/subscriptions — admin only
- Query params: status, category, page, limit

GET /api/subscriptions/:id — single subscription

PATCH /api/subscriptions/:id/status — admin only
Body: { status: "approved" | "rejected" | "pending" }
- Update in Supabase
- Call sendStatusEmail from services/email.js
```

---

### PROMPT 11 — File Upload Route

```
Create backend/src/routes/uploads.js and backend/src/middleware/upload.js

Middleware: multer memory storage, accept jpeg/png/pdf, max 5MB, fields: cin + fondationCard

Route:
POST /api/uploads/:subscriptionId
- Upload files to Supabase Storage bucket "documents"
- Path: documents/{subscriptionId}/{fieldname}_{timestamp}.{ext}
- Save URLs to subscriptions table
- Return { cinUrl, fondationCardUrl }

GET /api/uploads/:subscriptionId — admin only, return document URLs
```

---

### PROMPT 12 — PDF Contract Generator

```
Create backend/src/services/pdf.js and backend/src/routes/contracts.js

Service: Use Puppeteer to generate PDF from HTML template.

Template includes:
- Red header bar + "R+ TELECOM" title
- "CONTRAT DE SOUSCRIPTION" heading
- Contract number: RPT-{year}-{id}
- Client info table + offer details table (base price, discount, fees, total)
- Short terms & conditions
- Signature zones: Client / R+ TELECOM

Routes:
GET /api/contracts/:id/download — full contract PDF (attachment)
GET /api/contracts/:id/receipt  — simplified 1-page receipt PDF
```

---

### PROMPT 13 — AI Chat Route (Gemini)

```
Create backend/src/routes/chat.js

POST /api/chat
Body: { message: string, history?: array }

Use Google Gemini:
const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

System instruction (in French):
"Tu es un assistant client pour R+ TELECOM, agence télécom marocaine.
Tu aides les clients à choisir leur abonnement Internet ou Mobile.
Offres disponibles:
- Fibre: 100Mbps/400DH, 200Mbps/500DH, 1Gbps/1000DH
- Box 5G: 100Mbps/400DH (frais service 200DH, routeur 350DH)
- ADSL: 20Mbps/250DH, avec ligne fixe 300DH
- Mobile: de 99DH à 349DH selon data et appels
- Fondations: -25% sur toutes les offres
Réponds toujours en français. Sois concis et aimable.
Pour un agent humain: contact@rplusTelecom.ma"

Multi-turn chat:
const chat = model.startChat({ history: req.body.history || [], systemInstruction: "..." })
const result = await chat.sendMessage(req.body.message)
res.json({ response: result.response.text() })
```

---

### PROMPT 14 — Email Service with Resend

```
Create backend/src/services/email.js

Use Resend SDK:
const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM

Implement 3 functions:

--- sendWelcomeEmail({ clientName, clientEmail, offerName, totalPrice, subscriptionId }) ---
Subject: "Bienvenue chez R+ TELECOM — Votre souscription est enregistrée"
HTML email with:
- Red header: "R+ TELECOM"
- "Bonjour {clientName}, votre demande a été reçue."
- Offer summary table: offre, montant mensuel, référence
- "Notre équipe traitera votre demande dans les 24h."
- Contact: contact@rplusTelecom.ma
- Red footer bar

--- sendStatusEmail({ clientName, clientEmail, status, subscriptionId, offerName }) ---
If approved:
  Subject: "Félicitations ! Votre souscription R+ TELECOM est approuvée"
  Body: confirmation + "Service activé sous 48h"
If rejected:
  Subject: "Mise à jour de votre demande R+ TELECOM"
  Body: polite message + invite to contact support at contact@rplusTelecom.ma

--- sendAdminNotification({ adminEmail, clientName, offerName, totalPrice, subscriptionId }) ---
Subject: "Nouvelle souscription — {clientName} — {offerName}"
Simple table: client info + link to /admin/demandes/{id}
From: "R+ TELECOM System <{EMAIL_FROM}>"

All emails use inline CSS. Return { success: true } or throw error.
```

---

### PROMPT 15 — QR Code Route

```
Create backend/src/services/qrcode.js and backend/src/routes/qrcode.js

Service functions:

generateAgencyQR() — encode agency info as JSON string:
{
  name: "R+ TELECOM",
  address: process.env.AGENCY_ADDRESS,
  phone: process.env.AGENCY_PHONE,
  email: process.env.AGENCY_EMAIL,
  website: "https://rplusTelecom.ma"
}
Return base64 PNG.

generateSubscriptionQR(id) — encode:
"https://rplusTelecom.ma/suivi/{id}"
Return base64 PNG.

Routes:
GET /api/qrcode/agency — return PNG image
GET /api/qrcode/subscription/:id — return PNG image
```

---

### PROMPT 16 — Upload Form Component

```
Create frontend/components/UploadForm.tsx

Props: { subscriptionId: string, isFondation: boolean, onComplete: () => void }

Two react-dropzone upload zones:
1. "Carte Nationale d'Identité (CNI)" — always shown
2. "Carte de Fondation" — only if isFondation=true

Each zone:
- Dashed border, turns red on hover
- Shows filename + size after selection
- Image preview or PDF icon
- Remove button

On submit:
- POST /api/uploads/{subscriptionId} with FormData
- Progress bar during upload
- Success checkmark on done → call onComplete()
- Toast errors with react-hot-toast

Accepted: JPG, PNG, PDF (max 5MB each), Tailwind CSS
```

---

### PROMPT 17 — Full Subscription Flow

```
Create frontend/app/souscrire/page.tsx

4-step subscription form:

Step 1 — Choose offer:
- Fetch from GET /api/offers, filter tabs, fondation toggle
- Selected offer highlighted red
- Real-time price calculation
- "Continuer"

Step 2 — Personal info:
- Fields: Nom, Email, Téléphone, CIN, Adresse
- Real-time validation
- "Précédent" / "Continuer"

Step 3 — Upload documents:
- <UploadForm /> component
- "Précédent" / "Continuer"

Step 4 — Confirmation:
- Summary: offer + price breakdown + client info
- "Confirmer la souscription" → POST /api/subscriptions
- On success: show reference number + "Email de confirmation envoyé"
  + download contract button + QR code + "Retour à l'accueil"

Progress bar at top (1/4 → 4/4), red/white theme
```

---

### PROMPT 18 — Supabase Schema

```
Save as backend/supabase/schema.sql and run in Supabase SQL Editor:

CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id TEXT NOT NULL,
  offer_name TEXT NOT NULL,
  offer_category TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_cin TEXT NOT NULL,
  client_address TEXT,
  is_fondation BOOLEAN DEFAULT false,
  base_price NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  service_fee NUMERIC DEFAULT 0,
  router_fee NUMERIC DEFAULT 0,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  cin_url TEXT,
  fondation_card_url TEXT,
  contract_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access" ON subscriptions FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_status ON subscriptions(status);
CREATE INDEX idx_category ON subscriptions(offer_category);
CREATE INDEX idx_created ON subscriptions(created_at);

INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
```

---

## Admin Dashboard Prompts

---

### PROMPT 19 — Admin Login Page

```
Create frontend/app/admin/login/page.tsx

Centered card (max 420px) on dark background (#111111):
- "R+" red + "TELECOM" black logo
- Subtitle: "Espace Administrateur"
- Red separator line
- Email input (mail icon) + Password input (lock icon + show/hide toggle)
- Red "Se connecter" button with loading spinner
- Red error box for wrong credentials

On submit:
- POST /api/admin/login with { email, password }
- Success: save JWT to localStorage "admin_token" → redirect /admin
- Error: show "Identifiants incorrects"
- Already logged in: redirect to /admin immediately

Token expires: 24 hours. Tailwind CSS.
```

---

### PROMPT 20 — Admin Layout & Sidebar

```
Create frontend/app/admin/layout.tsx
and frontend/components/admin/AdminSidebar.tsx

Layout:
- On mount: check localStorage "admin_token" → no token = redirect /admin/login
- Structure: AdminSidebar (260px fixed left) + children (remaining width)
- Top header: "Bonjour, Admin" + logout button (clears token → /admin/login)

Sidebar:
- R+ TELECOM logo with red accent bar
- Nav links with lucide-react icons:
  - LayoutDashboard  → /admin
  - ClipboardList    → /admin/demandes  [red badge: pending count]
  - FolderOpen       → /admin/documents
  - BarChart2        → /admin/statistiques
  - Settings         → /admin/parametres
- Active: red bg + white text
- Inactive: gray text, hover = red text
- Bottom: admin email + "v3.0"

Poll GET /api/admin/stats every 60s for pending badge count.
```

---

### PROMPT 21 — Admin Overview Dashboard

```
Create frontend/app/admin/page.tsx
and frontend/components/admin/StatsCard.tsx

Fetch GET /api/admin/stats

4 Stats Cards (2x2 mobile, 4x1 desktop):
1. "Demandes aujourd'hui" — count + trend % vs yesterday
2. "En attente"           — count, orange accent
3. "Revenus du mois"      — DH total, green accent
4. "Clients actifs"       — total approved, blue accent

StatsCard props: { title, value, unit?, trend?, color, icon }

Recent Activity Feed — GET /api/subscriptions?limit=10&sort=newest:
- Client name + offer name
- Status pill badge
- "il y a X min" timestamp
- "Voir →" link to /admin/demandes/[id]

Quick Actions:
- "Toutes les demandes" → /admin/demandes
- "Exporter CSV" → GET /api/admin/report
- "Statistiques" → /admin/statistiques

Auto-refresh every 30s. framer-motion card animations.
```

---

### PROMPT 22 — Subscriptions Manager

```
Create frontend/app/admin/demandes/page.tsx,
frontend/app/admin/demandes/[id]/page.tsx,
and frontend/components/admin/SubscriptionTable.tsx

--- LIST PAGE ---

Filters: search (name/email/CIN) | status | category | date range | "Exporter CSV"

Table columns: #ID | Client | Offre | Montant | Statut | Date | Actions
- ID: first 8 chars
- Client: name + email (gray small)
- Offre: colored category badge + name
- Montant: price DH (★ for fondation)
- Statut: En attente (orange) | Approuvé (green) | Refusé (red)
- Actions: 👁 View | ✅ Approve (pending only) | ❌ Reject (pending only)

Approve/Reject: PATCH /api/subscriptions/[id]/status
Pagination: 20/page. Loading skeleton. Empty state.

--- DETAIL PAGE /admin/demandes/[id] ---

Two columns:

LEFT:
- Client info table: Nom, Email, Téléphone, CIN, Adresse, Type
- Offer table: Offre, Débit, Prix base, Remise, Frais, Total

RIGHT:
- Status badge (large)
- If pending: Approuver + Rejeter buttons with confirmation modal
- If approved: Download contract + Download receipt buttons
- Documents: CNI + Fondation card (thumbnail/PDF icon + Voir + Télécharger)
- QR Code: image from /api/qrcode/subscription/[id] + download button

After approve/reject: backend sends email automatically. Show toast.
Back button → /admin/demandes
```

---

### PROMPT 23 — Admin Documents Viewer

```
Create frontend/app/admin/documents/page.tsx
and frontend/components/admin/DocumentViewer.tsx

Summary bar: Total | Complets (green) | Incomplets (orange) | Sans fondation (gray)

Search by client name or subscription ID
Filter: Tous | CNI seulement | Fondation seulement | Complets | Incomplets

Grid of cards — each shows:
- Client name + subscription ID
- Offer name + date
- CNI status: ✅ / ❌
- Fondation card status: ✅ / ❌ / — (N/A)
- "Voir les documents" → opens DocumentViewer modal

DocumentViewer modal:
- "Documents — [Client Name]" title
- Two panels: CNI (left) | Carte Fondation (right, or "Non requis")
- Each panel:
  - Image: thumbnail → click = full size
  - PDF: icon + filename + "Ouvrir PDF"
  - "Télécharger" button + upload date
- X close button

Tailwind CSS, lazy image loading
```

---

### PROMPT 24 — Statistics & Charts

```
Create frontend/app/admin/statistiques/page.tsx

Fetch GET /api/admin/stats/full?range=30d

Date range selector: 7 jours | 30 jours | 3 mois | 1 an | Tout

ROW 1 — KPI Cards:
- Total souscriptions | Revenus total DH | Taux approbation % | Offre la plus populaire

ROW 2 — Revenue Line Chart (recharts LineChart):
- X: date DD/MM, Y: DH, red line, tooltip

ROW 3 — Two charts side by side:
- Bar Chart: souscriptions par catégorie (Fibre/5G/ADSL/Mobile/4G+), red bars
- Pie Chart: Grand Public (red) vs Fondation (dark), percentages + legend

ROW 4 — Status Stacked Bar:
- En attente (orange) | Approuvé (green) | Refusé (red) — percentages + tooltips

ROW 5 — Performance Table:
- Offre | Souscriptions | Revenus DH | % Fondation | Taux approbation
- Sorted by revenue descending

Charts update on range change. framer-motion entrances.
```

---

### PROMPT 25 — Complete Admin Backend API

```
Create backend/src/routes/admin.js and backend/src/middleware/auth.js

--- auth.js middleware ---
Extract "Bearer {token}" from Authorization header
Verify with JWT_SECRET → invalid/expired = 401 { error: "Non autorisé" }
Valid → attach to req.admin, call next()

--- admin.js routes ---

POST /api/admin/login
- Compare { email, password } with ADMIN_EMAIL + ADMIN_PASSWORD (bcryptjs)
- Match: JWT token (24h) + { email, role: "admin" }
- No match: 401 { error: "Identifiants incorrects" }

GET /api/admin/stats [protected]
{ todayCount, pendingCount, monthlyRevenue, activeClients, yesterdayCount, trend }

GET /api/admin/stats/full?range=30d [protected]
{
  totalSubscriptions, totalRevenue, approvalRate,
  topOffer: { name, count },
  revenueByDay: [{ date, amount }],
  byCategory: [{ category, count, revenue, fondationPct, approvalRate }],
  byStatus: { pending, approved, rejected },
  publicVsFondation: { public, fondation }
}
Filter by range: 7d, 30d, 90d, 365d, all

GET /api/admin/documents [protected]
All subscriptions with document URLs + documentsComplete boolean
Supports ?search= param

GET /api/admin/report [protected]
CSV: ID, Client, Email, Téléphone, Offre, Prix, Statut, Date, Type
Content-Disposition: attachment; filename="rapport-rplus-{date}.csv"

Use Supabase service role key. Full error handling.
```

---

### Admin Auth Flow

```
1. Admin visits /admin/login
2. Enters email + password
3. POST /api/admin/login → JWT token returned
4. Token saved in localStorage as "admin_token"
5. All admin pages verify token on mount
6. All API calls: Authorization: Bearer {token}
7. Backend middleware verifies every request
8. Token expires 24h → auto-redirect to login
```

---

## 4. Frontend — Next.js

### package.json (frontend)

```json
{
  "name": "rplus-telecom-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "axios": "^1.6.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "qrcode.react": "^3.1.0",
    "react-dropzone": "^14.2.3",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#CC0000',
          dark: '#990000',
          light: '#FF3333',
          pale: '#FFF0F0',
        },
        dark: '#111111',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'pulse-red': 'pulseRed 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(204,0,0,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(204,0,0,0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 5. Backend — Node.js + Express

### package.json (backend)

```json
{
  "name": "rplus-telecom-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.5",
    "@supabase/supabase-js": "^2.39.0",
    "resend": "^3.2.0",
    "puppeteer": "^21.6.0",
    "qrcode": "^1.5.3",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "axios": "^1.6.0",
    "@google/generative-ai": "^0.21.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 6. Database — Supabase

### Setup Steps

```
1. Go to https://supabase.com → create project "rplus-telecom"
2. Copy Project URL + anon key → frontend/.env.local
3. Copy service_role key → backend/.env
4. SQL Editor → paste + run schema from PROMPT 18
5. Storage bucket "documents" is created by the SQL automatically
```

---

## 7. AI Chatbot — Gemini

Uses **Google Gemini 1.5 Flash** — free, fast, multilingual.

See **PROMPT 13** (backend) and **PROMPT 7** (frontend).

**Get API Key:**
1. [aistudio.google.com](https://aistudio.google.com) → Get API Key → Create API key
2. Add to `backend/.env` as `GEMINI_API_KEY`

---

## 8. Smart Calculator

See **PROMPT 6**. Calculation logic:

```typescript
function calculatePrice(offer, isFondation) {
  const discount = isFondation ? offer.price * 0.25 : 0
  const serviceFee = isFondation ? 0 : (offer.serviceFee || 0)
  const routerFee = offer.routerFee || 0
  const total = (offer.price - discount) + serviceFee + routerFee
  return { basePrice: offer.price, discount, serviceFee, routerFee, total }
}
```

---

## 9. PDF Contract Generator

See **PROMPT 12**. Uses Puppeteer to render HTML → PDF.

Contract number format: `RPT-{YEAR}-{SHORT_ID}`

---

## 10. Document Upload

See **PROMPT 11** (backend) and **PROMPT 16** (frontend).

Storage path:
```
documents/{subscriptionId}/cin_{timestamp}.jpg
documents/{subscriptionId}/fondation_{timestamp}.pdf
```

---

## 11. QR Code Generator

See **PROMPT 15**.

- **Agency QR** — name, address, phone, email, website
- **Subscription QR** — `https://rplusTelecom.ma/suivi/{id}`

---

## 12. Notifications — Email via Resend

All notifications sent by email only using **Resend**.

See **PROMPT 14** for full implementation.

**Get Resend API Key:**
1. [resend.com](https://resend.com) → free account
2. API Keys → Create API Key
3. Add sending domain (or use `onboarding@resend.dev` for testing)

**Email triggers:**

| Email | To | When |
|---|---|---|
| Welcome | Client | Subscription created |
| Approved | Client | Admin approves |
| Rejected | Client | Admin rejects |
| New subscription alert | Admin | Subscription created |

**Free plan:** 3,000 emails/month, 100/day — plenty for a school project.

---

## 13. Admin Dashboard

Full back-office control panel. JWT-protected. See prompts 19–25.

### Pages

| Page | Route | Prompt |
|---|---|---|
| Login | `/admin/login` | PROMPT 19 |
| Layout + Sidebar | `/admin/*` | PROMPT 20 |
| Overview | `/admin` | PROMPT 21 |
| Subscriptions | `/admin/demandes` | PROMPT 22 |
| Documents | `/admin/documents` | PROMPT 23 |
| Statistics | `/admin/statistiques` | PROMPT 24 |
| Backend API | `/api/admin/*` | PROMPT 25 |

---

## 14. Environment Variables

### frontend/.env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### backend/.env

```env
# ── Server ───────────────────────────────────────
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# ── Supabase ─────────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# ── Admin Auth ───────────────────────────────────
ADMIN_EMAIL=admin@rplusTelecom.ma
ADMIN_PASSWORD=ChooseAStrongPassword123!
JWT_SECRET=generate_with_command_below

# ── Email — Resend ───────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@rplusTelecom.ma

# ── AI — Gemini ──────────────────────────────────
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Agency Info ──────────────────────────────────
AGENCY_PHONE=+2125XXXXXXXX
AGENCY_EMAIL=contact@rplusTelecom.ma
AGENCY_ADDRESS=123 Boulevard Mohammed V, Casablanca, Maroc
```

### Where to get each value

| Variable | How to get it |
|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → **service_role** key |
| `ADMIN_PASSWORD` | Choose any strong password |
| `JWT_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys → Create |
| `EMAIL_FROM` | Your verified domain on Resend (use `onboarding@resend.dev` for testing) |
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) → Get API Key |

---

## 15. Deployment

### Frontend → Vercel (Free)

```bash
npm i -g vercel
cd frontend
vercel
# Add env variables in Vercel dashboard → Settings → Environment Variables
```

### Backend → Railway (Free)

```bash
npm i -g @railway/cli
railway login
cd backend
railway init
railway up
# Add env variables in Railway dashboard
```

### After Deployment

```
1. Vercel: set NEXT_PUBLIC_API_URL → your Railway URL
2. Railway: set FRONTEND_URL → your Vercel URL
3. Supabase: add both URLs to allowed origins
4. Resend: confirm your domain is verified
5. Test full subscription flow end-to-end
```

---

## Quick Start (Local Development)

```bash
# 1. Create project folders
mkdir rplus-telecom && cd rplus-telecom

# 2. Frontend
cd frontend
npm install
cp .env.example .env.local   # fill in values
npm run dev                   # http://localhost:3000

# 3. Backend (new terminal)
cd backend
npm install
cp .env.example .env         # fill in values
npm run dev                  # http://localhost:5000

# 4. Open Antigravity → PROMPT 1 → work through to PROMPT 25
```

---

*R+ TELECOM — Build Guide v3.0 — 2025*
*25 Antigravity prompts — Email via Resend · AI via Gemini · No WhatsApp*
*Use this file as your reference while working in Antigravity*