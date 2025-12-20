import './SkipLink.css';

/**
 * SkipLink Component
 * Permite usuários de teclado/screen readers pularem navegação
 */
export function SkipLink() {
  const handleClick = (event) => {
    event.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  };

  return (
    <a href="#main-content" className="skip-link" onClick={handleClick}>
      Pular para o conteúdo principal
    </a>
  );
}
