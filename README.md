# MERN Mini-CRM — Frontend

React (Vite) + React Router + Tailwind CSS frontend for the mini-CRM assessment.

## Live app

https://rengy-fe.vercel.app

## Tech stack

React 18, React Router 6, Axios, React Hook Form, Tailwind CSS, Vitest + React Testing Library.

## Folder structure

```
src/
  api/
    axios.js          axios instance + response interceptor (401 -> refresh -> retry)
    tokenStore.js      in-memory access token holder shared by axios + AuthContext
  context/AuthContext.jsx   login/signup/logout, silent refresh on load
  routes/ProtectedRoute.jsx redirects to /login when unauthenticated
  pages/               Login, Signup, Dashboard, ActivityLog
  components/          Navbar, ContactForm, ContactTable, Pagination
  __tests__/           Vitest + RTL unit tests
```

## Setup

```bash
cp .env.example .env   # point VITE_API_URL at your backend
npm install
npm run dev             # http://localhost:5173
```

## Running tests

```bash
npm test
```

Covers: login form validation and submission, contact form validation, and protected-route redirect behavior (loading / unauthenticated / authenticated).

## Architecture

- **Auth**: the access token is kept in memory only (`api/tokenStore.js`), never in `localStorage`, to limit XSS exposure. The refresh token is an `httpOnly` cookie set by the backend, invisible to JS. On app load, `AuthContext` silently calls `POST /api/auth/refresh` to restore a session from that cookie. An Axios response interceptor catches `401`s, refreshes once, retries the original request, and logs the user out if the refresh itself fails.
- **Routing**: `ProtectedRoute` (a layout route using `<Outlet />`) guards `/dashboard` and `/activity`, redirecting to `/login` while unauthenticated and showing a loading state while the initial silent-refresh check is in flight.
- **Dashboard**: paginated (10/page) contacts table backed by the backend's `page`/`limit`/`total` response, with a search box (name/email) and a status filter, an add/edit modal built on a shared `ContactForm` (React Hook Form validation), and a CSV export button that downloads a blob response.
- **Activity Log**: paginated feed of create/update/delete events, populated server-side whenever a contact mutation succeeds.

## Deployment (Vercel)

1. Push this folder to its own GitHub repo.
2. In Vercel: New Project → import the repo (framework preset: Vite).
3. Set environment variable `VITE_API_URL` to your deployed backend URL (e.g. the Render URL).
4. Deploy. `vercel.json` includes the SPA rewrite so client-side routes (`/dashboard`, `/activity`) work on refresh.
