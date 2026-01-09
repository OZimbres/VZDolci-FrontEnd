import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomerInfo } from '../../../../domain/valueObjects/CustomerInfo';
import './CustomerForm.css';

const EMPTY_CUSTOMER = {
  name: '',
  email: '',
  phone: '',
  cpf: ''
};

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

const formatCPF = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const validateCustomer = (payload) => {
  const errors = {};
  const name = payload.name?.trim() ?? '';
  const email = payload.email?.trim() ?? '';
  const phone = payload.phone?.trim() ?? '';
  const cpf = payload.cpf?.trim() ?? '';

  if (!name) errors.name = 'Nome do cliente é obrigatório';
  if (!email || !CustomerInfo.isValidEmail(email)) errors.email = 'Email inválido';
  if (!phone || !CustomerInfo.isValidPhone(phone)) errors.phone = 'Telefone inválido';
  if (!cpf || !CustomerInfo.isValidCPF(cpf)) errors.cpf = 'CPF inválido';

  if (Object.keys(errors).length === 0) {
    try {
      new CustomerInfo(payload);
    } catch (error) {
      return { general: error.message };
    }
  }

  return errors;
};

/**
 * Customer Form Component
 */
export function CustomerForm({ value = EMPTY_CUSTOMER, onChange, onValidityChange }) {
  const [errors, setErrors] = useState({});
  const data = useMemo(() => ({ ...EMPTY_CUSTOMER, ...value }), [value]);
  const lastValidityRef = useRef(null);

  useEffect(() => {
    setErrors(validateCustomer(data));
  }, [data]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  useEffect(() => {
    if (lastValidityRef.current !== isValid) {
      lastValidityRef.current = isValid;
      onValidityChange?.(isValid);
    }
  }, [errors, onValidityChange, isValid]);

  const handleChange = (field, formatter) => (event) => {
    const formattedValue = formatter ? formatter(event.target.value) : event.target.value;
    const nextData = { ...data, [field]: formattedValue };
    onChange?.(nextData);
  };

  return (
    <div className="checkout-form-card" aria-label="Dados do cliente">
      <h3>Dados do Cliente</h3>
      <p className="form-helper">Preencha todas as informações para avançar para o pagamento.</p>
      <div className="form-grid">
        <label htmlFor="customer-name">
          Nome completo
          <input
            id="customer-name"
            name="name"
            type="text"
            value={data.name}
            onChange={handleChange('name')}
            placeholder="Digite seu nome completo"
            autoComplete="name"
            required
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label htmlFor="customer-email">
          Email
          <input
            id="customer-email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange('email')}
            placeholder="seuemail@dominio.com"
            autoComplete="email"
            required
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label htmlFor="customer-phone">
          Telefone
          <input
            id="customer-phone"
            name="phone"
            type="tel"
            value={data.phone}
            onChange={handleChange('phone', formatPhone)}
            placeholder="(11) 91234-5678"
            autoComplete="tel"
            required
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>

        <label htmlFor="customer-cpf">
          CPF
          <input
            id="customer-cpf"
            name="cpf"
            type="text"
            value={data.cpf}
            onChange={handleChange('cpf', formatCPF)}
            placeholder="000.000.000-00"
            inputMode="numeric"
            autoComplete="off"
            required
          />
          {errors.cpf && <span className="field-error">{errors.cpf}</span>}
        </label>
      </div>
      {errors.general && <span className="field-error">{errors.general}</span>}
    </div>
  );
}

CustomerForm.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    cpf: PropTypes.string
  }),
  onChange: PropTypes.func,
  onValidityChange: PropTypes.func
};
