# Deployment Guide

## 📋 Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Git installed locally

## 🚀 Step 1: Push to GitHub

Create a new repository on GitHub (e.g., `amazon-ads-editor-website`), then:

```bash
cd c:\Users\dhutc\amazon-ads-editor-website

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/amazon-ads-editor-website.git

# Push to GitHub
git push -u origin master
```

## 🌐 Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd c:\Users\dhutc\amazon-ads-editor-website
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `amazon-ads-editor-website`
- In which directory is your code located? `./`
- Want to override settings? **N**

4. Deploy to production:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `amazon-ads-editor-website` repository
4. Configure:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. Click "Deploy"

## 🔄 Continuous Deployment

Once connected, every push to the `master` branch will automatically deploy to production!

## 📝 Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `amazonadseditor.com`)
4. Follow DNS configuration instructions

## ✅ Verify Deployment

After deployment, Vercel will give you a URL like:
- Production: `https://amazon-ads-editor-website.vercel.app`
- Each branch/PR gets preview URLs

## 🔧 Troubleshooting

### Build fails
- Check vercel.json is valid JSON
- Ensure all file paths are correct
- Check Vercel build logs for errors

### Site not updating
- Clear browser cache
- Force redeploy in Vercel dashboard
- Check git push was successful

## 📱 Testing

Test on multiple devices:
- Desktop (Chrome, Firefox, Safari, Edge)
- Mobile (iOS Safari, Android Chrome)
- Tablet

Use browser dev tools to test responsive breakpoints.

## 🎯 Next Steps

1. Add actual screenshots to `/images` folder
2. Update download links when releases are available
3. Set up Vercel Analytics (Project Settings → Analytics)
4. Configure custom domain
5. Add Privacy Policy and Terms pages
6. Submit to search engines
