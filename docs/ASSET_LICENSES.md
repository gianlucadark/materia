# Licenze degli asset — Materia · The Art of Balance

Tutto ciò che entra nel GLB e nei file Blender è originale oppure CC0. Non sono stati usati asset di provenienza o licenza sconosciuta. Gli asset già presenti sul computer (cartella `Materiali 3D`, HDRI personali) sono stati esclusi perché privi di licenza documentata.

## Geometria

| Elemento                                                | Origine                                                                              | Licenza                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------- |
| Tutte le 12 mesh (piedistallo, pietre, alimenti, ulivo) | Modellazione procedurale originale, `../3d/scripts/materia_lib/assets.py` e `geo.py` | Opera originale del progetto |
| Fondale studio (`STUDIO_CYC`), luci, camere             | Generati da `../3d/scripts/build_scene.py` (solo master, non esportati)              | Opera originale del progetto |

## Texture

| File                                                                                                 | Origine                                                                                                     | Licenza                                        | Uso                                                                          |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `../3d/textures/source/ambientcg_Travertine009/*` (Color, NormalGL, Roughness, Displacement, 2K JPG) | [ambientCG — Travertine 009](https://ambientcg.com/view?id=Travertine009), scaricato il 24/11/2026          | [CC0 1.0](https://docs.ambientcg.com/license/) | Materiale master del piedistallo, poi cotto nelle texture web del `PEDESTAL` |
| `../3d/textures/generated/orange_cut_*.png`                                                          | Generate da `../3d/scripts/materia_lib/tex.py` (numpy): spicchi, membrane, vescicole, albedo, flavedo, seme | Opera originale                                | Sezione dell'arancia (master)                                                |
| `../3d/textures/baked/*.png`                                                                         | Bake Cycles dei materiali master (`../3d/scripts/export_scene.py`)                                          | Derivate dalle due righe precedenti            | Materiali web / GLB                                                          |
| Tutti gli altri materiali                                                                            | Shader procedurali originali (`../3d/scripts/materia_lib/mat.py`)                                           | Opera originale                                | Master                                                                       |
| `../3d/textures/source/polyhaven_ash_veneer/*` (diff, nor_gl, rough, 2K JPG)                         | [Poly Haven — Ash Veneer](https://polyhaven.com/a/ash_veneer), scaricato il 24/11/2026                      | [CC0](https://polyhaven.com/license)           | Tavolo di frassino del set della storia                                      |
| `../3d/textures/source/polyhaven_beige_wall_001/*` (diff, nor_gl, rough, 2K JPG)                     | [Poly Haven — Beige Wall 001](https://polyhaven.com/a/beige_wall_001), scaricato il 24/11/2026              | [CC0](https://polyhaven.com/license)           | Parete a calce del set della storia                                          |

Nota CC0: ambientCG e Poly Haven non richiedono attribuzione e consentono l'uso commerciale. L'attribuzione è riportata qui per tracciabilità.

## Immagini del sito

I fotogrammi in `public/story/` e le fotografie `public/images/story-*.webp` sono render originali del set `../3d/blender/materia-story.blend` (geometria e materiali descritti sopra). Le quattro fotografie generate con un modello di immagine usate nella prima versione della demo sono state rimosse.

## Reference visive (non incluse nei deliverable 3D)

Conservate in `../3d/references/` solo come guida per forma, colore e materiali.

| File                                                                    | Fonte                                                                               | Licenza |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------- |
| `../3d/references/polyhaven_cc0/food_avocado_01.png`                    | [Poly Haven · Food Avocado 01](https://polyhaven.com/a/food_avocado_01)             | CC0     |
| `../3d/references/polyhaven_cc0/food_pears_asian_01.png`                | [Poly Haven · Food Pears Asian 01](https://polyhaven.com/a/food_pears_asian_01)     | CC0     |
| `../3d/references/polyhaven_cc0/food_lime_01.png`                       | [Poly Haven · Food Lime 01](https://polyhaven.com/a/food_lime_01)                   | CC0     |
| `../3d/references/polyhaven_cc0/food_pomegranate_01.png`                | [Poly Haven · Food Pomegranate 01](https://polyhaven.com/a/food_pomegranate_01)     | CC0     |
| `../3d/references/polyhaven_cc0/lemon.png`                              | [Poly Haven · Lemon](https://polyhaven.com/a/lemon)                                 | CC0     |
| `../3d/references/polyhaven_cc0/stone_01.png`                           | [Poly Haven · Stone 01](https://polyhaven.com/a/stone_01)                           | CC0     |
| `../3d/references/polyhaven_cc0/namaqualand_stones_01.png`              | [Poly Haven · Namaqualand Stones 01](https://polyhaven.com/a/namaqualand_stones_01) | CC0     |
| `../3d/references/polyhaven_cc0/rock_07.png`                            | [Poly Haven · Rock 07](https://polyhaven.com/a/rock_07)                             | CC0     |
| `../3d/references/ambientcg_cc0/Travertine009.png`, `Travertine001.png` | Anteprime ambientCG                                                                 | CC0     |

Le render Poly Haven sono le immagini di anteprima ufficiali degli asset (licenza CC0 come gli asset stessi, vedi [polyhaven.com/license](https://polyhaven.com/license)). La ricerca di fotografie CC0 su Wikimedia Commons è stata interrotta dal rate limit dell'API; nessuna immagine Commons è stata scaricata.

## Strumenti

Blender 5.0.1 (GPL) e i suoi componenti sono strumenti di produzione: la licenza GPL non si estende ai file `.blend`, alle texture o al GLB prodotti. Il Khronos glTF-Validator (Apache-2.0) e Three.js (MIT) sono stati usati solo per la verifica.
