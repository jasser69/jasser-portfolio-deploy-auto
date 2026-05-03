# Jasser Haj Hassiene — Portfolio

Portfolio personale costruito con **Astro 6**, **Tailwind CSS v4**, **Three.js** e **GSAP**.

## Stack Tecnologico

- **Astro 6** — framework statico ultra-performante
- **Tailwind CSS v4** — utility-first CSS con `@theme` tokens
- **Three.js** — modello 3D del dente con LatheGeometry
- **GSAP + ScrollTrigger** — animazioni fluide
- **React** — componente ToothModel (island architecture)
- **Decap CMS** — pannello admin per gestire contenuti

## Avvio Locale

```bash
npm install
npm run dev
```

Apri `http://localhost:4321`

## Build

```bash
npm run build
npm run preview
```

## Struttura Principale

```
src/
├── components/       # Header, Footer, HeroSection, ToothModel, ecc.
├── data/
│   ├── projects/     # File .md per ogni progetto
│   ├── blog/         # File .md per ogni articolo
│   ├── testimonials/ # File .md per ogni testimonianza
│   ├── settings.json # Config globale (email, social, stats)
│   └── skills.json   # Competenze per la pagina About
├── layouts/          # Layout.astro (base page)
├── pages/            # index, projects, blog, about
└── styles/
    └── global.css    # Design tokens @theme + base styles
```

## Configurazione

### 1. Dati personali
Modifica `src/data/settings.json` con le tue info reali (email, link social).

### 2. Form di contatto (FormSpree)
1. Registrati su [formspree.io](https://formspree.io)
2. Crea un form e copia il tuo Form ID
3. In `src/components/Contact.astro`, sostituisci `YOUR_FORM_ID` con il tuo ID

### 3. CMS (opzionale)
Per usare il pannello admin `/admin`:
1. Deploy su Netlify
2. Abilita **Identity** + **Git Gateway** nelle impostazioni Netlify
3. Invita te stesso via Netlify Identity

## Deploy

### Netlify (consigliato)
```bash
# Collega il repo GitHub a Netlify
# Build command: npm run build
# Publish directory: dist/
```

### Vercel
```bash
npx vercel --prod
```
