import { useState, memo } from 'react';
import './FAQItem.css';

/**
 * FAQ Item Component
 * Displays a single FAQ question with collapsible answer
 * Memoized to prevent unnecessary re-renders in lists
 */
export const FAQItem = memo(function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`}>
      <button className="faq-question" onClick={toggle}>
        <span>{question}</span>
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
});
