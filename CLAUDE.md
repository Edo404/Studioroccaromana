# Studio Rocca Romana — sito web

Sito vetrina statico di **Studio Rocca Romana** (produzione artistica/musicale, Angelo De Cave).
Online su https://www.studioroccaromana.it, hosting **Aruba** (Windows/IIS 10). `.user.ini` è di Aruba: non modificarlo.
`web.config`: la riga `compilation tempDirectory` è di Aruba (non toccarla); la sezione `staticContent` è nostra
e dichiara il tipo `.webp`, senza cui IIS risponde 404.3 a tutte le immagini. Repo: https://github.com/Edo404/Studioroccaromana

## Branch
- `main` = versione attuale del sito: il redesign (settembre 2026) è stato mergiato il 29/09/2026.
  La vecchia versione del 2022 resta solo nella storia git (commit `8c16784`).
- `redesign` = branch di lavoro del redesign, allineato a `main` al momento del merge.
- Push/merge su `main` solo su richiesta esplicita del proprietario.
- Nessuna pubblicazione automatica: il sito online su Aruba cambia solo con il caricamento via FTP.

## Stack e principi
- HTML/CSS/JS puri, **nessun build step, nessuna dipendenza** (niente jQuery/GSAP/framework).
  Il proprietario pubblica caricando i file via FTP: tutto deve restare servibile così com'è.
- `css/main.css` — unico foglio di stile (design token in `:root`, sezioni commentate).
- `js/main.js` — unico script, vanilla ES5-compatibile: menu mobile, header allo scroll,
  animazioni in ingresso (IntersectionObserver), consenso cookie + Google Analytics.
- `img/` — tutte le immagini, in **WebP** (foto artisti 800×800, sfondi 2400px + versione `-sm` 1100px).
- **Cache busting**: nei 21 HTML i link sono `css/main.css?v=AAAAMMGG` e `js/main.js?v=AAAAMMGG`.
  Quando modifichi CSS o JS aggiorna la data in tutte le pagine, altrimenti i visitatori vedono la versione in cache.
- `fonts/` — Montserrat variabile (400–600) **ospitato in locale**: non reintrodurre Google Fonts (GDPR).
- Lingua del sito e dei commenti nel codice: **italiano**.

## Pagine
| File | Contenuto |
|---|---|
| `index.html` | Home: sfondo scurito + 2 blocchi (Artisti rosso, Intrattenimento verde) centrati su bande |
| `artisti.html` | Griglia: sezioni "Musica" e "Cinema, TV e spettacolo" (banda rossa) |
| `intrattenimento.html` | Griglia (banda verde) |
| `chisiamo.html` | Testo su sfondo fotografico |
| `contatti.html` | Info sedi + form ingaggio (formsubmit.co) |
| `privacy.html` | Informativa privacy GDPR + cookie policy |
| pagine bio | `edodeange`, `drgam`, `marcondiro`, `giannidavoli`, `notedaoscar`, `letizya`, `antonellaponziani`, `moniapalmieri`, `massimilianopazza`, `antoniofiorillo`, `marcocarena`, `manuelalettieri`, `lucanasti` (esiste ma **non** è linkata nella griglia, voluto), `bellaepoca`, `spaziovasco` |

I nomi dei file HTML sono quelli storici: **non rinominarli** (URL già indicizzati).

Header, footer e banner cookie sono **duplicati in ogni pagina** (nessun templating):
se li modifichi, applica la stessa modifica a tutti i 21 file HTML (es. con uno script/sed).
Le pagine sono state generate una volta da uno script non committato; ora si modificano a mano.

## Design (requisiti del proprietario)
- Mantenere l'impostazione originale, design semplice. Colori:
  `--red #ff7979` (artisti), `--green #a9cd99` (intrattenimento), pannelli contatti `#6971c0`/`#a1a6d1`,
  bottone form `#790405` (hover `#343567`).
- **Home desktop**: bande verticali, blocchi concentrici alle bande e centrati sullo sfondo;
  blocchi grandi `clamp(280px, min(32vw, 58vh), 520px)`. **Mobile (≤1024px)**: bande orizzontali.
  Sfondo sempre scurito (`--shade`, nero 30%) su desktop e mobile. Su mobile si usa
  `img/bg-home-mobile.webp`, ritaglio verticale della parte fotografica (palco/pubblico/mixer), perché il
  centro dell'immagine desktop è un bagliore bianco: su mobile deve vedersi la foto.
  Link legali in basso nella home (P.IVA, privacy, preferenze cookie) senza sfondo bianco.
