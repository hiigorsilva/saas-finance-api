# Saas Finance API

Esta é uma API **multi-tenant** e **multi-workspace** para controle financeiro, projetada para ajudar indivíduos e grupos a gerenciar e tomar o controle de suas finanças pessoais e compartilhadas. 

É um sistema com **autenticação** e **autorização** baseada em funções para cada usuário. Usuários podem criar, editar, listar e apagar transações e workspaces, além de definir o seu perfil financeiro. 

Workspaces podem ser **privados** (exclusivos para o usuário) ou **compartilhados** (com vários usuários colaborando no controle financeiro de despesas comuns).

Construída com **Node.js com Fastify e TypeScript**, a aplicação visa simplificar o registro e a análise de receitas e despesas.

## 🚀 Funcionalidades Principais

- **Gerenciamento de Transações:** O usuário pode criar, editar, listar e apagar transações.

- **Multi-Tenant:** Arquitetura onde uma única instância do sistema serve vários clientes (tenants), mantendo os dados de cada um isolados e seguros.

- **Multi-Workspace:** O usuário pode ter vários workspaces (espaços de trabalho), privado para controle financeiro pessoal ou compartilhado para gerenciar finanças em grupo (ex: despesa de casa, viagens).

- **Autenticação:** Sistema de cadastro e login de usuários.

- **Autorização:** Controle de acesso baseado em papéis (roles) para garantir a segurança e a privacidade dos dados nos workspaces.

- **Perfil Financeiros de Usuários:** O usuário pode definir o seu perfil financeiro para mapear o seu cenário em relação ao controle financeiro.

## 🛠️ Tecnologias Utilizadas

- **Node.js:** Ambiente de execução JavaScript.

- **Fastify:** Framework web rápido e de baixo overhead para Node.js.

- **TypeScript:** Superset do JavaScript com tipagem estática.

- **Zod:** Biblioteca de validação de schemas e parsing de dados.

- **Swagger/OpenAPI:** Geração de documentação interativa da API.

- **PostgreSQL:** Banco de dados relacional utilizado para armazenamento dos dados.

- **Drizzle ORM:** ORM para facilitar o acesso e manipulação do banco PostgreSQL.

- **Json Web Token - JWT:** Mecanismo de autenticação baseado em tokens para segurança da API.

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para clonar e rodar a API localmente.

### Pré-requisitos

Certifique-se de que você tem as seguintes ferramentas instaladas em sua máquina:

- Node.js (versão 22.x ou superior)

- npm

- Docker (para rodar o banco de dados em um container)

- Git

### Passo a Passo

### 1. Clone o repositório:

```bash
git clone https://github.com/hiigorsilva/saas-finance-api.git
cd saas-finance-api
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Instale as dependências:

- Crie um arquivo `.env` na raiz do projeto.
- Copie o arquivo de exemplo `.env.example` para `.env`.

```bash
cp .env.example .env
```

- Preencha as variáveis conforme sua configuração local (banco de dados, portas, chaves)

### 4. Inicie o banco de dados (se necessário):

- ### Com Docker (recomendado):

```bash
docker-compose up -d
```

- Certifique-se de que o seu banco de dados está rodando e configurado conforme a `DATABASE_URL` definida em `.env`.

- ### Opção de banco online
  
  - **[NeonDB](neon.com):** Hospdagem de banco de dados PostgreSQL. Crie o banco e copie a URL para o arquivo `.env` e cole na variável `DATABASE_URL`.




### 5. Execute as migrações do banco de dados:

```bash
npm run db:generate
npm run db:migrate
```

### 6. Inicie o servidor

- ### Modo de desenvolvimento

```bash
npm run dev
```

### 7. Acesse a documentação da API no navegador

```bash
http://localhost:[PORT]/api/docs
```

- Substitua `[PORT]` pela variável de ambiente configurada no `.env`.


## 😉 Melhorias Futuras

- **Registro de transações via WhatsApp:** Poderá criar uma transação em um workspace a partir de mensagens, áudios e fotos de comprovantes.


## Contribuição

Contribuições são bem-vindas! Faça um fork do repositório, crie uma branch para sua feature ou correção e envie um pull request.


## Licença

Este projeto está licenciado sob a Licença MIT.