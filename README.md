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
- 💳 Integração PIX via Mercado Pago (detalhes em [docs/PAYMENT_INTEGRATION.md](docs/PAYMENT_INTEGRATION.md))

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

# Configurar variáveis de ambiente
# Copie o arquivo .env.example para .env e preencha com seus dados
cp .env.example .env

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

### Configuração de Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para armazenar informações sensíveis como números de telefone e WhatsApp. 

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e preencha com suas informações reais:
   ```env
   VITE_WHATSAPP_NUMBER=5511999999999
   VITE_PHONE_DISPLAY=(11) 99999-9999
   VITE_STORE_ADDRESS=Rua Exemplo, 123 - São Paulo, SP
   ```

3. **Importante**: O arquivo `.env` não deve ser commitado no Git. Apenas o `.env.example` deve estar no repositório.

4. Para deploy na Vercel, configure as variáveis de ambiente no painel de configurações do projeto.

#### Variáveis Disponíveis

- `VITE_WHATSAPP_NUMBER`: Número do WhatsApp no formato internacional (ex: 5511999999999)
- `VITE_PHONE_DISPLAY`: Número de telefone formatado para exibição (ex: (11) 99999-9999)
- `VITE_STORE_ADDRESS`: Endereço da loja física (opcional)

### Integração Mercado Pago - Checkout PRO

O projeto utiliza o **Checkout PRO do Mercado Pago** para processar pagamentos.  Esta integração oferece:

- ✅ Cartão de crédito/débito
- ✅ PIX
- ✅ Boleto bancário
- ✅ Saldo em conta Mercado Pago
- ✅ Parcelamento

#### Configuração

1. **Obtenha suas credenciais** no [painel de desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel/app)

2. **Configure as variáveis de ambiente**: 
   ```env
   VITE_MP_PUBLIC_KEY=sua-chave-publica
   MP_ACCESS_TOKEN=seu-access-token
   SITE_URL=https://seu-dominio.com
   ```

3. **Para ambiente de teste**, use as credenciais de sandbox (começam com `TEST-`)

#### Fluxo de Pagamento

1. Cliente preenche dados e escolhe "Cartão, PIX ou Boleto"
2. Sistema cria uma Preference no backend
3. SDK do Mercado Pago renderiza o botão de pagamento
4. Cliente é redirecionado para o Mercado Pago
5. Após pagamento, cliente retorna para `/checkout/retorno`
6. Sistema processa o resultado e exibe feedback

#### Arquivos Principais

- `src/infrastructure/gateways/MercadoPagoPreferenceGateway.js` - Gateway de comunicação
- `src/domain/usecases/CreateCheckoutPreferenceUseCase.js` - Use case de criação
- `src/presentation/components/features/Checkout/MercadoPagoCheckoutButton.jsx` - Componente do botão
- `src/presentation/pages/CheckoutReturnPage.jsx` - Página de retorno
- `api/mercadopago/create-preference.js` - Endpoint serverless

## Deploy

### Deploy na Vercel

O projeto está configurado para deploy na Vercel e inclui o arquivo `vercel.json` para garantir que o roteamento client-side funcione corretamente.

Consulte o checklist de deploy da fase de pagamentos em [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md).

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

O site utiliza uma paleta luxuosa e sofisticada definida em CSS Variables:
- **--primary-color**: #5A2A83 (Roxo Elegante - sofisticação e luxo)
- **--secondary-color**: #D4AF37 (Dourado - luxo e prestígio)
- **--accent-color**: #B2AC83 (Khaki Suave - elegância e requinte)
- **--dark-bg**: #2C1B2E (Roxo Escuro - rico e sofisticado)
- **--light-bg**: #FFFCEC (Creme Claro - suavidade e leveza)

## Customização

### Adicionar Novos Produtos
Edite `src/infrastructure/repositories/ProductsRepository.js` e adicione novos produtos ao array.

### Atualizar Contatos
Atualize os números de telefone e WhatsApp editando o arquivo `.env`:
```env
VITE_WHATSAPP_NUMBER=5511999999999
VITE_PHONE_DISPLAY=(11) 99999-9999
VITE_STORE_ADDRESS=Seu endereço aqui
```

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
