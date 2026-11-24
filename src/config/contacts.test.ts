import { describe, expect, it } from 'vitest';
import { appointmentLinks } from './contacts';
describe('prenotazione', () => {
  it('sopprime ogni canale in demo anche se configurato', () => {
    expect(
      appointmentLinks({
        mode: 'demo',
        channels: { booking: 'https://example.org' },
      }),
    ).toEqual([]);
  });
  it('espone solo canali live validi per il tipo configurato', () => {
    const links = appointmentLinks({
      mode: 'live',
      channels: {
        calendar: 'https://example.org/visita',
        email: 'mailto:studio@example.org',
        booking: 'javascript:void(0)',
        whatsapp: 'indirizzo non valido',
      },
    });
    expect(links.map((l) => l.href)).toEqual([
      'https://example.org/visita',
      'mailto:studio@example.org',
    ]);
  });
});
