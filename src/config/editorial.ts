import type {
  Annotation,
  EditorialImage,
  StoryChapter,
} from '../types/content';

const still = (base: string, alt: string): EditorialImage => ({
  base: `/images/${base}`,
  alt,
  width: 1600,
  height: 1067,
});

export const editorial = {
  story: {
    title: 'Niente diete',
    titleEnd: 'da lunedì.',
    lead: 'Cominciamo da com’è andata ieri. È già tutto qui, sul tavolo.',
    cue: 'Guardiamolo insieme',
    methodLabel: 'Il mio metodo',
    poster:
      'Sul tavolo di frassino, nella luce della finestra: una pera su un piedistallo di travertino, mezzo avocado, mezza arancia, tre pietre levigate, un ramo d’ulivo, un fico e tre mandorle.',
    /**
     * The objects on the table stand for a week of the reader's life. Each caption follows its
     * object while it rises; the order of `from` is the order of a day. Once the tower is built
     * (frame 65) the problems lose their qualifiers and become ingredients; in the last frames
     * the two things left on the table change meaning.
     */
    annotations: [
      { object: 'pear', text: 'la colazione che salti', from: 2, to: 64 },
      { object: 'pear', text: 'la colazione', from: 65, to: 88 },
      {
        object: 'avocado',
        text: 'il pranzo davanti allo schermo',
        from: 3,
        to: 64,
      },
      { object: 'avocado', text: 'il pranzo, seduti', from: 65, to: 88 },
      { object: 'almonds', text: 'la fame delle cinque', from: 4, to: 60 },
      { object: 'almonds', text: 'la merenda delle cinque', from: 87, to: 96 },
      { object: 'olive', text: 'le cene fuori con gli amici', from: 5, to: 64 },
      { object: 'olive', text: 'le cene con gli amici', from: 65, to: 88 },
      { object: 'fig', text: 'lo sfizio a cui non rinunci', from: 5, to: 60 },
      { object: 'fig', text: 'lo sfizio, al suo posto', from: 87, to: 96 },
      { object: 'stoneBase', text: 'il lavoro', from: 6, to: 88 },
      { object: 'stoneMiddle', text: 'le ore di sonno', from: 6, to: 64 },
      { object: 'stoneMiddle', text: 'il sonno', from: 65, to: 88 },
      { object: 'stoneTop', text: 'la camminata che rimandi', from: 7, to: 64 },
      { object: 'stoneTop', text: 'la camminata', from: 65, to: 88 },
      { object: 'orange', text: 'la spremuta della domenica', from: 7, to: 88 },
    ] satisfies Annotation[],
    // The four steps of the method are the four chapters of the sequence.
    chapters: [
      {
        step: 'Ascoltare',
        title: 'Prima, ascolto.',
        text: 'Mi racconti una giornata qualunque, così com’è. Su questo tavolo non c’è niente da nascondere e niente da giudicare.',
        frame: 7,
        align: 'left',
        captions: 'free',
      },
      {
        step: 'Analizzare',
        title: 'Poi guardiamo ogni cosa da vicino.',
        text: 'Una alla volta: esami, orari, gusti, abitudini. Alcune pesano più di quanto pensi, altre molto meno.',
        frame: 50,
        align: 'right',
        captions: 'column',
      },
      {
        step: 'Costruire',
        title: 'Ogni cosa trova il suo posto.',
        text: 'Il lavoro resta alla base, il sonno torna al centro, la colazione in cima. Il piano si costruisce sulla tua settimana vera, non su una settimana ideale.',
        frame: 77,
        align: 'left',
        captions: 'column',
      },
      {
        step: 'Evolvere',
        title: 'Qualcosa resta fuori. Va bene così.',
        text: 'Lo sfizio resta, al suo posto. La fame delle cinque diventa una merenda. Ci rivediamo, guardiamo che cosa regge, e quando la vita cambia, cambia anche il piano.',
        frame: 96,
        align: 'right',
        captions: 'free',
      },
    ] satisfies StoryChapter[],
    action: 'Prenota il primo incontro',
  },
  about: {
    label: 'Chi sono',
  },
  menu: {
    label: 'Di che cosa mi occupo',
    title: 'Il menù dello studio',
    intro:
      'Si può scegliere alla carta, oppure farsi accompagnare da un percorso.',
    cartaLabel: 'Alla carta',
    pathsLabel: 'Percorsi',
    note: 'Percorsi dimostrativi: durata e cadenza si decidono insieme.',
    pathAction: 'Comincia da qui',
  },
  questions: {
    label: 'Prima di sederci',
    title: 'Quello che mi chiedete al telefono.',
    image: still(
      'story-detail',
      'Mezzo avocado con il nocciolo, da vicino, sul legno chiaro del tavolo.',
    ),
  },
  booking: {
    label: 'Il primo incontro',
    title: 'Cominciamo da ieri.',
    text: 'Nel primo incontro mi racconti com’è andata a tavola, senza preparare niente. Da lì decidiamo insieme da dove partire.',
    action: 'Prenota la prima visita',
    demoTitle: 'La tua prima visita',
    demoText:
      'Questa è un’anteprima dimostrativa. Le prenotazioni saranno disponibili quando lo studio attiverà il servizio. Nessun dato viene raccolto o inviato.',
    liveEmpty: 'I canali di contatto saranno disponibili qui appena attivati.',
    caption: 'Lo studio Materia, a fine mattina.',
    image: still(
      'story-studio',
      'Un tavolo di frassino davanti a una parete a calce; da sinistra la luce della finestra, al centro la scultura di frutta e pietre in equilibrio.',
    ),
  },
};
