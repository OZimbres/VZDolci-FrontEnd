/**
 * ShippingInfo Value Object
 * Encapsulates shipping/delivery data
 * @immutable
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
      throw new Error('Entrega indisponível para a data informada (mínimo 24h de antecedência, ao menos 1 dia útil e sem finais de semana)');
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
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const minMs = 24 * 60 * 60 * 1000;

    if (diffMs < minMs) {
      return false;
    }

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }

    // Garante ao menos 1 dia útil entre hoje e a data de entrega
    let businessDays = 0;
    const cursor = new Date(now);
    while (cursor < date) {
      cursor.setDate(cursor.getDate() + 1);
      const dow = cursor.getDay();
      if (dow !== 0 && dow !== 6) {
        businessDays += 1;
      }
    }

    return businessDays >= 1;
  }
}
