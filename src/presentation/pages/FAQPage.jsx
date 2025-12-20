import { FAQItem } from '../components/features/FAQ/FAQItem';
import { SEO } from '../components/common/SEO';

// Static FAQ data - defined outside component to avoid recreation on every render
const FAQ_DATA = [
  {
    question: 'Como faço para fazer um pedido?',
    answer: 'Você pode fazer seu pedido diretamente pelo nosso site clicando em "Adicionar ao Pedido" nos produtos desejados, ou entrar em contato conosco via WhatsApp ou telefone.'
  },
  {
    question: 'Qual o prazo de entrega?',
    answer: 'O prazo de entrega varia de acordo com sua localização e o produto escolhido. Geralmente, trabalhamos com 24 a 48 horas de antecedência para garantir a qualidade e frescor dos doces.'
  },
  {
    question: 'Vocês fazem encomendas para festas?',
    answer: 'Sim! Atendemos encomendas especiais para festas, casamentos, eventos corporativos e outras ocasiões. Entre em contato conosco para discutir suas necessidades específicas.'
  },
  {
    question: 'Os doces contêm conservantes?',
    answer: 'Não! Todos os nossos doces são 100% artesanais e livres de conservantes artificiais. Utilizamos apenas ingredientes naturais e de alta qualidade.'
  },
  {
    question: 'Qual é a validade dos produtos?',
    answer: 'A validade varia de acordo com o produto. Todos os nossos doces são frescos e a validade é informada na embalagem. Em geral, recomendamos consumir em até 3-5 dias quando refrigerados.'
  }
];

/**
 * FAQ Page
 * Displays frequently asked questions
 */
export function FAQPage() {
  return (
    <>
      <SEO 
        title="Perguntas Frequentes"
        description="Tire suas dúvidas sobre nossos produtos, prazos de entrega, ingredientes e muito mais."
        canonical="https://vz-dolci.vercel.app/faq"
      />
      <main>
        <section className="section animated-background">
          <div className="container">
            <h2 className="section-title">Perguntas Frequentes</h2>
            
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {FAQ_DATA.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
