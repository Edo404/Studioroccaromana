# Studio Rocca Romana — sito web

Sito vetrina statico di **Studio Rocca Romana** (produzione artistica/musicale, Angelo De Cave).
Online su https://www.studioroccaromana.it, hosting **Aruba** (Windows/IIS 10). `.user.ini` è di Aruba: non modificarlo.
`web.config`: la riga `compilation tempDirectory` è di Aruba (non toccarla); la sezione `staticContent` è nostra
e dichiara il tipo `.webp`, senza cui IIS risponde 404.3 a tutte le immagini. Repo: https://github.com/Edo404/Studioroccaromana

## Branch
- `main` = versione attuale del sito: il redesign (settembre 2026) è stato mergiato il 29/09/2026.
  La vecchia versione del 2022 resta solo nella storia git (commit `8c16784`).
- `redesign` = branch di lavoro del redesign di settembre, allineato a `main` al momento del merge.
- `redesign-palco` = seconda revisione grafica (novembre 2026, direzione "backstage"): non ancora in `main`,
  da far approvare al proprietario. Stessi contenuti, stesse URL, cambia solo il design.
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
- `fonts/` — Bricolage Grotesque variabile (peso 300–800, larghezza 75–100%) **ospitato in locale**: non reintrodurre Google Fonts (GDPR).
- Lingua del sito e dei commenti nel codice: **italiano**.

## Pagine
| File | Contenuto |
|---|---|
| `index.html` | Home: titolo + vinile col logo + due copertine (Lato A/B), "1986", cassetta delle foto degli artisti |
| `artisti.html` | Griglia: sezioni "Musica" e "Cinema, TV e spettacolo" |
| `intrattenimento.html` | Griglia |
| `chisiamo.html` | Titolo gigante + testo, una sola schermata su desktop |
| `contatti.html` | Info sedi + form ingaggio (formsubmit.co) |
| `privacy.html` | Informativa privacy GDPR + cookie policy |
| pagine bio | `edodeange`, `drgam`, `marcondiro`, `giannidavoli`, `notedaoscar`, `letizya`, `antonellaponziani`, `moniapalmieri`, `massimilianopazza`, `antoniofiorillo`, `marcocarena`, `manuelalettieri`, `lucanasti` (esiste ma **non** è linkata nella griglia, voluto), `bellaepoca`, `spaziovasco` |

I nomi dei file HTML sono quelli storici: **non rinominarli** (URL già indicizzati).

Header, footer e banner cookie sono **duplicati in ogni pagina** (nessun templating):
se li modifichi, applica la stessa modifica a tutti i 21 file HTML (es. con uno script/sed).
Le pagine sono state generate una volta da uno script non committato; ora si modificano a mano.

## Design (direzione "backstage", branch `redesign-palco`)
Il proprietario ha approvato una revisione radicale (3/11/2026): nuova palette, nuovi layout. Il vecchio vincolo
"rosso/verde, bande, impostazione originale" **non vale più** su questo branch; vale ancora per `main` finché non si fa il merge.
- **Tema unico scuro**, mai chiaro. **Palette ricavata dal logo originale** (campionata dai pixel di `img/logo.webp`):
  blu notte `--bg #080a26` / `--bg-2 #0f1340` (dal blu reale del logo `#17217f`, tenuto come `--blue` per i bagliori),
  lavanda `--lav #ced3f7` (alone del logo), testo `--ink #eceeff`, secondario `--muted #a9aed6`.
  **Un solo accento**: il rosso del logo schiarito per il fondo scuro, `--accent #ee4b3f` (testo su accento: `--on-accent`, blu notte).
  Niente verde, niente altri colori di marca.
