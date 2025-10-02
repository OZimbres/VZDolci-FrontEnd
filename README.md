# VZ Dolci

Aplicação Web React para gerência do site da doceria VZ Dolci

## Sobre o Projeto

Website luxuoso para a doceria VZ Dolci, especializada em doces artesanais premium como panna cotta, pão de mel, crema cotta e muito mais.

Desenvolvido com **React** seguindo princípios de **Clean Architecture**, **SOLID** e boas práticas de desenvolvimento profissional.

## Funcionalidades

- ✨ Design luxuoso com paleta de cores em roxo profundo e dourado
- 🍰 Catálogo de produtos com descrições detalhadas, ingredientes e preços
- 📖 Seção "Sobre Nós" com história, missão e valores da VZ Dolci
- ❓ FAQ com perguntas frequentes
- 📱 Sistema de pedidos integrado com WhatsApp
- 🛒 Carrinho de compras funcional com Context API
- 📞 Informações de contato (WhatsApp, telefone, loja física)
- 📱 Design totalmente responsivo para mobile, tablet e desktop
- 🚀 SPA (Single Page Application) com React Router
- 📊 Integração com Vercel Web Analytics para análise de visitantes
- ⚡ Vercel Speed Insights para monitoramento de performance

## Tecnologias Utilizadas

- **React 18** - Library para construção de interfaces
- **React Router DOM** - Navegação entre páginas
- **Vite** - Build tool moderna e rápida
- **CSS3** - Estilização com variáveis CSS
- **ESLint** - Linting e qualidade de código
- **Vercel Analytics** - Web analytics para rastreamento de visitantes
- **Vercel Speed Insights** - Monitoramento de performance em tempo real

## Arquitetura do Projeto

O projeto segue os princípios de **Clean Architecture** com separação clara de responsabilidades:

```
src/
├── domain/                    # Camada de Domínio (Regras de Negócio)
│   ├── entities/             # Entidades do domínio
│   │   ├── Product.js        # Entidade Produto
│   │   └── CartItem.js       # Entidade Item do Carrinho
│   └── usecases/             # Casos de uso
│       ├── AddToCartUseCase.js
│       └── CalculateCartTotalUseCase.js
│
├── application/              # Camada de Aplicação
│   ├── contexts/            # Contextos React
│   │   └── CartContext.jsx  # Gerenciamento de estado do carrinho
│   └── hooks/               # Custom Hooks
│       └── useProducts.js   # Hook para gerenciar produtos
│
├── infrastructure/          # Camada de Infraestrutura
│   └── repositories/       # Repositórios de dados
│       └── ProductsRepository.js
│
└── presentation/           # Camada de Apresentação (UI)
    ├── components/
    │   ├── common/        # Componentes comuns
    │   │   ├── Header.jsx
    │   │   └── Footer.jsx
    │   └── features/      # Componentes específicos
    │       ├── Home/
    │       ├── Products/
    │       ├── FAQ/
    │       └── Contact/
    ├── pages/             # Páginas da aplicação
    │   ├── HomePage.jsx
    │   ├── ProductsPage.jsx
    │   ├── AboutPage.jsx
    │   ├── FAQPage.jsx
    │   └── ContactPage.jsx
    └── styles/            # Estilos globais
        └── global.css
```

## Princípios de Design Aplicados

### Clean Architecture
- **Separação de Camadas**: Domain, Application, Infrastructure, Presentation
- **Dependency Rule**: Dependências apontam sempre para dentro (domain não depende de nada)
- **Independência de Framework**: Lógica de negócio isolada do React

### SOLID
- **Single Responsibility**: Cada componente/classe tem uma única responsabilidade
- **Open/Closed**: Componentes abertos para extensão, fechados para modificação
- **Liskov Substitution**: Uso de interfaces e abstrações
- **Interface Segregation**: Interfaces específicas e focadas
- **Dependency Inversion**: Depender de abstrações, não de implementações concretas

### Outros Princípios
- **DRY** (Don't Repeat Yourself): Reutilização de código
- **KISS** (Keep It Simple, Stupid): Simplicidade no design
- **Separation of Concerns**: Separação clara de responsabilidades

## Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Executar linting
npm run lint
```

A aplicação estará disponível em `http://localhost:5173`

## Deploy

### Deploy na Vercel

O projeto está configurado para deploy na Vercel e inclui o arquivo `vercel.json` para garantir que o roteamento client-side funcione corretamente.

#### Problema de Roteamento em SPAs
Single Page Applications (SPAs) como esta usam client-side routing. Quando você acessa uma rota como `/produtos` diretamente ou atualiza a página (F5), o servidor precisa ser configurado para sempre retornar o arquivo `index.html`, permitindo que o React Router gerencie a navegação.

#### Solução Implementada
O arquivo `vercel.json` configura a Vercel para reescrever todas as rotas para `/index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Isso resolve o erro 404 que ocorria ao:
- Acessar uma rota diretamente (ex: `https://seusite.com/produtos`)
- Atualizar a página (F5) em qualquer rota diferente da home

### Deploy em Outras Plataformas

Para outras plataformas de hospedagem, você precisará configurar rewrites/redirects similares:

**Netlify**: Crie um arquivo `_redirects` na pasta `public`:
```
/*    /index.html   200
```

**Apache**: Adicione ao `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx**: Configure no arquivo de configuração:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Estrutura de Dados

### Product Entity
```javascript
{
  id: number,
  name: string,
  description: string,
  price: number,
  ingredients: string,
  story: string,
  emoji: string
}
```

### CartItem Entity
```javascript
{
  product: Product,
  quantity: number
}
```

## Paleta de Cores

O site utiliza uma paleta luxuosa inspirada em confeitarias italianas, definida em CSS Variables:
- **--primary-color**: #D4739B (Rosa Suave - doce, acolhedor, remete a sobremesas)
- **--secondary-color**: #D4AF37 (Dourado - luxo e sofisticação)
- **--accent-color**: #8B6F47 (Marrom Quente - chocolate, premium)
- **--dark-bg**: #3E2723 (Marrom Escuro - rico e sofisticado)
- **--light-bg**: #FFF8F0 (Creme Quente - suave e acolhedor)

## Customização

### Adicionar Novos Produtos
Edite `src/infrastructure/repositories/ProductsRepository.js` e adicione novos produtos ao array.

### Atualizar Contatos
Atualize os números de telefone e WhatsApp em:
- `src/presentation/pages/ContactPage.jsx`

### Modificar Cores
Ajuste as variáveis CSS em `src/presentation/styles/global.css`

### Adicionar Novas Páginas
1. Crie o componente da página em `src/presentation/pages/`
2. Adicione a rota em `src/App.jsx`
3. Atualize o Header com o novo link

## Testes

Para adicionar testes ao projeto:

```bash
# Instalar dependências de teste
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Executar testes
npm run test
```

## Melhorias Futuras

- [ ] Adicionar testes unitários e de integração
- [ ] Implementar backend real com API REST
- [ ] Adicionar autenticação de usuários
- [ ] Implementar sistema de pagamento
- [ ] Adicionar imagens reais dos produtos
- [ ] Implementar sistema de avaliações
- [ ] Adicionar internacionalização (i18n)

## Licença

GPL-3.0 License - Veja o arquivo LICENSE para mais detalhes.
