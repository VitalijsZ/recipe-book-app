# Frontend Setup — Node.js Required

Before creating the React frontend, Node.js must be installed.
Vite, npm, and npx all depend on it.

---

## Step 1 — Install Node.js LTS

Download and install from the official site:

👉 https://nodejs.org/en/download

Choose the **LTS** version (recommended for most users).
Run the installer and follow the prompts.

---

## Step 2 — Verify Installation

Open a terminal and confirm all three tools are available:

```
node --version
npm --version
npx --version
```

Expected output (versions may differ):

```
v20.x.x
10.x.x
10.x.x
```

---

## Step 3 — Create the Frontend

Run these commands from the project root
(`Recipe book/`):

```
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom
```

This will scaffold:

```
frontend/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## Step 4 — Start the Dev Server

```
cd frontend
npm run dev
```

Vite will start at: http://localhost:5173

---

## Next Step

Once Node is installed and `npm run dev` works,
let me know and I will generate all frontend files:

- `vite.config.js` (with Django proxy)
- `src/api/api.js`
- `src/context/AuthContext.jsx`
- Pages: Home, Recipe Detail, Add/Edit Recipe, Login
- Components: Navbar, Sidebar, RecipeCard
