# Lavorare su Materia

La pagina si compone in `src/pages/index.astro` e si distribuisce da `dist/`. Mantenere i contenuti leggibili direttamente nell’HTML. Usare Node 24 LTS e il lockfile npm del progetto. Il set Blender e i suoi script sono nella cartella sorella `../3d`, fuori dal repository.

## Modifiche frequenti

- Per un nuovo cliente, aggiornare prima i moduli di `src/config/`. I testi destinati al pubblico commerciale appartengono a quei moduli. Le etichette tecniche di interfaccia appartengono ai componenti.
- Inserire i materiali sostitutivi in `public/images`, aggiornare alt e dimensioni e mantenere il poster accessibile. Le licenze dei font distribuiti sono in `public/fonts`.
- Conservare la modalità demo finché i servizi e i canali reali non sono configurati. Usare `appointmentLinks` per risolvere i link.
- Per modifiche alla scena, leggere [il contratto Blender](docs/3D_INTEGRATION.md). Gli offset sono relativi alla posa acquisita dal GLB e si applicano alla stessa istanza.
- Per modifiche all’impaginazione, verificare almeno una finestra desktop e una mobile, gli ancoraggi, i controlli da tastiera e il comportamento con movimento ridotto.

## Verifica locale

Eseguire `npm run check`, `npm run lint`, `npm test` e `npm run build`. Formattare con Prettier. Se cambia il modello, controllare anche l’inquadratura e il rilascio del renderer cambiando larghezza o preferenza di movimento.
