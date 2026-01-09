/**
 * ShippingInfo Value Object
 * Encapsulates shipping/delivery data
 * * @immutable
 */
export class ShippingInfo {
  constructor({
    street,
    number,
    district,
    city,
    state,
    postalCode,
    deliveryDate,
    complement = '',
    deliveryInstructions = ''
  }) {
    if (!street || !street.trim()) {
      throw new Error('Endereço é obrigatório');
    }

    if (!number) {
      throw new Error('Número do endereço é obrigatório');
    }

    if (!district || !district.trim()) {
      throw new Error('Bairro é obrigatório');
    }

    if (!city || !city.trim()) {
      throw new Error('Cidade é obrigatória');
    }

    if (!state || !state.trim()) {
      throw new Error('Estado é obrigatório');
    }

    if (!postalCode || !ShippingInfo.isValidPostalCode(postalCode)) {
      throw new Error('CEP inválido');
    }

    if (!deliveryDate) {
      throw new Error('Data de entrega é obrigatória');
    }

    const parsedDeliveryDate = ShippingInfo.parseDate(deliveryDate);
    if (!ShippingInfo.hasMinimumLeadTime(parsedDeliveryDate)) {
      throw new Error('A entrega precisa de no mínimo 24h de antecedência');
    }

    this.street = street.trim();
    this.number = number.toString().trim();
    this.district = district.trim();
    this.city = city.trim();
    this.state = state.trim().toUpperCase();
    this.postalCode = ShippingInfo.normalizePostalCode(postalCode);
    this.deliveryDate = parsedDeliveryDate;
    this.complement = complement?.trim() ?? '';
    this.deliveryInstructions = deliveryInstructions?.trim() ?? '';

    Object.freeze(this);
  }

  static normalizePostalCode(value) {
    return value.replace(/\D/g, '');
  }

  static isValidPostalCode(value) {
    const normalized = ShippingInfo.normalizePostalCode(value);
    return /^\d{8}$/.test(normalized);
  }

  static parseDate(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Data de entrega inválida');
    }
    return date;
  }

  static hasMinimumLeadTime(date) {
    const diffMs = date.getTime() - Date.now();
    const minMs = 24 * 60 * 60 * 1000;
    return diffMs >= minMs;
  }
}
