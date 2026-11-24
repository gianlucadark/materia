import type { SectionLink } from '../types/content';
export const branding = {
  name: 'Materia',
  concept: 'The Art of Balance',
  discipline: 'Studio di nutrizione',
  nav: [
    { label: 'Chi sono', href: '#chi-sono' },
    { label: 'Il menù', href: '#menu' },
    { label: 'Domande', href: '#domande' },
  ] satisfies SectionLink[],
  bookingLabel: 'Prenota',
  footerNote:
    'Materia è uno studio dimostrativo. Livia Serra è un’identità di esempio.',
};
