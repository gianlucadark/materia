import type { Professional } from '../types/content';

// Demo identity: Livia Serra is a fictional nutritionist. Replace name, biography,
// qualifications (with the real registration details) and photo for each client.
export const professional: Professional = {
  name: 'Livia Serra',
  firstName: 'Livia',
  role: 'Biologa nutrizionista',
  title: 'Il pane si divideva con le mani.',
  story: [
    'Sono cresciuta in una cucina dove si cucinava per molte persone e nessuno pesava niente. Le verdure arrivavano dall’orto di un vicino, il pane si divideva con le mani, la domenica durava fino a sera. Solo più tardi ho capito quanta scienza ci fosse in quell’equilibrio, e quanto fosse fragile.',
    'Ho studiato biologia e poi scienze della nutrizione umana per capire perché quella tavola funzionava, e che cosa succede quando smette di farlo. Per anni ho lavorato in ambulatorio, tra esami, piani e controlli: lì ho imparato che i numeri contano, ma da soli non bastano.',
    'Così ho aperto Materia: uno studio piccolo, con un tavolo al posto della scrivania. Ci si siede uno di fronte all’altra, si parla, si guardano insieme le abitudini come si guardano gli ingredienti, uno per uno. Da lì cominciamo a scrivere il piano.',
  ],
  quote:
    'Quando scriviamo un piano, penso a chi dovrà metterlo in tavola il martedì sera.',
  closing: 'A presto, a tavola.',
  qualifications: [
    'Laurea magistrale in Scienze della nutrizione umana',
    'Nutrizione clinica, educazione alimentare e prevenzione',
    'In studio a Materia e online',
  ],
  // Demo image: a still from the studio set. Replace with an authorised portrait.
  photo: {
    base: '/images/story-table',
    alt: 'Il tavolo di Livia prima di una visita: mezzo avocado, mezza arancia e un ramo d’ulivo sul legno di frassino, nella luce del mattino.',
    width: 1600,
    height: 1067,
  },
  photoCaption: 'Il tavolo dello studio, prima di una visita.',
  demoNote: 'Identità dimostrativa',
};
