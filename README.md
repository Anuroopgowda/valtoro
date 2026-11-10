# Valtoro Underwear (Next.js)

## Run locally
npm install
npm run dev     # http://localhost:3000

The shop loads products from the API in `valtoro_backend` (`GET /api/products` on port 8000). Start that before the shop list will appear. Product photos stay in `public/images`.

## Inventory dashboard

The admin dashboard is part of this Next.js app at `/inventory`. Set `NEXT_PUBLIC_API_URL` to the deployed FastAPI base URL for production. Sign in with one of the backend-only admin keys; it is held in the browser session and sent only as a bearer header. Inventory CRUD and GitHub image upload configuration are documented in `valtoro_backend/README.md`. Dashboard visits are excluded from the main storefront visitor counter. The dashboard reads the count through the UI's `/api/visitor-count` proxy and product images through `/api/images/{filename}`; both forward to FastAPI.

## Add your photos
Put the hero photo at public/images/hero.jpg (a gradient shows until you do).

## Deploy to Vercel
1. git init && git add . && git commit -m "init"
2. Push to a GitHub repo
3. vercel.com/new -> import the repo -> Deploy (Next.js is auto-detected)
   or: npm i -g vercel && vercel --prod
