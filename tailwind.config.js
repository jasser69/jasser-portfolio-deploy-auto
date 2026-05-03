// NOTE: Tailwind CSS v4 non usa questo file per i design tokens.
// I token sono definiti con @theme in src/styles/global.css.
// Questo file viene ignorato dal plugin @tailwindcss/vite (v4).
// Mantenuto solo per compatibilità con tooling IDE.

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  // darkMode non serve in v4 — gestito via html.dark class in JS
};