- **Chi siamo (desktop ≥1025px e altezza ≥560px)**: `body.about` è alto esattamente 100vh con `overflow: hidden`,
  testo in `clamp(14px, min(1.25vw, 2.3vh), 22px)`: header + testo + footer sempre in una schermata, senza scroll.
- Il banner cookie ha `display:flex`, quindi serve `.cookie-banner[hidden] { display: none; }` (non toglierlo).
- **Griglie**: desktop = banda orizzontale dietro ogni riga di foto (`.card-media::before`);
  mobile (≤600px) = una colonna con banda verticale centrata (`.roster::before`).
  ⚠️ L'animazione di comparsa deve animare solo `.card-img`/`.card-name`, **mai** `.card`:
  se la card ha opacity/transform diventa un contesto di impilamento e la banda copre le foto vicine
  (bug già risolto, non reintrodurlo).
- **Bio**: foto a sinistra (sticky su desktop) con riquadro colorato della sezione, testo a destra;
  link "← Artisti/Intrattenimento"; su mobile tutto in colonna.
- Animazioni sobrie; tutto rispetta `prefers-reduced-motion`.

## Privacy / legale (non peggiorare)
- **Google Analytics 4** `G-EJW26R73HE`: caricato da `main.js` **solo dopo "Accetta"**. Nessuno snippet gtag nell'`<head>`.
- Banner: "Rifiuta" e "Accetta" di pari peso + × = rifiuta. Scelta salvata in localStorage `srr-consent`
  (`{analytics, ts}`) per ~6 mesi. Link "Preferenze cookie" (`[data-cookie-prefs]`) in footer e home
  riapre il banner; la revoca cancella i cookie `_ga*` e ricarica.
- Se si aggiunge un servizio di terze parti (mappe, video, pixel…) va bloccato prima del consenso
  e aggiunto a `privacy.html` (sezioni destinatari + tabella cookie), aggiornando la data "Ultimo aggiornamento".
- Titolare: Studio Rocca Romana – Angelo De Cave, **P.IVA 02061370595**, sede legale Via Cuba 1,
  38410 Los Realejos (Tenerife), sede operativa Strada Zì Maria 695, 04010 Borgo Grappa (LT),
  angelo@studioroccaromana.it. La P.IVA è in footer, home e informativa.
- Il vecchio link iubenda (`/privacy-policy/83350970`) è morto (404): non riusarlo.

## Form contatti
`action="https://formsubmit.co/studioroccaromana@libero.it"`, `target="_blank"`. Campi (non cambiarli senza
richiesta): name, surname, nazionalità, email, phone, message + checkbox obbligatoria `privacy`.
Campi nascosti: `_subject`, `_honey` (antispam).

## Aggiungere un artista
1. Foto quadrata → WebP 800×800 in `img/<nome-cognome>.webp`, es. con Pillow:
   ```python
   from PIL import Image, ImageOps
   im = ImageOps.exif_transpose(Image.open("foto.jpg")).convert("RGB")
   s = min(im.size); im = ImageOps.fit(im, (s, s), Image.LANCZOS, centering=(0.5, 0.3))
   im.thumbnail((800, 800), Image.LANCZOS); im.save("img/nome-cognome.webp", "WEBP", quality=80, method=6)
   ```
2. Copia una pagina bio esistente (es. `marcocarena.html`), cambia `<title>`, meta description/og, canonical,
   immagine, `<h1>`, testo, link esterno e la classe tema (`theme-red` artisti / `theme-green` intrattenimento).
3. Aggiungi un `<li class="card" style="--delay:…">` nella griglia giusta (`--delay` = 0, .08, .16, .24s per colonna).

## Sviluppo locale
```bash
python tools/serve.py
```
poi apri http://127.0.0.1:5500. `tools/serve.py` invia `Cache-Control: no-store`: con il semplice
`python -m http.server` il browser tiene in cache HTML/CSS vecchi e le modifiche non si vedono. Verificare sempre desktop (1440×900), tablet (768) e mobile (375×812).

Note Windows: clonare in un percorso **corto** (git fallisce con "'$GIT_DIR' too big"/"Filename too long"
in cartelle molto annidate). Gli avvisi git "LF will be replaced by CRLF" sono innocui.

## Da fare / aperto
- Il proprietario deve rivedere `privacy.html` (non è una consulenza legale) e in Google Analytics
  impostare conservazione dati 14 mesi, Google Signals e pubblicità disattivati.
- FormSubmit ha server extra-UE: eventualmente valutare un servizio europeo.
- Pubblicazione su Aruba (se non ancora fatta): caricare via FTP `*.html`, `css/`, `js/`, `img/`, `fonts/`,
  `favicon.ico` e `web.config`. La vecchia cartella `images/` sul server non serve più. `tools/` e `CLAUDE.md` non vanno caricati.
