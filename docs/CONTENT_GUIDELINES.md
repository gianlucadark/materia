# Contenuti e personalizzazione

## La voce: una professionista che si racconta

Il sito è pensato per essere proposto al singolo nutrizionista. Per questo parla in prima persona: la storia allo scroll è il suo modo di lavorare (ascoltare, analizzare, costruire, evolvere), la sezione "Chi sono" è una sua lettera, le domande e la prenotazione rispondono con la sua voce. Materia è il nome dello studio; la persona è chi lo abita.

Le didascalie della storia parlano invece del lettore, in seconda persona implicita e senza giudizio ("la colazione che salti", "lo sfizio a cui non rinunci"). Devono restare brevi (al massimo cinque parole), concrete e quotidiane. Le domande sono scritte con le parole di chi chiama lo studio, le risposte con quelle della professionista.

## Identità dimostrativa

**Livia Serra, biologa nutrizionista, è un personaggio fittizio.** Nome, biografia, citazione e ambiti sono scritti per la demo e vanno sostituiti per ogni cliente. Il sito lo dichiara in modo discreto accanto alla firma (`professional.demoNote`) e nel piè di pagina (`branding.footerNote`).

Nella demo non ci sono numeri di iscrizione all'albo, anni di esperienza, casi clinici, risultati o testimonianze: sono dati che solo il professionista reale può fornire e verificare. I due percorsi, La settimana a tavola e Il tempo di un pasto, sono esempi editoriali. Restano aperte le condizioni che dipendono da chi riceve: durata, strumenti, prezzi, cadenza dei controlli.

## Dove si cambia

| Cosa                                           | File                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| Nome, ruolo, biografia, citazione, formazione  | `src/config/professional.ts`                      |
| Testi della storia (capitoli in prima persona) | `src/config/editorial.ts`                         |
| Didascalie degli oggetti e loro fotogrammi     | `src/config/editorial.ts` (`story.annotations`)   |
| Servizi, percorsi, domande                     | `src/config/services.ts`, `pathways.ts`, `faq.ts` |
| Titolo e descrizione per motori di ricerca     | `src/config/seo.ts`                               |
| Nota dimostrativa e navigazione                | `src/config/branding.ts`                          |

## Passaggio a un cliente

1. Sostituire in `professional.ts` nome, ruolo, biografia (tre paragrafi, il primo diventa il paragrafo d'apertura), citazione e formazione, con i titoli verificati e l'iscrizione all'albo. Togliere `demoNote`.
2. Sostituire la fotografia della sezione "Chi sono" (oggi un render del tavolo) con un ritratto autorizzato, aggiornando percorso, testo alternativo e didascalia.
3. Rileggere i capitoli e le didascalie della storia con la professionista: devono suonare come lei e come i suoi pazienti. Confermare servizi, percorsi e domande, con condizioni effettive.
4. Configurare contatto, prenotazione e calendario in `contacts.ts`. Testare le destinazioni. Scegliere `live` quando lo studio è pronto a ricevere richieste.
5. Aggiornare metadati, dominio, nota nel piè di pagina e indicizzazione. Verificare anteprima social e resa mobile della nuova identità.

I testi aggiornati e i file pubblici entrano nel sito con la build successiva.