- **Forma**: angoli vivi (raggio 0) ovunque; unica eccezione il logo, che resta l'originale (cerchio bianco, `img/logo.webp`, non modificarlo).
- **Tipografia**: Bricolage Grotesque. Titoli display = peso 800, `font-stretch: 75%`, maiuscolo, interlinea ~.85 (classi nell'elenco in cima a `main.css`).
- **Home ("il disco sul piatto")**: `.hero` = `h1` gigante a sinistra ("Romana" in accento) + un **vinile** (`.vinyl`, solo CSS) tagliato dal bordo
  destro che gira lento (24 s) con il **logo originale come etichetta** (`img/logo.webp`, non modificarlo né ritagliarlo) + due **copertine** inclinate
  (`.side`: "Lato A" Artisti con `bg-artisti.webp`, "Lato B" Intrattenimento con `bg-intrattenimento.webp`, foto Unsplash 1800x720, licenza libera).
  All'hover il disco si ferma (`:has`) e la copertina si raddrizza. Sotto: `.since` ("1986" in accento + frase tratta da Chi siamo) e
  `.crate` ("I nostri artisti": fila orizzontale scorrevole, `scroll-snap`, delle 12 foto di `artisti.html`; se si aggiunge un artista in
  `artisti.html` aggiungerlo anche qui). Le sezioni `.reveal` compaiono con l'IntersectionObserver. Non c'è più la fascia scorrevole dei nomi.
  Mobile (≤1024px): colonna unica, il vinile resta dietro/accanto al titolo.
- **Griglie (Artisti: "Musica" e "Cinema, TV e spettacolo"; Intrattenimento)**: "artist wall" copiato da redlightmanagement.com:
  righe da **4** tessere quadrate quasi a contatto (gap 4px; 2 per riga sotto i 700px), foto a colori, **nome sempre visibile** in basso a sinistra.
  All'hover (solo `hover: hover` e ≥700px) la tessera raddoppia (`scale(2)`, il nome ha `scale(.5)` per restare uguale) restando agganciata
  al suo angolo: colonne 1-2 crescono verso destra, 3-4 verso sinistra; le tessere dell'ultima riga (classe `is-last-row`, messa da `main.js`
  quando le righe sono ≥2) crescono verso l'alto. Le immagini delle tessere sono `loading="eager"` (con `lazy` l'ultima compariva in ritardo).
  La comparsa anima solo `.card-img`.
- **Intro a schermo intero** su `artisti.html` e `intrattenimento.html`: due metà oblique (viola `--purple #9043a9` e bianco del logo) si chiudono sulla parola
  "ARTISTI" o "INTRATTENIMENTO" e poi si aprono; il taglio passa dentro le lettere, ogni metà le disegna a colori invertiti. Idea di
  wmg.com/songwriters, ma più rapida (1,5 s). Markup `.intro` subito dopo `<body>` (la grandezza della parola è `--fs` in `vh`, regolata per
  lunghezza della parola); CSS puro in fondo a `main.css`; `main.js` la chiude con clic/Esc o dopo 1,6 s. Uno script inline nell'`<head>`
  mette `no-intro` su `<html>` se si arriva da una pagina bio (così "← Artisti" non la rifà). Disattivata con `prefers-reduced-motion`.
  ⚠️ Non rimettere l'animazione di dissolvenza su `body`: sbiadirebbe anche l'intro (ora è su `main` e `.site-footer`).
- **Bio**: foto sticky a sinistra (4:5), nome enorme + testo a destra; su mobile in colonna.
- **Chi siamo (desktop ≥1025px e altezza ≥560px)**: `body.about` è alto esattamente 100vh con `overflow: hidden`,
  testo in `clamp(14px, min(1.25vw, 2.3vh), 22px)`: header + testo + footer sempre in una schermata, senza scroll.
- **Contatti**: due colonne su sfondo scuro (info a sinistra, form a destra), campi `--bg-2` con bordo ben visibile, bottone in accento.
- Il banner cookie ha `display:flex`, quindi serve `.cookie-banner[hidden] { display: none; }` (non toglierlo). "Rifiuta" e "Accetta" identici.
- **Animazioni**: solo `transform`/`opacity`/`clip-path`; tutto rispetta `prefers-reduced-motion`. Nessun listener `scroll`
  (l'header usa un IntersectionObserver su una sentinella). Niente cursori personalizzati.
- Rimossi perché troppo sbiaditi per un tema scuro: `bg-home*.webp`, `bg-chisiamo*.webp`, `tile-*.webp`. Le classi `theme-red`/`theme-green`
  restano nell'HTML ma non hanno più effetto.
- Nei testi visibili nuovi non usare il trattino lungo (em-dash).

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
   immagine, `<h1>`, testo, link esterno e la classe tema (la classe tema resta per compatibilità, oggi non ha effetto grafico).
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
- `privacy.html`: il proprietario l'ha rivista (29/09/2026) e per ora va bene così (non è una consulenza legale).
- Google Analytics (fatto il 29/09/2026): conservazione dati eventi a 14 mesi e Google Signals disattivato.
  La personalizzazione annunci non serve: "Flussi di dati" non compare nel pannello e Signals è spento.
  Per cambiare l'ID di misurazione: `GA_ID` in `js/main.js`, poi aggiornare `?v=` in tutti gli HTML.
- FormSubmit ha server extra-UE: eventualmente valutare un servizio europeo.
- Pubblicazione su Aruba: caricamento FTP del redesign completato con successo (29/09/2026).
  Per i prossimi aggiornamenti caricare solo i file modificati (`*.html`, `css/`, `js/`, `img/`, `fonts/`,
  `favicon.ico`, `web.config`). La vecchia cartella `images/` sul server non serve più. `tools/` e `CLAUDE.md` non vanno caricati.
