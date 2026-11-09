# Valtoro Underwear (Next.js)

## Run locally
npm install
npm run dev     # http://localhost:3000

The shop loads products from the API in `valtoro_backend` (`GET /api/products` on port 8000). Start that before the shop list will appear. Product photos stay in `public/images`.

## Add your photos
Put the hero photo at public/images/hero.jpg (a gradient shows until you do).

## Deploy to Vercel
1. git init && git add . && git commit -m "init"
2. Push to a GitHub repo
3. vercel.com/new -> import the repo -> Deploy (Next.js is auto-detected)
   or: npm i -g vercel && vercel --prod
