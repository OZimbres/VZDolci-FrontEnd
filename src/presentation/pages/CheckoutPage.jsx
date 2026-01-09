import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../application/contexts/CartContext';
import { CreateOrderUseCase } from '../../domain/usecases/CreateOrderUseCase';
import { ProcessPaymentUseCase } from '../../domain/usecases/ProcessPaymentUseCase';
import { MercadoPagoGateway } from '../../infrastructure/gateways/MercadoPagoGateway';
import { CheckoutSteps } from '../components/features/Checkout/CheckoutSteps';
import { CustomerForm } from '../components/features/Checkout/CustomerForm';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { SEO } from '../components/common/SEO';
import './CheckoutPage.css';

// Environment variables
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';
const checkoutSeoProps = {
  title: 'Finalizar Pedido',
  description: 'Finalize seu pedido de doces artesanais premium da VZ Dolci.',
  canonical: 'https://vz-dolci.vercel.app/checkout',
  robots: 'noindex, follow'
};

const buildShippingData = () => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);

  const dayOfWeek = deliveryDate.getDay();
  if (dayOfWeek === 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  } else if (dayOfWeek === 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 2);
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
    if (paymentInfo || pixQrCode) {
      setCurrentStep(3);
    } else if (showPixForm || paymentMethod) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [paymentInfo, pixQrCode, showPixForm, paymentMethod]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (isProcessingPayment) return;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId) => {
    if (isProcessingPayment) return;
    removeFromCart(productId);
  };

  const generateWhatsAppMessage = (includeContactInfo = false) => {
    let message = '*Pedido VZ Dolci*%0A%0A';
    let cartTotal = 0;
    
    cart.forEach(item => {
      const itemTotal = item.getTotal();
      cartTotal += itemTotal;
      message += `${item.product.name} x${item.quantity} - R$ ${itemTotal.toFixed(2)}%0A`;
    });
    
    message += `%0A*Total: R$ ${cartTotal.toFixed(2)}*`;

    if (includeContactInfo) {
      message += `%0A%0A*Dados do Cliente:*`;
      if (customerData.name) message += `%0A*Nome:* ${customerData.name}`;
      if (customerData.email) message += `%0A*Email:* ${customerData.email}`;
      if (customerData.phone) message += `%0A*Telefone:* ${customerData.phone}`;
      if (customerData.cpf) message += `%0A*CPF:* ${customerData.cpf}`;
    }
    
    return message;
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    if (!isCustomerValid) {
      alert('Preencha os dados do cliente para finalizar via WhatsApp.');
      return;
    }

    setPaymentMethod('whatsapp');

    const message = generateWhatsAppMessage(true);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappLink, '_blank');
    
    setShowConfirmationModal(true);
  };

  const handlePixCheckout = () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    if (!isCustomerValid) {
      alert('Complete os dados do cliente antes de prosseguir para o PIX.');
      return;
    }

    if (gatewayError) {
      alert('Método de pagamento PIX indisponível no momento.');
      return;
    }

    setPaymentMethod('pix');
    setShowPixForm(true);
  };

  const handlePixPaymentConfirm = async () => {
    if (!isCustomerValid) {
      alert('Valide os dados do cliente para gerar o PIX.');
      return;
    }

    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    setIsProcessingPayment(true);

    let createdOrder;
    try {
      createdOrder = createOrderUseCase.execute({
        id: `ORDER-${Date.now()}`,
        items: cart,
        customerData,
        shippingData: buildShippingData()
      });
    } catch (error) {
      alert(error.message || 'Erro ao criar pedido');
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
      }
    }

    const pixCode = payment?.qrCode
      ?? payment?.qrCodeBase64
      ?? `00020126580014BR.GOV.BCB.PIX0136${Date.now()}520400005303986540${total.toFixed(2)}5802BR5913VZ Dolci6009SAO PAULO62070503***6304`;

    setPixQrCode(pixCode);
    setPaymentInfo(payment);
    setShowConfirmationModal(true);
    setIsProcessingPayment(false);
  };

  const handlePaymentConfirmation = (completed) => {
    if (completed) {
      clearCart();
    }
    setIsProcessingPayment(false);
    setShowPixForm(false);
    setPixQrCode(null);
    setPaymentMethod(null);
    setCustomerData({ name: '', email: '', phone: '', cpf: '' });
    setPaymentInfo(null);
    setShowConfirmationModal(false);
  };

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
                              <br /><strong>CPF:</strong> {customerData.cpf}
                            </p>
                          </div>
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
