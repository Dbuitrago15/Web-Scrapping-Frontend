# Build & Deployment Guide

## Build for Production

```bash
npm run build
```

The project is configured to compile successfully with Next.js 15.0.4.

## Run in Production

After build completes:

```bash
npm start
```

Server will run on `http://localhost:4500`

## Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NODE_ENV=production
PORT=4500
```

## Deployment

Deploy the `.next` folder and `node_modules` to your server, then run `npm start`.

The service can be managed with systemd on Linux.
