# Contratto Blender → frontend

Il sito mostra la scultura come una **sequenza fotografica renderizzata in Blender** e guidata dallo scroll, non come modello in tempo reale. Così ogni immagine ha la stessa luce, le stesse ombre e gli stessi materiali (subsurface compreso) dei render finali. Il GLB resta disponibile come asset per usi interattivi futuri.

## Consegna al sito

| Cosa                  | Dove                                           | Come si produce                                                                                               |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Sequenza orizzontale  | `public/story/desktop/f001…f096.webp`          | `blender -b ../3d/blender/materia-story.blend --python ../3d/scripts/render_story.py -- --set desktop --half` |
| Sequenza verticale    | `public/story/mobile/f001…f096.webp` (96 pose) | `… render_story.py -- --set mobile`                                                                           |
| Fotografie editoriali | `public/images/story-*.webp`                   | `… render_story.py -- --set stills`                                                                           |
| Tracciamento oggetti  | `public/story/tracks.json`                     | `blender -b ../3d/blender/materia-story.blend --python ../3d/scripts/track_story.py`                          |

Il componente `src/components/story/Story.astro` legge in fase di build l'elenco dei file delle due cartelle: si possono cambiare numero e nomi dei fotogrammi senza toccare il codice, purché l'ordine alfabetico coincida con l'ordine temporale. Il primo fotogramma di ciascuna serie fa da poster. L’esportazione desktop comprende anche le 95 mezze pose (`f###h.webp`). Dopo un nuovo render, ricostruire il sito.

La serie mobile distribuita ha una correzione tonale per gli stacchi fra i lotti del render originale. Per riprodurla da quei 96 WebP grezzi, eseguire `node ../3d/scripts/match_story_light.mjs <cartella-originali> public/story/mobile`. Lo script legge i fotogrammi adiacenti ai cambi di luce e scrive in una cartella distinta. Per un nuovo montaggio occorre verificare di nuovo i punti di stacco.

## Il set della storia

`../3d/scripts/build_story.py` parte da `../3d/blender/materia-balance-master.blend` (che non modifica) e salva `../3d/blender/materia-story.blend` con:

- `09_STORY_SET`: tavolo di frassino (texture CC0 Poly Haven `ash_veneer`), parete a calce (`beige_wall_001`), pavimento, gambe del tavolo;
- `10_STORY_LIGHT`: luce morbida da una finestra a sinistra, sole basso che passa dalla stessa finestra (un pannello invisibile alla camera ne proietta i riquadri), rimbalzi tenui;
- l'animazione dei 12 nodi su 96 fotogrammi: dalla posa `HARMONY` (ingredienti sul tavolo) alla colonna `EXPLODED` fino a `BALANCED`, con tempi sfalsati dal basso verso l'alto;
- `CAMERA_STORY` con bersaglio animato e messa a fuoco sul bersaglio, e le camere `STILL_*` delle fotografie editoriali.

I marker della timeline indicano le fasi dell'animazione: MATERIA (1), ASCOLTO (14), ANALISI (40), COSTRUZIONE (62), EQUILIBRIO (96). Il fotogramma mostrato quando ciascun capitolo è al centro dello schermo è in `src/config/editorial.ts` (`chapters[].frame`, numeri di fotogramma Blender): Ascoltare 7, Analizzare 50, Costruire 77, Evolvere 96.

## Tracciamento per le didascalie

`../3d/scripts/track_story.py` proietta il riquadro di ciascun oggetto (pera, avocado, arancia, tre pietre, ulivo, fico, mandorle, piedistallo) su ogni fotogramma, con la stessa camera, lo stesso decentramento dell'obiettivo e lo stesso sensore verticale di `render_story.py`. Scrive `public/story/tracks.json`: per ogni serie e oggetto, un campione `[x, y, rx, ry]` per fotogramma, in frazioni dell'immagine (191 campioni desktop, 96 mobile). Va rieseguito ogni volta che cambiano animazione, camera o numero di fotogrammi; i test verificano che i campioni coincidano con la sequenza.

## Budget

| Risorsa                            | Obiettivo                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| Poster (primo fotogramma)          | < 150 KB, caricato subito con priorità alta                                            |
| Sequenza desktop                   | < 9 MB complessivi, scaricati dopo `load`, in una finestra attorno alla posa richiesta |
| Sequenza verticale                 | < 4 MB complessivi                                                                     |
| Movimento ridotto / risparmio dati | solo i 5 fotogrammi chiave                                                             |

## Modello glTF (asset)

Il modello resta in `../3d/exports/materia-balance.glb` (3,75 MB, 50.093 triangoli, 12 nodi sotto `BALANCE_ROOT`, nessuna estensione, validato con Khronos glTF-Validator). Coordinate, pivot, stati e inquadratura sono descritti in [WEB_EXPORT.md](../../3d/docs/WEB_EXPORT.md) e [SCENE_GUIDE.md](../../3d/docs/SCENE_GUIDE.md). Non è più servito dal sito: per una futura modalità interattiva va copiato in `public/models/`.
