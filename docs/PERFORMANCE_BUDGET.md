# Budget e misure

## Build dimostrativa

Audit Lighthouse 13.6.0 eseguito il 24 novembre 2026 con Chrome, profilo mobile e throttling simulato, sulla build statica servita da `astro preview` in locale. Il GLB definitivo è assente. [Risultati numerici dell’audit](lighthouse-mobile.json)

| Misura                      | Risultato |
| --------------------------- | --------- |
| Performance                 | 99/100    |
| Accessibilità automatizzata | 100/100   |
| Best Practices              | 100/100   |
| SEO                         | 63/100    |
| Largest Contentful Paint    | 2,03 s    |
| First Contentful Paint      | 0,76 s    |
| Total Blocking Time         | 0 ms      |
| Cumulative Layout Shift     | 0         |

La configurazione `noindex` della demo penalizza il punteggio SEO. L’indicizzazione si attiva in `src/config/seo.ts` dopo la configurazione del dominio e dei contenuti reali. L’audit rileva ancora un possibile risparmio di circa 30 KiB sulle immagini. Le Core Web Vitals sul campo, incluso INP, richiedono traffico reale.

## Budget di lavoro

| Risorsa             | Obiettivo                                       | Stato della demo                                                       |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| HTML e CSS          | Ciascuno sotto 25 KB prima del trasferimento    | HTML 22,9 KB (didascalie comprese) e CSS 15,1 KB                       |
| JavaScript iniziale | Sotto 10 KB gzip                                | Script della storia 5,1 KB gzip, avviato dopo `load`                   |
| Tracciamento        | Sotto 30 KB gzip, scaricato dopo `load`         | `story/tracks.json` 25,3 KB gzip                                       |
| Caratteri locali    | Fino a 220 KB WOFF2                             | Newsreader tondo e corsivo con taglio ottico, glifi italiani: 208,8 KB |
| Hero                | Sotto 100 KB per la variante desktop            | WebP 19,3 / 29,5 / 67,1 KB a 640 / 800 / 1280 px                       |
| Immagini editoriali | Sotto 200 KB per la variante maggiore           | Tutte entro budget, con caricamento differito                          |
| Codice opzionale 3D | Sotto 220 KB gzip, inclusi GSAP e ScrollTrigger | Circa 204 KB gzip per scena, core e animazioni                         |
| Modello Blender     | Idealmente sotto 5 MB                           | In attesa dell’asset definitivo                                        |
| Rendering           | Nessun loop continuo della scena                | Richieste di frame aggregate e controllate da visibilità e input       |

I pesi gzip sono stime sugli artefatti di build. Compressione HTTP e cache dipenderanno dall’hosting.

## Verifiche funzionali

- Build statica completa senza GLB. ESLint, diagnostica Astro/TypeScript strict e cinque test Vitest superati.
- Screenshot in Chrome a 1440 × 900 e 390 × 844. Verificati ingrandimento e chiusura con Escape, navigazione mobile, voci servizi, FAQ e apertura della nota demo.
- A 320 px con JavaScript disabilitato, verificati assenza di overflow orizzontale, accesso alla prenotazione dal menu e apertura della nota informativa.
- Sul percorso di fallback sono state controllate l’assenza di canvas e di richieste al GLB e al bundle della scena.
- Con un GLB tecnico temporaneo servito in memoria, verificati creazione del canvas, scroll nel manifesto, rilascio al cambio di preferenza di movimento e successiva riattivazione. Una risposta binaria danneggiata riporta al poster. La fixture contiene un triangolo condiviso tra nodi e resta esclusa dagli asset pubblici.

## Al prossimo rilascio

Ripetere l’audit sulla preview Vercel con cache fredda, sul sito configurato per il cliente e con il modello definitivo. Verificare inquadratura e memoria GPU su hardware reale. Misurare le interazioni con traffico sufficiente per validare INP, LCP e CLS sul campo.
