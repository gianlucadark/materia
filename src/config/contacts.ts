import type { Contacts, ContactChannel } from '../types/content';
export const contacts: Contacts = { mode: 'demo', channels: {} };
export const channelLabels: Record<ContactChannel, string> = {
  booking: 'Apri la prenotazione',
  calendar: 'Consulta il calendario',
  whatsapp: 'Contatta su WhatsApp',
  email: 'Scrivi allo studio',
};
export function appointmentLinks(settings: Contacts) {
  if (settings.mode === 'demo') return [];
  return (Object.keys(channelLabels) as ContactChannel[]).flatMap((key) => {
    const value = settings.channels[key];
    if (!value) return [];
    try {
      const url = new URL(value);
      if (url.protocol !== (key === 'email' ? 'mailto:' : 'https:')) return [];
      return [{ label: channelLabels[key], href: url.href }];
    } catch {
      return [];
    }
  });
}
