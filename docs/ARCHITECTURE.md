# Architettura

## Rendering

`EditorialLayout.astro` imposta lingua italiana, metadati, navigazione e piè di pagina. `index.astro` ordina cinque blocchi: la storia e quattro sezioni editoriali. Astro produce HTML e CSS statici con un solo H1, che è il titolo della storia. Servizi, percorsi e domande sono testo sempre visibile (liste di definizioni); menu mobile e nota demo usano `details/summary` e sono operabili da tastiera anche senza JavaScript.

`src/components/story/Story.astro` compone la sequenza fotografica: un palco fisso alto uno schermo (poster e canvas) e, sopra, l'apertura con l'H1 e quattro capitoli nel flusso del documento. In build legge l'elenco dei fotogrammi in `public/story/desktop` e `public/story/mobile` e lo passa al client come attributo `data-frames`.

`src/components/ui` raccoglie marchio e immagini responsive (640–1600 px). `src/components/sections` assembla la lettera (Chi sono), il menù dello studio (servizi alla carta e percorsi), le domande in forma di dialogo e il finale con la prenotazione.

## Configurazione

`src/types/content.ts` definisce i tipi condivisi. `src/config` contiene moduli distinti per branding, testo editoriale (compresi i capitoli della storia), professionista, servizi, percorsi, FAQ, contatti e SEO. I contenuti configurati vengono trasformati in HTML durante la build.

La configurazione contatti produce un elenco di canali ammessi. In demo restituisce un elenco vuoto anche quando sono presenti destinazioni. In modalità live ogni canale usa un URI adatto al proprio tipo.

## Client

Un solo script, quello della storia, avviato dopo l'evento `load`:

- `lib/story/frames.ts` contiene la logica pura e testata: scroll → fotogramma ancorato ai capitoli (con sosta mentre si legge), fotogramma decodificato più vicino, ordine di scaricamento, ritaglio "cover" sul canvas.
- `lib/story/annotations.ts` impagina le didascalie, sempre con logica pura e testata: lato rispetto al centro della composizione, alternative ordinate per costo (altro lato, filo più lungo, una riga più su o più giù, sopra l'oggetto), nessuna sovrapposizione con il testo dei capitoli, con altre didascalie o con altri oggetti (filo compreso), colonna allineata mentre gli oggetti formano la torre.
- `lib/story/notes.ts` disegna le didascalie in un livello SVG sopra il canvas, leggendo `public/story/tracks.json` dopo `load`.
- `lib/story/player.ts` sceglie la serie (orizzontale o verticale), scarica i fotogrammi con tre richieste in parallelo, disegna sul canvas solo quando cambia il fotogramma, aggiorna le didascalie e passa ai soli fotogrammi chiave con movimento ridotto o risparmio dati.

Non ci sono dipendenze JavaScript a runtime. La demo non prevede API, database, form o storage persistente. L'integrazione con piattaforme di prenotazione passa per collegamenti configurabili.
