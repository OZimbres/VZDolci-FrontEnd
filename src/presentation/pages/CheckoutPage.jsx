import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../application/contexts/CartContext';
import { CreateOrderUseCase } from '../../domain/usecases/CreateOrderUseCase';
import { ProcessPaymentUseCase } from '../../domain/usecases/ProcessPaymentUseCase';
import { MercadoPagoGateway } from '../../infrastructure/gateways/MercadoPagoGateway';
import { CheckoutSteps } from '../components/features/Checkout/CheckoutSteps';
import { CustomerForm } from '../components/features/Checkout/CustomerForm';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { SEO } from '../components/common/SEO';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import './CheckoutPage.css';

// Environment variables
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';
const TWO_DAYS_MS = 48 * 60 * 60 * 1000;
const checkoutSeoProps = {
  title: 'Finalizar Pedido',
  description: 'Finalize seu pedido de doces artesanais premium da VZ Dolci.',
  canonical: 'https://vz-dolci.vercel.app/checkout',
  robots: 'noindex, follow'
};

/**
 * Monta um payload de entrega provisório respeitando tempo mínimo
 * e evitando finais de semana. Endereço definitivo é combinado após pagamento.
 * 
 * Note: This creates an Order with provisional/incomplete shipping information.
 * The ShippingInfo value object will accept these values, but they are placeholders.
 * Final address details should be collected and confirmed after payment.
 */
const buildShippingData = () => {
  const deliveryDate = new Date();
  deliveryDate.setTime(deliveryDate.getTime() + TWO_DAYS_MS);

  while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }

  return {
    street: 'Endereço a combinar',
    number: 'S/N',
    district: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01000000',
    deliveryDate,
    complement: '',
    deliveryInstructions: 'Confirmaremos endereço e entrega após o pagamento'
  };
};

/**
 * Checkout Page
 * Handles order finalization with WhatsApp or PIX payment options
 */
