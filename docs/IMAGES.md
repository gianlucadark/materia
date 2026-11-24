# Immagini

Tutte le immagini del sito sono render dello stesso set Blender: un tavolo di frassino sotto una finestra, una parete a calce e la scultura di Materia. Nessuna fotografia generata con modelli di immagine. Scena, luci e camere sono in `../3d/blender/materia-story.blend`, costruito da `../3d/scripts/build_story.py`; le immagini si rigenerano con `../3d/scripts/render_story.py`.

## Sequenza della storia

| Cartella               | Contenuto                                            | Formato                     |
| ---------------------- | ---------------------------------------------------- | --------------------------- |
| `public/story/desktop` | 96 fotogrammi, dalla natura morta alla scultura      | 1600 × 900 WebP, qualità 76 |
| `public/story/mobile`  | 49 fotogrammi (uno ogni due), inquadratura verticale | 750 × 1000 WebP, qualità 74 |

Il primo fotogramma fa da poster: si carica subito, regge la pagina senza JavaScript e resta l'immagine con il movimento ridotto finché non si scorre a un nuovo capitolo.

## Fotografie editoriali

| Sorgente       | File in `public/images/`              | Uso                                         |
| -------------- | ------------------------------------- | ------------------------------------------- |
| `STILL_TABLE`  | `story-table-640/800/1280/1600.webp`  | Chi sono (sostituire con un ritratto reale) |
| `STILL_DETAIL` | `story-detail-640/800/1280/1600.webp` | Domande                                     |
| `STILL_STUDIO` | `story-studio-640/800/1280/1600.webp` | Finale e prenotazione                       |
| `STILL_FINAL`  | `story-final-640/800/1280/1600.webp`  | Immagine social (`og:image`)                |

Le versioni originali in PNG si generano in `../3d/renders/stills/` (escluso da git). Rapporto 3:2, 1600 × 1067.

## Per uno studio reale

La foto dell'approccio è un segnaposto: va sostituita con un ritratto autorizzato della professionista, aggiornando `src/config/professional.ts` (percorso, testo alternativo, dimensioni). Le altre immagini possono restare: raccontano il metodo, non un luogo reale.
