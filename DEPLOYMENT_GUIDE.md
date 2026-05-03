# Guida al Deployment - Portfolio Jasser

Questa guida ti aiuterà a deployare il tuo portfolio su Netlify o Vercel con Decap CMS completamente funzionante.

## 📋 Prerequisiti

1. **Repository GitHub**: Carica il progetto su GitHub
2. **Account Netlify o Vercel**: Crea un account gratuito
3. **GitHub OAuth App**: Per Decap CMS (opzionale ma consigliato)

## 🚀 Deployment su Netlify (Consigliato)

### Passo 1: Carica il progetto su GitHub

```bash
# Nel tuo repository locale
git remote add origin https://github.com/TUO_USERNAME/jasser-portfolio.git
git branch -M main
git push -u origin main
```

### Passo 2: Connetti Netlify a GitHub

1. Vai a [netlify.com](https://netlify.com)
2. Clicca "Sign up" e scegli "GitHub"
3. Autorizza Netlify ad accedere ai tuoi repository

### Passo 3: Crea un nuovo sito

1. Clicca "New site from Git"
2. Seleziona il repository `jasser-portfolio`
3. Scegli branch: `main`

### Passo 4: Configura build settings

Netlify dovrebbe auto-rilevare Astro, ma verifica:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 22.12.0 (o superiore)

### Passo 5: Deploy

Clicca "Deploy site". Netlify farà il build e il deploy automaticamente.

### Passo 6: Configura Decap CMS con GitHub OAuth

#### Crea un'app OAuth su GitHub

1. Vai a [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Clicca "New OAuth App"
3. Compila il form:
   - **Application name**: "Jasser Portfolio CMS"
   - **Homepage URL**: `https://TUO_SITO.netlify.app`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`

4. Copia il **Client ID** e **Client Secret**

#### Configura Netlify

1. Nel dashboard di Netlify, vai a **Site settings > Build & deploy > Environment**
2. Aggiungi variabili d'ambiente:
   - `GITHUB_CLIENT_ID`: Il tuo Client ID
   - `GITHUB_CLIENT_SECRET`: Il tuo Client Secret

#### Abilita Netlify Identity

1. Vai a **Site settings > Identity**
2. Clicca "Enable Identity"
3. Vai a **Services > GitHub**
4. Abilita GitHub come provider

### Passo 7: Accedi a Decap CMS

1. Visita `https://TUO_SITO.netlify.app/admin`
2. Clicca "Login with GitHub"
3. Autorizza l'accesso
4. Inizia a creare contenuti!

## 🚀 Deployment su Vercel

### Passo 1: Carica il progetto su GitHub

(Vedi Netlify Passo 1)

### Passo 2: Connetti Vercel a GitHub

1. Vai a [vercel.com](https://vercel.com)
2. Clicca "Sign Up" e scegli "GitHub"
3. Autorizza Vercel ad accedere ai tuoi repository

### Passo 3: Importa il progetto

1. Clicca "New Project"
2. Seleziona il repository `jasser-portfolio`
3. Vercel auto-rileverà Astro

### Passo 4: Configura build

Vercel dovrebbe auto-configurare tutto, ma verifica:

- **Framework Preset**: Astro
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Passo 5: Deploy

Clicca "Deploy". Vercel farà il build e il deploy automaticamente.

### Passo 6: Configura Decap CMS

Per Vercel, il processo è simile a Netlify:

1. Crea un'app OAuth su GitHub (vedi Netlify Passo 6)
2. Nel dashboard di Vercel, vai a **Settings > Environment Variables**
3. Aggiungi le stesse variabili
4. Rideploy il sito

## 🔧 Configurazione Decap CMS Avanzata

### Modificare il backend

Se vuoi usare un backend diverso, modifica `public/admin/config.yml`:

```yaml
backend:
  name: github  # Invece di git-gateway
  repo: TUO_USERNAME/jasser-portfolio
  branch: main
```

### Abilitare l'autenticazione locale

Per testare Decap CMS localmente senza GitHub OAuth:

```bash
# Installa il server locale
npm install -g decap-cms-server

# Avvia il server
decap-cms-server

# In un altro terminale, avvia Astro
npm run dev
```

Visita `http://localhost:3000/admin` e accedi.

## 📝 Gestione Contenuti Post-Deploy

### Aggiungere Progetti

1. Vai a `/admin`
2. Clicca "Progetti"
3. Clicca "New Progetti"
4. Compila il form
5. Clicca "Publish"

### Aggiungere Articoli Blog

1. Vai a `/admin`
2. Clicca "Blog"
3. Clicca "New Blog"
4. Scrivi il contenuto in Markdown
5. Clicca "Publish"

### Modificare Impostazioni

1. Vai a `/admin`
2. Clicca "Impostazioni Sito"
3. Modifica i valori
4. Clicca "Publish"

## 🔄 Workflow di Sviluppo

### Locale

```bash
# Avvia il server di sviluppo
npm run dev

# Fai modifiche ai componenti
# Visita http://localhost:3000

# Build per testare
npm run build
npm run preview
```

### Deployment

```bash
# Commit e push le modifiche
git add .
git commit -m "Descrizione modifiche"
git push origin main

# Netlify/Vercel farà il build automaticamente
# Visita il tuo sito per vedere le modifiche
```

## 🐛 Troubleshooting

### Decap CMS mostra "Not Found"

- Verifica che `/admin/config.yml` esista
- Verifica che `/admin/index.html` esista
- Pulisci la cache del browser (Ctrl+Shift+Del)

### Build fallisce su Netlify/Vercel

```bash
# Localmente
npm run build

# Se fallisce, controlla gli errori
# Pulisci e riprova
rm -rf node_modules dist
npm install
npm run build
```

### Immagini non si vedono dopo il deploy

- Assicurati che le immagini siano in `public/images/`
- Usa il path `/images/nome-immagine.jpg` nei componenti
- Non usare path relativi

### Decap CMS non salva i contenuti

- Verifica che il repository sia pubblico (o che Netlify abbia accesso)
- Verifica che il branch sia `main`
- Controlla i permessi GitHub dell'app OAuth

## 📊 Monitoraggio Post-Deploy

### Verifica Performance

1. Vai su [PageSpeed Insights](https://pagespeed.web.dev)
2. Inserisci il tuo URL
3. Verifica che Lighthouse score sia > 90

### Monitora Errori

- **Netlify**: Vai a "Analytics" per vedere errori di build
- **Vercel**: Vai a "Deployments" per vedere log di build

### Backup Contenuti

I contenuti sono salvati in Git, quindi:

```bash
# Fai regolarmente pull dei contenuti
git pull origin main

# Backup locale
cp -r src/data ~/backup-portfolio-data-$(date +%Y%m%d)
```

## 🔒 Sicurezza

### Proteggi l'accesso a /admin

Su Netlify:

1. Vai a **Site settings > Identity**
2. Configura **Registration**: "Invite only"
3. Invita solo te stesso

Su Vercel:

Usa **Vercel Password Protection** o configura un middleware personalizzato.

### Variabili d'ambiente

Non commitare mai:
- GitHub Client Secret
- API Keys
- Password

Usa le variabili d'ambiente del tuo hosting.

## 📞 Supporto

Se hai problemi:

1. Consulta la [documentazione Netlify](https://docs.netlify.com)
2. Consulta la [documentazione Vercel](https://vercel.com/docs)
3. Consulta la [documentazione Decap CMS](https://decapcms.org/docs)
4. Apri un issue su GitHub

## ✅ Checklist Pre-Deploy

- [ ] Progetto funziona localmente (`npm run dev`)
- [ ] Build locale funziona (`npm run build`)
- [ ] Repository su GitHub è pubblico
- [ ] README.md è aggiornato
- [ ] Immagini sono in `public/images/`
- [ ] Nessun errore di console
- [ ] Dark mode funziona
- [ ] Sito è responsive su mobile

## ✅ Checklist Post-Deploy

- [ ] Sito è raggiungibile
- [ ] Tutte le pagine caricano
- [ ] Animazioni funzionano
- [ ] Modello 3D si vede
- [ ] Form di contatto funziona
- [ ] `/admin` è accessibile
- [ ] Decap CMS funziona
- [ ] Lighthouse score > 90

---

**Buon deployment! 🚀**
