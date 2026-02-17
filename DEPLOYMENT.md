# Server2 Deployment Guide

## Free Node.js Hosting Options

### 1. **Render** (Recommended - Free, Easy)
- Website: https://render.com
- Free tier includes:
  - 750 hours/month (enough for a lab project)
  - HTTPS included
  - Automatic deployments from GitHub
  - Environment variables support

**Steps:**
1. Create account at render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or create one for server2)
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
5. Add environment variables if needed (database credentials)
6. Deploy!

**Your Server2 URL will be:** `https://your-app-name.onrender.com`

### 2. **Railway** (Free tier available)
- Website: https://railway.app
- Free tier: $5 credit/month
- Very easy deployment
- Supports MySQL databases

**Steps:**
1. Sign up at railway.app
2. Click "New Project"
3. Deploy from GitHub or upload files
4. Add MySQL database if needed
5. Set environment variables

### 3. **Heroku** (Requires credit card, but free tier)
- Website: https://heroku.com
- Free tier available (with some limitations)
- Well-documented

**Steps:**
1. Install Heroku CLI
2. `heroku create your-app-name`
3. `git push heroku main`
4. Set config vars for database

### 4. **Fly.io** (Free tier)
- Website: https://fly.io
- Good for Node.js apps
- Free tier available

## Important Notes for Deployment

### Database Configuration

If your database is on your local machine, you have two options:

1. **Use a cloud database** (Recommended):
   - **PlanetScale** (Free tier) - MySQL compatible
   - **Railway MySQL** - Free tier
   - **Render PostgreSQL** - Free tier (would need to modify code)
   - **Aiven** - Free tier MySQL

2. **Keep local database** (For testing only):
   - Use ngrok or similar to expose localhost
   - Not recommended for production/submission

### Environment Variables

Update `server2/dbConfig.js` to use environment variables:

```javascript
const DB_CONFIG_READONLY = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'lab4_readonly_user',
    password: process.env.DB_PASSWORD || 'readonly_password',
    database: process.env.DB_NAME || 'lab4_patients_db',
    multipleStatements: false
};
```

Then set these in your hosting platform's environment variables section.

## After Deployment

1. **Get your Server2 URL** (e.g., `https://your-app.onrender.com`)

2. **Update Server1**:
   - Edit `server1/index.html`
   - Change: `const SERVER_URL = 'https://your-app.onrender.com';`
   - Commit and push to GitHub

3. **Test**:
   - Visit: https://jackyfhuang.github.io/COMP4537_Lab_4_Server_1/
   - Click "Insert" button
   - Try a SELECT query

## Quick Render Deployment

1. Create GitHub repo for server2:
   ```bash
   cd server2
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/COMP4537_Lab_4_Server_2.git
   git push -u origin main
   ```

2. Go to render.com → New Web Service → Connect GitHub repo

3. Deploy!
