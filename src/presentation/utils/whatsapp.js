export const buildWhatsAppUrl = (message) => {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (!whatsapp) return null;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
};

export const openWhatsAppWithMessage = (message) => {
  const url = buildWhatsAppUrl(message);
  if (!url) return null;
  window.open(url, '_blank');
  return url;
};
