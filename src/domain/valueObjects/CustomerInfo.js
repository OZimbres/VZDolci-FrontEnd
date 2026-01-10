/**
 * CustomerInfo Value Object
 * Encapsulates customer data with validations
 * @immutable
 */
export class CustomerInfo {
  constructor({ name, email, phone, cpf }) {
    if (!name || !name.trim()) {
      throw new Error('Nome do cliente é obrigatório');
    }

    if (!cpf || !CustomerInfo.isValidCPF(cpf)) {
      throw new Error('CPF inválido');
    }

    if (!email || !CustomerInfo.isValidEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!phone || !CustomerInfo.isValidPhone(phone)) {
      throw new Error('Telefone inválido');
    }

    this.name = name.trim();
    this.email = email.trim().toLowerCase();
    this.phone = CustomerInfo.normalizePhone(phone);
    this.cpf = CustomerInfo.normalizeCPF(cpf);

    Object.freeze(this);
  }

  static normalizeCPF(value) {
    return value.replace(/\D/g, '');
  }

  static normalizePhone(value) {
    return value.replace(/\D/g, '');
  }

  static isValidEmail(value) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/u.test(value);
  }

  static isValidPhone(value) {
    const digits = CustomerInfo.normalizePhone(value);
    return digits.length === 10 || digits.length === 11;
  }

  static isValidCPF(value) {
    const cpf = CustomerInfo.normalizeCPF(value);
    // cpf is normalized to digits-only above, so this regex correctly rejects CPFs with all identical digits
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    const calcDigit = (factor) => {
      let total = 0;
      for (let i = 0; i < factor - 1; i += 1) {
        total += Number(cpf[i]) * (factor - i);
      }
      const remainder = (total * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };

    const digit1 = calcDigit(10);
    if (digit1 !== Number(cpf[9])) {
      return false;
    }

    const digit2 = calcDigit(11);
    return digit2 === Number(cpf[10]);
  }
}
