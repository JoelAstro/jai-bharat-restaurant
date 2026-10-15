# Jai Bharat Family Restaurant — Production Deployment Guide

This guide details the complete process for deploying the Jai Bharat Family Restaurant platform to production with **PostgreSQL**, **Nginx / Cloudflare**, and automated database backups.

---

## 1. Database Provisioning (PostgreSQL)

The platform is built using **Prisma ORM**, which supports PostgreSQL out-of-the-box.

### Option A: Cloud Managed PostgreSQL (Supabase, Neon, Railway, AWS RDS)
1. Create a PostgreSQL project on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Obtain your connection URI in transaction pooler or direct mode:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public
   ```
3. In `server/.env`, set:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"
   ```
4. Copy the PostgreSQL schema:
   ```powershell
   # In server/ directory:
   Copy-Item prisma/schema.postgresql.prisma prisma/schema.prisma -Force
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

### Option B: Self-Hosted PostgreSQL on Linux VPS
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql
CREATE DATABASE jaibharat_db;
CREATE USER jaibharat_user WITH ENCRYPTED PASSWORD 'StrongProductionPasswordHere';
GRANT ALL PRIVILEGES ON DATABASE jaibharat_db TO jaibharat_user;
\q
```

---

## 2. Server Configuration (`server/.env`)

Ensure the production `.env` contains secure values:

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://jaibharatfamilyrestaurant.com

# 64-character random string (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=8f4a7c1b5e2d9a3f8c7b6e5d4a3b2c1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b
JWT_EXPIRES_IN=7d

# PostgreSQL Database Connection
DATABASE_URL="postgresql://jaibharat_user:StrongProductionPasswordHere@localhost:5432/jaibharat_db?schema=public"

# Razorpay Credentials (from restaurant owner's Razorpay dashboard)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx

# Initial Administrator
ADMIN_EMAIL=owner@jaibharatrestaurant.com
ADMIN_PASSWORD=ComplexAdminPass2026!
ADMIN_NAME="Jai Bharat Owner"
ADMIN_PHONE="9876543210"
```

---

## 3. Production Build & Process Manager (PM2)

### 1. Build Server
```bash
cd server
npm install --production=false
npx prisma generate
npx prisma db push
npm run build
```

### 2. Run with PM2
```bash
npm install -g pm2
pm2 start dist/index.js --name "jai-bharat-api"
pm2 save
pm2 startup
```

---

## 4. Frontend & Render Deployment

### Option A: Render Deployment (Recommended)
This repository includes a `render.yaml` Blueprint that automatically configures both services:

#### Service 1: Backend API (Render Web Service)
- **Root Directory:** `server`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `DATABASE_URL`: `postgresql://...` (your Neon connection string)
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `JWT_SECRET`: (your secure 64-char JWT secret)
  - `CLIENT_URL`: `https://your-frontend-domain.onrender.com`
  - `RAZORPAY_KEY_ID`: (your key)
  - `RAZORPAY_KEY_SECRET`: (your secret)
  - `ADMIN_EMAIL`: `admin@jaibharatrestaurant.com`
  - `ADMIN_PASSWORD`: (your admin password)

#### Service 2: Frontend (Render Static Site)
- **Root Directory:** `client`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Rewrite Rule:** `/*` -> `/index.html` (SPA routing)
- **Environment Variables:**
  - `VITE_API_URL`: `https://your-backend-api.onrender.com`

---

### Option B: Static Hosting (Vercel, Netlify, Cloudflare Pages)
1. Set Root Directory to: `client`
2. Set Build Command to: `npm install && npm run build`
3. Set Publish Directory to: `dist` (or `client/dist` if building from repo root)
4. Set Environment Variable: `VITE_API_URL=https://your-backend-api.onrender.com`
5. Configure SPA rewrite rule (`/*` -> `/index.html`).

### Option B: Nginx Reverse Proxy on Single VPS
Build the client:
```bash
cd client
npm install
npm run build
```
Copy `client/dist` to `/var/www/jaibharat/html`.

Nginx configuration (`/etc/nginx/sites-available/jaibharat.conf`):
```nginx
server {
    server_name jaibharatfamilyrestaurant.com www.jaibharatfamilyrestaurant.com;

    root /var/www/jaibharat/html;
    index index.html;

    # Frontend Single Page App Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy to Node.js backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site & install SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/jaibharat.conf /etc/nginx/sites-enabled/
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jaibharatfamilyrestaurant.com -d www.jaibharatfamilyrestaurant.com
sudo systemctl restart nginx
```

---

## 5. Automated Database Backups

### PostgreSQL Backup Script (`backup-db.sh`)
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/jaibharat"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

# Dump database to compressed archive
pg_dump -U jaibharat_user jaibharat_db | gzip > "$BACKUP_DIR/jaibharat_backup_$TIMESTAMP.sql.gz"

# Remove backups older than 14 days
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +14 -exec rm {} \;

echo "Backup completed: jaibharat_backup_$TIMESTAMP.sql.gz"
```

Make executable & add cron job:
```bash
chmod +x /var/backups/backup-db.sh
# Run nightly at 2:00 AM
crontab -e
# Add: 0 2 * * * /var/backups/backup-db.sh >> /var/log/db_backup.log 2>&1
```

### Database Recovery Command
```bash
gunzip < /var/backups/jaibharat/jaibharat_backup_YYYYMMDD_HHMMSS.sql.gz | psql -U jaibharat_user jaibharat_db
```
