# Regras e Requisitos

### Regras de Negócios

- Usuários só podem acessar transações dos workspaces para os quais têm permissão.
- Não é permitido editar transações anteriores ao mês corrente (atual).
- Só o dono/criador de um workspace poderá convidar outros usuários.
- Só pode haver uma categoria por transação.
- Um usuário pode pertencer a vários workspaces, e um workspace pode ter vários usuários.
- Membros de um workspace não poderá remover o acesso do proprietário e nem alterar sua permissão.
- Usuários NÃO assinantes só poderão ter 1 workspace, privado e limitados a 20 transações mensais.

### Requisitos funcionais

- Login e autenticação.
- Criação, leitura, edição e exclusão de transações.
- Gerenciar workspace (criar, editar, excluir, convidar e remover membros).
- Registro automático de transações recorrentes aos seus respectivos períodos (mensal, anual, etc).
- Visualização de relatórios e saldos por workspace ao final de cada mês e exportar em PDF/CSV.
- Notificações sobre convites de juntar-se a um workspace.
- Mecanismo de busca por transação.
- Exibir dashboard financeira para cada workspace, com filtro de períodos.
- Exibir últimas 10 transações feitas, ordenadas por data de pagamento.
- Exibir pagamentos da semana atual de contas recorrentes.
- Exibir pagamentos atrasados do mês atual de contas recorrentes.
- Exibir gastos total por cada categoria e o valor percentual representado e relação a receita.
- Exibir valor total mensal de: receita, despesa, investimento e saldo.
- Definir o tipo de perfil financieiro por meio de questionário.
- Definir tipo de moeda e idioma de preferência do usuário.

### Requisitos não funcionais

- Dados dos usuários e workspaces isolados, sem vazamentos entre tenants.
- Senhas armazenadas de forma criptografada.
- Interface responsiva e intuitíva.
- Transmissão de dados via HTTPS
- Validar campos obrigatório antes do envio e sinalizar para o usuário.
- Modo claro e escuro.
- Ter um switcher para trocar o workspace ou adicionar um novo.
- Ter um dropdown para lidar com perfil do usuário (Meu perfil, Gerenciar finanças, Logout)