# Piano delle animazioni

| Tratto                  | Comportamento                                                                                                                                                                                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primo caricamento       | Titolo, testi e poster (primo fotogramma) sono già nell'HTML. Dopo `load` il player decodifica la posa corrente e i fotogrammi vicini, dando precedenza alla direzione dello scroll.                                                                                                    |
| Storia, movimento pieno | La sezione è alta cinque schermi. Lo scroll attraversa 191 fotogrammi desktop (96 pose più 95 mezze pose); l'ultimo decimo tiene ferma la scultura finita. Se un fotogramma non è ancora pronto si mantiene la posa visibile o si avanza verso la destinazione con una posa già pronta. |
| Capitoli                | Opening e quattro capitoli occupano uno schermo ciascuno e scorrono sopra l'immagine fissa. A destra e a sinistra si alternano per lasciare la scultura al centro.                                                                                                                      |
| Schermi verticali       | Con rapporto d'aspetto inferiore a 5:6 si usa la serie verticale (96 fotogrammi, 750 × 1000) e il testo sale sulla parete in alto.                                                                                                                                                      |
| Movimento ridotto       | Nessuno scorrimento continuo: quando un capitolo arriva al centro dello schermo l'immagine passa al suo fotogramma chiave, senza transizioni. Si scaricano solo i cinque fotogrammi chiave.                                                                                             |
| Risparmio dati          | Come il movimento ridotto.                                                                                                                                                                                                                                                              |
| Senza JavaScript        | Resta il poster fisso; tutti i testi sono leggibili.                                                                                                                                                                                                                                    |
| Sezioni successive      | Nessuna animazione. Servizi, percorsi e domande sono testo sempre visibile.                                                                                                                                                                                                             |

Il canvas ridisegna solo quando cambia il fotogramma richiesto (scroll e resize passano da `requestAnimationFrame`). I fotogrammi dei capitoli sono in `src/config/editorial.ts` (`chapters[].frame`), la logica pura in `src/lib/story/frames.ts` con i suoi test.

## Ancoraggio ai capitoli

Lo scroll non scorre la sequenza in modo lineare: quando un capitolo è al centro dello schermo si vede il suo fotogramma (Ascoltare 7, con gli oggetti ancora sul tavolo; Analizzare 50, la colonna sospesa; Costruire 77; Evolvere 96). Fra due capitoli il movimento accelera e rallenta (smoothstep), così l'immagine resta quasi ferma mentre si legge.

## Didascalie

- **Comparsa.** Le didascalie entrano una alla volta nei primi fotogrammi, nell'ordine di una giornata (`annotations[].from`), con una dissolvenza di 480 ms.
- **Inseguimento.** Ogni didascalia è agganciata al proprio oggetto, fotogramma per fotogramma, grazie a `public/story/tracks.json`. Il testo scivola verso la nuova posizione con uno smorzamento; il filo resta sempre sull'oggetto.
- **Colonna.** In Analizzare e Costruire (`captions: 'column'`) le didascalie si allineano in colonna dal lato opposto al testo, come la legenda di una tavola. Solo nella serie orizzontale.
- **Cambio di senso.** Nella torre le didascalie perdono il giudizio ("la colazione che salti" → "la colazione"); alla fine restano solo fico e mandorle, che diventano "lo sfizio, al suo posto" e "la merenda delle cinque".
- **Spazio.** Una didascalia non copre mai il testo dei capitoli, un'altra didascalia o un altro oggetto, nemmeno con il filo: se non trova posto aspetta un fotogramma successivo. Il piedistallo è l'unica superficie attraversabile, come ultima scelta. Su schermi bassi le didascalie non salgono sopra gli oggetti.
- **Testo dei capitoli.** Dove il browser supporta le timeline di scroll, il testo è pieno solo vicino alla posizione di lettura e si dissolve mentre attraversa la scena. Altrove resta pieno.
- **Movimento ridotto.** Nessuno scivolamento né dissolvenza: le didascalie compaiono già al loro posto sui cinque fotogrammi chiave.
- **Senza JavaScript.** Nessuna didascalia; il testo dei capitoli racconta comunque il significato degli oggetti.