export function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPixForm, setShowPixForm] = useState(false);
  const [pixQrCode, setPixQrCode] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '', cpf: '' });
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [gatewayError, setGatewayError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [processPaymentUseCase, setProcessPaymentUseCase] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const pollingIntervalRef = useRef(null);
  const confirmationTimeoutRef = useRef(null);
  const latestPaymentInfoRef = useRef(null);
  const latestPixQrCodeRef = useRef(null);
  const isPollingRequestInFlightRef = useRef(false);
  const startPollingTimeoutRef = useRef(null);

  const createOrderUseCase = useMemo(() => new CreateOrderUseCase(), []);

  useEffect(() => {
    try {
      const gateway = new MercadoPagoGateway();
      setProcessPaymentUseCase(new ProcessPaymentUseCase(gateway));
      setGatewayError(null);
    } catch (error) {
      setGatewayError(error.message);
    }
  }, []);

  useEffect(() => {
    if ((paymentInfo || pixQrCode) && !gatewayError && !isProcessingPayment) {
      setCurrentStep(3);
    } else if (showPixForm || paymentMethod) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [paymentInfo, pixQrCode, showPixForm, paymentMethod, gatewayError, isProcessingPayment]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (startPollingTimeoutRef.current) {
      clearTimeout(startPollingTimeoutRef.current);
      startPollingTimeoutRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    isPollingRequestInFlightRef.current = false;
  }, []);

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (isProcessingPayment) return;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  }, [isProcessingPayment, updateQuantity]);

  const handleRemove = useCallback((productId) => {
    if (isProcessingPayment) return;
    removeFromCart(productId);
  }, [isProcessingPayment, removeFromCart]);

  const maskCpfForMessage = (cpf) => {
    const digits = cpf?.replace(/\D/g, '') ?? '';
    if (!digits) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.***`;
    return `${digits.slice(0, 3)}.***.${digits.slice(-3)}`;
  };

  const generateWhatsAppMessage = useCallback((resolvedOrderId) => {
    const shortOrderId = (resolvedOrderId ?? orderId ?? generateOrderId()).split('-')[0];
    let message = `*🍰 Pedido VZ Dolci #${shortOrderId}*%0A%0A`;
    let messageTotal = 0;
    
    cart.forEach(item => {
      const itemTotal = item.getTotal();
      messageTotal += itemTotal;
      message += `• ${item.product.name} x${item.quantity} - R$ ${itemTotal.toFixed(2)}%0A`;
    });
    
    message += `%0A*Total: R$ ${messageTotal.toFixed(2)}*`;

    message += `%0A%0A*Dados do Cliente:*`;
    if (customerData.name) message += `%0A*Nome:* ${customerData.name}`;
    if (customerData.email) message += `%0A*Email:* ${customerData.email}`;
    if (customerData.phone) message += `%0A*Telefone:* ${customerData.phone}`;
    if (customerData.cpf) message += `%0A*CPF:* ${maskCpfForMessage(customerData.cpf)}`;
    
    return message;
  }, [cart, customerData, orderId]);

  const isPopupBlocked = (popupWindow) => !popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined';

  const generateOrderId = () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const handleWhatsAppCheckout = () => {
    setFeedbackMessage(null);
    if (cart.length === 0) {
      setFeedbackMessage('Seu carrinho está vazio!');
      return;
    }

    if (!isCustomerValid) {
      setFeedbackMessage('Complete os dados do cliente para finalizar via WhatsApp. Verifique nome, email, telefone e CPF.');
      return;
    }

    setPaymentMethod('whatsapp');

    const resolvedOrderId = orderId ?? generateOrderId();
    setOrderId(resolvedOrderId);
    const message = generateWhatsAppMessage(resolvedOrderId);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    try {
      const whatsappWindow = window.open(whatsappLink, '_blank');
      if (isPopupBlocked(whatsappWindow)) {
        setFeedbackMessage('Não foi possível abrir o WhatsApp. Verifique se o bloqueio de pop-ups está ativo.');
        setPaymentMethod(null);
        return;
      }
    } catch (error) {
      setFeedbackMessage('Ocorreu um erro ao abrir o WhatsApp. Tente novamente ou ajuste o bloqueio de pop-ups.');
      setPaymentMethod(null);
      return;
    }
    
    setShowConfirmationModal(true);
  };

  const handlePixCheckout = () => {
    setFeedbackMessage(null);
    if (cart.length === 0) {
      setFeedbackMessage('Seu carrinho está vazio!');
      return;
    }

    if (!isCustomerValid) {
      setFeedbackMessage('Complete os dados do cliente (nome, email, telefone e CPF válidos) antes de gerar o PIX.');
      return;
    }

    if (gatewayError) {
      setFeedbackMessage('Método de pagamento PIX indisponível no momento.');
      return;
    }

    setPaymentMethod('pix');
    setShowPixForm(true);
  };

  const handlePixPaymentConfirm = async () => {
    setFeedbackMessage(null);
    setIsProcessingPayment(true);
    const resolvedOrderId = orderId ?? generateOrderId();
    setOrderId(resolvedOrderId);

    let createdOrder;
    try {
      createdOrder = createOrderUseCase.execute({
        id: resolvedOrderId,
        items: cart,
        customerData,
        shippingData: buildShippingData()
      });
    } catch (error) {
      setFeedbackMessage(error.message || 'Erro ao criar pedido');
      setIsProcessingPayment(false);
      return;
    }

    let payment = null;
    if (processPaymentUseCase) {
      try {
        payment = await processPaymentUseCase.execute(createdOrder, {
          paymentMethod: 'pix',
          amount: total
        });
      } catch (error) {
        console.warn('Erro ao processar pagamento', error);
        const isRateLimited = error?.status === 429 || /aguarde 1 minuto/i.test(error?.message ?? '');
        const retryAfterRaw = error?.details?.retryAfter;
        const retryAfterNumber = Number(retryAfterRaw);
        const retryAfter = Number.isFinite(retryAfterNumber) && retryAfterNumber > 0 && retryAfterNumber < 3600
          ? Math.round(retryAfterNumber)
          : null;
        let errorMessage = 'Não foi possível processar o pagamento via PIX. Tente novamente ou escolha outra forma.';

        if (isRateLimited) {
          errorMessage = 'Muitas tentativas. Aguarde 1 minuto antes de gerar um novo pagamento.';
        }

        // Preserve orderId state for retry attempts
        setOrderId(orderId ?? resolvedOrderId);

        setFeedbackMessage(
          <div className="error-with-fallback">
            <p className="error-message">{errorMessage}</p>
            {retryAfter && <p className="retry-hint">Tente novamente em aproximadamente {retryAfter} segundos.</p>}
            <button
              type="button"
              className="btn whatsapp-fallback-btn"
              onClick={handleWhatsAppCheckout}
            >
              Finalizar via WhatsApp
            </button>
          </div>
        );
        setIsProcessingPayment(false);
        return;
      }
    }

    // Fallback QR code should only be used in development/testing
    if (!payment?.qrCode && !payment?.qrCodeBase64) {
      setFeedbackMessage('Erro ao gerar código PIX. Tente novamente ou escolha outra forma de pagamento.');
      setIsProcessingPayment(false);
      return;
    }
    
    const pixCode = payment.qrCode ?? payment.qrCodeBase64;

    setPixQrCode(pixCode);
    setPaymentInfo(payment);
    setShowConfirmationModal(true);
    setIsProcessingPayment(false);
  };

  const handlePaymentConfirmation = useCallback((completed) => {
    stopPolling();
    if (confirmationTimeoutRef.current) {
      clearTimeout(confirmationTimeoutRef.current);
    }
    if (completed) {
      clearCart();
      setFeedbackMessage('Pagamento confirmado! Obrigado pela compra.');
    } else {
      setFeedbackMessage('Pagamento não concluído. Você pode tentar novamente ou escolher outra forma.');
    }
    setIsProcessingPayment(false);
    setShowPixForm(false);
    setPixQrCode(null);
    setPaymentMethod(null);
    setCustomerData({ name: '', email: '', phone: '', cpf: '' });
    setPaymentInfo(null);
    // Reset orderId to ensure fresh ID for next transaction
    setOrderId(null);
    setShowConfirmationModal(false);
  }, [clearCart, stopPolling]);

  const maskedCpf = useMemo(() => {
    const digits = customerData.cpf?.replace(/\D/g, '') ?? '';
    if (digits.length < 3) return '';
    return `***.***.${digits.slice(-3)}`;
  }, [customerData.cpf]);

  useEffect(() => {
    latestPaymentInfoRef.current = paymentInfo;
    latestPixQrCodeRef.current = pixQrCode;
    const MAX_CONSECUTIVE_FAILURES = 5;
    const POLL_INTERVAL_MS = 5000;
    let consecutiveFailures = 0;

    const shouldStopPolling = () => {
      const currentPaymentInfo = latestPaymentInfoRef.current;
      const currentPixQrCode = latestPixQrCodeRef.current;
      return !currentPaymentInfo?.paymentId
        || !currentPixQrCode
        || currentPaymentInfo.status !== 'pending';
    };

    if (shouldStopPolling()) {
      stopPolling();
      return undefined;
    }

    setIsPolling(true);

    const pollPaymentStatus = async () => {
      if (shouldStopPolling()) {
        stopPolling();
        return;
      }

      if (isPollingRequestInFlightRef.current) return;
      isPollingRequestInFlightRef.current = true;
      try {
        const response = await fetch(`/api/mercadopago/payment-status/${latestPaymentInfoRef.current.paymentId}`);
        const payload = await response.json().catch(() => ({}));
        if (response.ok && payload?.payment) {
          consecutiveFailures = 0;
          // Check shouldStopPolling again after async operation completes
          if (!shouldStopPolling()) {
            setPaymentInfo((prev) => ({ ...prev, ...payload.payment }));
          }
        } else {
          consecutiveFailures += 1;
        }
      } catch (error) {
        console.warn('Erro ao consultar status do pagamento', error);
        consecutiveFailures += 1;
      } finally {
        isPollingRequestInFlightRef.current = false;
      }

      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES || shouldStopPolling()) {
        stopPolling();
        return;
      }
    };

    startPollingTimeoutRef.current = setTimeout(() => {
      pollingIntervalRef.current = setInterval(pollPaymentStatus, POLL_INTERVAL_MS);
      pollPaymentStatus();
    }, POLL_INTERVAL_MS);

    return () => {
      stopPolling();
    };
  }, [paymentInfo, pixQrCode, stopPolling]);

  useEffect(() => {
    if (!paymentInfo) return undefined;
    if (paymentInfo.status === 'approved') {
      stopPolling();
      confirmationTimeoutRef.current = setTimeout(() => handlePaymentConfirmation(true), 3000);
      return () => {
        if (confirmationTimeoutRef.current) {
          clearTimeout(confirmationTimeoutRef.current);
        }
      };
    }

    if (['rejected', 'cancelled', 'refunded', 'charged_back'].includes(paymentInfo.status)) {
      stopPolling();
      setFeedbackMessage('Pagamento não concluído. Você pode tentar novamente ou escolher outra forma.');
       setPixQrCode(null);
       setPaymentInfo(null);
       setTimeRemaining(null);
    }

    return undefined;
  }, [handlePaymentConfirmation, paymentInfo, stopPolling]);

  useEffect(() => {
    if (!paymentInfo?.expiresAt) {
      setTimeRemaining(null);
      return undefined;
    }

    const EXPIRY_WARNING_THRESHOLD_MS = 5 * 60 * 1000;

    const expiration = paymentInfo.expiresAt instanceof Date
      ? paymentInfo.expiresAt
      : new Date(paymentInfo.expiresAt);

    if (Number.isNaN(expiration.getTime())) {
      setTimeRemaining(null);
      return undefined;
    }

    let intervalId;
    const updateTime = () => {
      const total = Math.max(0, expiration.getTime() - Date.now());
      const minutes = Math.floor(total / 60000);
      const seconds = Math.floor((total % 60000) / 1000);
      setTimeRemaining({ total, minutes, seconds, warning: total <= EXPIRY_WARNING_THRESHOLD_MS });
      if (total === 0) {
        stopPolling();
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    intervalId = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(intervalId);
  }, [paymentInfo, stopPolling]);

  useEffect(() => {
    return () => {
      if (confirmationTimeoutRef.current) {
        clearTimeout(confirmationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <SEO {...checkoutSeoProps} />
      {cart.length === 0 ? (
        <main id="main-content" tabIndex="-1">
          <section className="section checkout-section">
            <div className="container">
              <h2 className="section-title">Finalizar Compra</h2>
              <div className="empty-checkout">
                <span className="empty-icon">🛒</span>
                <p>Seu carrinho está vazio!</p>
                <button className="btn btn-primary" onClick={() => navigate('/produtos')}>
                  Ver Produtos
                </button>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main id="main-content" tabIndex="-1">
          <section className="section checkout-section">
            <div className="container">
              <h2 className="section-title">Finalizar Compra</h2>
              <p className="section-subtitle">Revise seu pedido, preencha seus dados e escolha a forma de pagamento</p>

              <CheckoutSteps currentStep={currentStep} />

              <div className="checkout-container">
                {/* Cart Items */}
                <div className="checkout-items">
                  <h3>Itens do Pedido</h3>
                  <div className="checkout-items-list">
                    {cart.map((item) => (
                      <div key={item.product.id} className="checkout-item">
                        <OptimizedImage
                          src={item.product.getImageUrl()}
                          alt={item.product.imageAlt}
                          className="checkout-item-image"
                        />
                        
                        <div className="checkout-item-details">
                          <h4>{item.product.name}</h4>
                          <p className="checkout-item-description">{item.product.description}</p>
                          <p className="checkout-item-price">R$ {item.product.price.toFixed(2)} (unidade)</p>
                        </div>
                        
                        <div className="checkout-item-actions">
                          <div className="quantity-controls">
                            <button 
                              className="qty-btn"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isProcessingPayment}
                              aria-label="Diminuir quantidade"
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              className="qty-btn"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              disabled={isProcessingPayment}
                              aria-label="Aumentar quantidade"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemove(item.product.id)}
                            disabled={isProcessingPayment}
                            title="Remover item"
                            aria-label="Remover item"
                          >
                            🗑️
                          </button>
                        </div>
                        
                        <div className="checkout-item-total">
                          Subtotal: R$ {item.getTotal().toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-total">
                    <strong>Total do Pedido:</strong>
                    <strong className="total-amount">R$ {total.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="checkout-payment">
                  <CustomerForm
                    value={customerData}
                    onChange={setCustomerData}
                    onValidityChange={setIsCustomerValid}
                  />

                  <h3>Forma de Pagamento</h3>
                  {feedbackMessage && (
                    typeof feedbackMessage === 'string'
                      ? <p className="field-error" role="alert">{feedbackMessage}</p>
                      : feedbackMessage
                  )}
                  
                  {!showPixForm ? (
                    <div className="payment-options">
                      <button 
                        className="payment-option whatsapp-option"
                        onClick={handleWhatsAppCheckout}
                        disabled={isProcessingPayment || !isCustomerValid}
                      >
                        <span className="payment-icon">💬</span>
                        <div className="payment-option-content">
                          <h4>WhatsApp</h4>
                          <p>Finalize seu pedido enviando uma mensagem</p>
                        </div>
                      </button>

                      <button 
                        className="payment-option pix-option"
                        onClick={handlePixCheckout}
                        disabled={isProcessingPayment || !isCustomerValid || Boolean(gatewayError)}
                      >
                        <span className="payment-icon">💳</span>
                        <div className="payment-option-content">
                          <h4>PIX</h4>
                          <p>Pague agora com PIX e receba confirmação</p>
                        </div>
                      </button>
                      {gatewayError && (
                        <p className="field-error" role="alert">{gatewayError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="pix-payment-section">
                      {!pixQrCode ? (
                        <div className="pix-form">
                          <h4>Pagamento via PIX</h4>
                          <p>Confirme os dados e gere o QR Code com o valor total do pedido.</p>
                          {isProcessingPayment ? (
                            <LoadingSpinner message="Gerando QR Code PIX... Aguarde" />
                          ) : null}
                          <div className="pix-form-actions">
                            <button 
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                setShowPixForm(false);
                                setPaymentMethod(null);
                              }}
                              disabled={isProcessingPayment}
                            >
                              Voltar
                            </button>
                            <button 
                              type="button"
                              className="btn btn-primary"
                              onClick={handlePixPaymentConfirm}
                              disabled={isProcessingPayment}
                            >
                              {isProcessingPayment ? 'Gerando...' : 'Gerar QR Code PIX'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pix-qrcode-section">
                          <h4>QR Code PIX</h4>
                          <div className="qrcode-placeholder">
                            <div className="qrcode-box">
                              <div className="qrcode-pattern">
                                <div></div><div></div><div></div>
                                <div></div><div></div><div></div>
                                <div></div><div></div><div></div>
                              </div>
                              <p className="qrcode-label">QR CODE PIX</p>
                            </div>
                          </div>
                          <div className="pix-code-copy">
                            <p>Código PIX:</p>
                            <div className="code-box">
                              <code>{pixQrCode.substring(0, 50)}...</code>
                              <button 
                                className="copy-btn"
                                onClick={() => {
                                  navigator.clipboard.writeText(pixQrCode);
                                  alert('Código PIX copiado!');
                                }}
                              >
                                📋 Copiar
                              </button>
                            </div>
                          </div>
                          <div className="pix-instructions">
                            <p><strong>Instruções:</strong></p>
                            <ol>
                              <li>Abra o app do seu banco</li>
                              <li>Escolha pagar com PIX</li>
                              <li>Escaneie o QR Code ou cole o código PIX</li>
                              <li>Confirme o pagamento de R$ {total.toFixed(2)}</li>
                            </ol>
                            <p className="contact-confirmation">
                              ✅ Você receberá confirmação quando seu pedido estiver pronto!
                              <br /><strong>Nome:</strong> {customerData.name}
                              <br /><strong>Email:</strong> {customerData.email}
                              <br /><strong>Telefone:</strong> {customerData.phone}
                              <br /><strong>CPF:</strong> {maskedCpf}
                            </p>
                          </div>
                          <div className="payment-status-indicator">
                            {isPolling && paymentInfo?.status === 'pending' && (
                              <div className="status-waiting">
                                <div className="status-pulse"></div>
                                <p>Aguardando pagamento...</p>
                                <small>Atualizando automaticamente</small>
                              </div>
                            )}
                            {paymentInfo?.status === 'approved' && (
                              <p className="status-success">Pagamento confirmado! Fechando em instantes...</p>
                            )}
                          </div>
                          {timeRemaining && timeRemaining.total > 0 && (
                            <div className={`qr-code-timer ${timeRemaining.warning ? 'timer-warning' : ''}`}>
                              <p>
                                ⏱️ Tempo restante:{' '}
                                <strong>
                                  {String(timeRemaining.minutes).padStart(2, '0')}:
                                  {String(timeRemaining.seconds).padStart(2, '0')}
                                </strong>
                              </p>
                              {timeRemaining.warning && (
                                <small>QR Code expirando em breve!</small>
                              )}
                            </div>
                          )}
                          {timeRemaining && timeRemaining.total === 0 && (
                            <div className="qr-code-expired">
                              <p>QR Code expirado. Gere um novo para continuar.</p>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  stopPolling();
                                  setPixQrCode(null);
                                  setPaymentInfo(null);
                                  setTimeRemaining(null);
                                  setIsProcessingPayment(false);
                                }}
                              >
                                Gerar novo QR Code
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Confirmation Modal */}
          {showConfirmationModal && (
            <div className="modal-overlay" onClick={(e) => {
              if (e.target.className === 'modal-overlay') {
                // Prevent closing modal by clicking outside
              }
            }}>
              <div className="modal-content">
                <h3>Confirmação de Pagamento</h3>
                <p>
                  {paymentMethod === 'whatsapp' 
                    ? 'Você finalizou a compra via WhatsApp?' 
                    : 'Você concluiu o pagamento via PIX?'}
                </p>
                <div className="modal-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handlePaymentConfirmation(false)}
                  >
                    Não, cancelar
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handlePaymentConfirmation(true)}
                  >
                    Sim, concluí
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
}
