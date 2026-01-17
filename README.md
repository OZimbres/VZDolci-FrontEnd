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
   VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   VITE_WHATSAPP_NUMBER=5511999999999
   VITE_PHONE_DISPLAY=(11) 99999-9999
   VITE_STORE_ADDRESS=Rua Exemplo, 123 - São Paulo, SP
   ```

3. **Importante**: O arquivo `.env` não deve ser commitado no Git. Apenas o `.env.example` deve estar no repositório.

4. Para deploy na Vercel, configure as variáveis de ambiente no painel de configurações do projeto.

#### Variáveis Disponíveis

- `VITE_MERCADO_PAGO_PUBLIC_KEY`: Chave pública do Mercado Pago (use uma chave que comece com `TEST-` em sandbox). É a única credencial que pode ficar no frontend e deve sempre ter prefixo `VITE_`.
- `MERCADO_PAGO_ACCESS_TOKEN`: Access Token do Mercado Pago (SEM prefixo `VITE_`). Usado apenas no backend, nunca deve ser exposta no frontend.
- `VITE_WHATSAPP_NUMBER`: Número do WhatsApp no formato internacional (ex: 5511999999999)
- `VITE_PHONE_DISPLAY`: Número de telefone formatado para exibição (ex: (11) 99999-9999)
- `VITE_STORE_ADDRESS`: Endereço da loja física (opcional)

---

## 💳 Integração Mercado Pago - Fase 1: Fundação

Esta seção documenta a configuração inicial do Mercado Pago para o sistema de pagamentos do VZ Dolci.

### 📚 Conceitos Fundamentais

#### 🔑 Tipos de Credenciais do Mercado Pago

O Mercado Pago usa um sistema de **dois tipos de chaves** para segurança:

| Credencial | Onde Usar | Segurança | Função |
|------------|-----------|-----------|--------|
| **Public Key** | Frontend (navegador do usuário) | ✅ Pode ser exposta publicamente | Inicializa o SDK React, renderiza componentes visuais de pagamento |
| **Access Token** | Backend (servidor) | ⚠️ SECRETA - NUNCA expor | Cria preferências de pagamento, processa transações, acessa dados sensíveis |

**Analogia:**
- **Public Key** = Chave da porta da loja (qualquer um pode ver, serve apenas para entrar)
- **Access Token** = Chave do cofre (só o dono tem, permite movimentar dinheiro)

#### 🧪 Ambientes: Sandbox vs Produção

| Ambiente | Quando Usar | Dinheiro Real? |
|----------|-------------|----------------|
| **Sandbox (Teste)** | Durante desenvolvimento | ❌ Não - usa cartões de teste |
| **Produção (Production)** | Quando o site está pronto | ✅ Sim - transações reais |

**Importante:**
- Você terá **4 credenciais no total**: 2 para Sandbox + 2 para Produção
- Para desenvolvimento, use credenciais de **Sandbox** (começam com `TEST-`)
- Para produção, use credenciais de **Produção** (começam com `APP_USR-`)

### 🚀 Configuração Inicial (Fase 1)

#### Passo 1: Criar/Acessar Conta Mercado Pago

1. Se você **JÁ tem conta no Mercado Pago**:
   - Acesse: https://www.mercadopago.com.br/developers/panel
   - Faça login com suas credenciais

2. Se você **NÃO tem conta**:
   - Acesse: https://www.mercadopago.com.br/hub/registration/landing
   - Crie uma conta (use e-mail e CPF reais)
   - Confirme o e-mail
   - Depois acesse: https://www.mercadopago.com.br/developers/panel

#### Passo 2: Criar uma Aplicação

1. No painel de desenvolvedor, procure por **"Suas integrações"** ou **"Criar aplicação"**
2. Clique em **"Criar aplicação"**
3. Preencha os dados:

| Campo | O que colocar | Exemplo |
|-------|---------------|---------|
| **Nome da aplicação** | Nome do seu site | `VZ Dolci - Loja de Doces` |
| **Solução de pagamento** | Selecione: **"Checkout API"** | (Não confundir com Checkout Pro) |
| **Modelo de integração** | Selecione: **"Pagamentos online"** | |
| **URL do site** | URL de produção ou temporário | `https://vz-dolci.vercel.app` |

4. Salve/Confirme

#### Passo 3: Obter Credenciais de Sandbox

1. Dentro da aplicação criada, procure por **"Credenciais"** ou **"Credentials"**
2. Procure pela seção **"Credenciais de teste"** / **"Test credentials"**
3. Você verá duas credenciais:
   - **Public Key**: começa com `TEST-` (~50 caracteres)
   - **Access Token**: começa com `TEST-` (~70 caracteres, geralmente maior)

#### Passo 4: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas credenciais:
   ```env
   # Public Key (Frontend) - Sandbox
   VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxxxx-xxxx-xxxx-xxxxxxxxxxxx

   # Access Token (Backend) - Sandbox
   MERCADO_PAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxx

   # Outras variáveis...
   VITE_WHATSAPP_NUMBER=5511999999999
   VITE_PHONE_DISPLAY=(11) 99999-9999
   VITE_STORE_ADDRESS=Seu endereço aqui
   ```

3. **Importante:**
   - `VITE_MERCADO_PAGO_PUBLIC_KEY` tem prefixo `VITE_` porque será usada no frontend
   - `MERCADO_PAGO_ACCESS_TOKEN` NÃO tem prefixo `VITE_` para protegê-la (só backend)

#### Passo 5: Validar Configuração

Para testar se as variáveis estão configuradas corretamente:

1. Pare o servidor de desenvolvimento (`Ctrl + C`)
2. Reinicie o servidor: `npm run dev`
3. Importe temporariamente o arquivo de teste no `App.jsx`:
   ```javascript
   // IMPORT TEMPORÁRIO - REMOVER DEPOIS
   import './test-mercadopago-env.js';
   ```
4. Abra o Console do navegador (`F12` → aba "Console")
5. Verifique a saída - você deve ver:
   ```
   === TESTE DE VARIÁVEIS DE AMBIENTE ===
   Public Key: TEST-xxxxxxxx-xxxxxx-xxxx-xxxx-xxxxxxxxxxxx
   ✅ Public Key de Sandbox configurada corretamente!
   ✅ Access Token protegida (não acessível no frontend)
   ```
6. Remova o import do teste e delete o arquivo `src/test-mercadopago-env.js`

### ⚠️ Segurança

- ✅ `.env` está no `.gitignore` - suas credenciais não vão para o GitHub
- ✅ Apenas variáveis com prefixo `VITE_` são expostas no frontend
- ✅ Access Token permanece protegida no servidor
- ⚠️ NUNCA faça commit do arquivo `.env` (apenas do `.env.example`)
- ⚠️ NUNCA compartilhe suas credenciais de produção publicamente

### 📚 Referências

- [Painel de Desenvolvedor Mercado Pago](https://www.mercadopago.com.br/developers/panel)
- [Documentação de Credenciais](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/your-integrations/credentials)
- [Vite - Variáveis de Ambiente](https://vitejs.dev/guide/env-and-mode.html)

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
