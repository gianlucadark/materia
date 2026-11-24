# Materia — The Art of Balance

Landing dimostrativa in italiano per uno studio di nutrizione. Astro genera una pagina HTML statica. La pagina è una storia fotografica, "dalla materia all'equilibrio": allo scroll gli ingredienti sparsi su un tavolo si compongono nella scultura di Materia. Ogni oggetto porta una didascalia che lo segue nel movimento e racconta la settimana del lettore: la pera è "la colazione che salti", le mandorle "la fame delle cinque". Tutte le immagini sono render dello stesso set Blender, serviti dallo stesso sito insieme a caratteri e contenuti.

## Struttura

Questo repository contiene solo il sito. Il set Blender (file .blend, script Python di build e render, texture, riferimenti, GLB e relativi report) vive nella cartella sorella `../3d`, fuori da git. Gli script di render scrivono direttamente in `public/story` e `public/images` di questa cartella; per un percorso diverso impostare la variabile `MATERIA_WEB`.

## Avvio

Dalla directory del progetto, con Node 24 LTS e npm:

```sh
npm ci
npm run dev
```

Aprire l’indirizzo locale stampato da Astro. La build di produzione si avvia con:

```sh
npm run build
npm run preview
```

## Controlli

| Comando                | Verifica                                                         |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run check`        | TypeScript strict e diagnostica dei componenti Astro             |
| `npm run lint`         | ESLint su JavaScript, TypeScript e componenti Astro              |
| `npm test`             | Logica della sequenza fotografica e isolamento dei contatti demo |
| `npm run format:check` | Formattazione Prettier                                           |
| `npm run build`        | Generazione di `dist/`                                           |

## Personalizzare la demo

| File o directory                                   | Contenuto                                                              |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| [src/pages/index.astro](src/pages/index.astro)     | Ordine delle sezioni                                                   |
| [src/config](src/config)                           | Identità, copy, professionista, servizi, percorsi, FAQ, contatti e SEO |
| [src/styles/_tokens.scss](src/styles/_tokens.scss) | Palette, font, griglia, spaziature e movimento                         |
| [public/images](public/images)                     | Fotografie editoriali renderizzate dal set Blender                     |
| [public/story](public/story)                       | Fotogrammi della storia (orizzontali e verticali)                      |
| [public/fonts](public/fonts)                       | Newsreader (WOFF2 ridotto ai glifi italiani) e licenza SIL OFL 1.1     |
| [src/lib/story](src/lib/story)                     | Sequenza guidata dallo scroll e sua logica testata                     |

In `src/config/contacts.ts`, la modalità `demo` esclude tutti i collegamenti ai fornitori. La CTA apre una nota dimostrativa. La modalità `live` usa i canali configurati. Verificare identità, servizi, condizioni, destinazioni e informativa del cliente prima della pubblicazione.

I fotogrammi e le fotografie si rigenerano da Blender con `../3d/scripts/build_story.py` e `../3d/scripts/render_story.py`, le posizioni degli oggetti per le didascalie con `../3d/scripts/track_story.py` (vedi [Contratto Blender](docs/3D_INTEGRATION.md)). Dopo un nuovo render ricostruire il sito. Il primo fotogramma si vede anche senza JavaScript e durante il caricamento.

## Distribuzione su Vercel

Importare il repository con il preset **Astro**, scegliere Node 24, comando di build `npm run build` e directory di output `dist`. Per l’esportazione statica non servono un adapter server o credenziali di runtime. Impostare `PUBLIC_SITE_URL` con l’origine HTTPS definitiva e ricostruire per generare canonical e URL assoluti delle anteprime social. Prima dell’indicizzazione, aggiornare `seo.indexable`. [Documentazione Vercel per Astro](https://vercel.com/docs/frameworks/frontend/astro)

## Documentazione

- [Direzione artistica](docs/ART_DIRECTION.md) e [origine delle immagini](docs/IMAGES.md)
- [Architettura](docs/ARCHITECTURE.md) e [linee guida editoriali](docs/CONTENT_GUIDELINES.md)
- [Contratto Blender](docs/3D_INTEGRATION.md) e [piano delle animazioni](docs/ANIMATION_PLAN.md)
- [Budget e misure](docs/PERFORMANCE_BUDGET.md) e [prossimi passi](docs/ROADMAP.md)
