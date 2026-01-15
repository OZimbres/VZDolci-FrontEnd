import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import './CustomerForm.css';

/**
 * CustomerForm Component
 * Formulário de dados do cliente com validação inteligente
 * 
 * Regras de validação:
 * - Nome:  OBRIGATÓRIO (mínimo 3 caracteres)
 * - Email: OPCIONAL (mas se preenchido, deve ser válido)
 * - Telefone: OPCIONAL (mas se preenchido, deve ter ≥10 dígitos)
 * - CPF: TOTALMENTE OPCIONAL (mas se preenchido, deve ter 11 dígitos)
 * - REGRA PRINCIPAL: Nome + (Email OU Telefone válido)
 */
export function CustomerForm({ value, onChange, onValidityChange }) {
  const onValidityChangeRef = useRef(onValidityChange);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    cpf: false
  });

  const [validation, setValidation] = useState({
    isNameValid: false,
    isEmailValid: true,
    isPhoneValid: true,
    isCpfValid: true,
    hasEmail: false,
    hasPhone: false,
    hasAtLeastOneContact: false
  });

  useEffect(() => {
    onValidityChangeRef.current = onValidityChange;
  }, [onValidityChange]);

  // Validação em tempo real
  useEffect(() => {
    // Nome: obrigatório, mínimo 3 caracteres
    const nameValue = value.name?.trim() || '';
    const isNameValid = nameValue.length >= 3;

    // Email: opcional, mas se preenchido deve ser válido
    const emailValue = value.email?.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailValue.length === 0 || emailRegex.test(emailValue);
    const hasEmail = emailValue.length > 0 && emailRegex.test(emailValue);

    // Telefone: opcional, mas se preenchido deve ter ≥10 dígitos
    const phoneDigits = value.phone?.replace(/\D/g, '') || '';
    const isPhoneValid = phoneDigits.length === 0 || phoneDigits.length >= 10;
    const hasPhone = phoneDigits.length >= 10;

    // CPF: totalmente opcional, mas se preenchido deve ter 11 dígitos
    const cpfDigits = value.cpf?.replace(/\D/g, '') || '';
    const isCpfValid = cpfDigits.length === 0 || cpfDigits.length === 11;

    // Deve ter ao menos um contato válido (email OU telefone)
    const hasAtLeastOneContact = hasEmail || hasPhone;

    // Validação final
    const isValid = isNameValid &&
                    hasAtLeastOneContact &&
                    isEmailValid &&
                    isPhoneValid &&
                    isCpfValid;

    setValidation({
      isNameValid,
      isEmailValid,
      isPhoneValid,
      isCpfValid,
      hasEmail,
      hasPhone,
      hasAtLeastOneContact
    });

    onValidityChangeRef.current?.(isValid);
  }, [value]);

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const formatCpf = (cpf) => {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const handleCpfChange = (e) => {
    const formatted = formatCpf(e.target.value);
    onChange({ ...value, cpf: formatted });
  };

  return (
    <div className="customer-form">
      <h3>Dados do Cliente</h3>
      <p className="form-instructions">
        Preencha seu nome e ao menos <strong>um contato</strong> (email ou telefone)
      </p>

      {/* Nome Completo - OBRIGATÓRIO */}
      <div className="form-field">
        <label htmlFor="customer-name">
          Nome completo <span className="required">*</span>
        </label>
        <input
          type="text"
          id="customer-name"
          name="name"
          placeholder="Digite seu nome completo"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          onBlur={() => handleBlur('name')}
          required
          aria-required="true"
          aria-invalid={touched.name && !validation.isNameValid}
          autoComplete="name"
        />
        {touched.name && !validation.isNameValid && value.name && (
          <span className="field-error" role="alert">
            Nome deve ter ao menos 3 caracteres
          </span>
        )}
      </div>

      {/* Email - OPCIONAL */}
      <div className="form-field">
        <label htmlFor="customer-email">
          Email <span className="optional">(opcional)</span>
        </label>
        <input
          type="email"
          id="customer-email"
          name="email"
          placeholder="seuemail@dominio.com"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          onBlur={() => handleBlur('email')}
          aria-required="false"
          aria-invalid={touched.email && !validation.isEmailValid}
          autoComplete="email"
        />
        {touched.email && !validation.isEmailValid && value.email && (
          <span className="field-error" role="alert">
            Email inválido
          </span>
        )}
      </div>

      {/* Telefone - OPCIONAL */}
      <div className="form-field">
        <label htmlFor="customer-phone">
          Telefone <span className="optional">(opcional)</span>
        </label>
        <PhoneInput
          defaultCountry="br"
          placeholder="(11) 91234-5678"
          value={value.phone}
          onChange={(phone) => onChange({ ...value, phone })}
          onBlur={() => handleBlur('phone')}
          inputProps={{
            id: 'customer-phone',
            name: 'phone',
            'aria-required': 'false',
            'aria-invalid': touched.phone && !validation.isPhoneValid,
            autoComplete: 'tel'
          }}
        />
        {touched.phone && !validation.isPhoneValid && value.phone && (
          <span className="field-error" role="alert">
            Telefone deve ter ao menos 10 dígitos
          </span>
        )}
      </div>

      {/* Aviso: precisa de ao menos um contato */}
      {touched.email && touched.phone && !validation.hasAtLeastOneContact && (value.email || value.phone) && (
        <div className="warning-message" role="alert">
          ⚠️ Preencha ao menos um contato válido (email ou telefone) para continuar
        </div>
      )}

      {/* CPF - TOTALMENTE OPCIONAL */}
      <div className="form-field">
        <label htmlFor="customer-cpf">
          CPF <span className="optional">(opcional - para nota fiscal)</span>
        </label>
        <input
          type="text"
          id="customer-cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={value.cpf}
          onChange={handleCpfChange}
          onBlur={() => handleBlur('cpf')}
          maxLength="14"
          aria-required="false"
          aria-invalid={touched.cpf && !validation.isCpfValid}
          autoComplete="off"
        />
        {touched.cpf && !validation.isCpfValid && value.cpf && (
          <span className="field-error" role="alert">
            CPF deve ter 11 dígitos
          </span>
        )}
        <small className="field-hint">
          O CPF é opcional. Informe apenas se precisar de nota fiscal.
        </small>
      </div>
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

CustomerForm.defaultProps = {
  value: { name: '', email: '', phone: '', cpf: '' },
  onChange: () => {},
  onValidityChange: () => {}
};
