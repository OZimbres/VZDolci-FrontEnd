export const buildWhatsAppUrl = (message) => {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
};

export const openWhatsAppWithMessage = (message) => {
  const url = buildWhatsAppUrl(message);
  window.open(url, '_blank');
  return url;
};
