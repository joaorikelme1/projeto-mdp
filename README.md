# 📖 Mensageiros da Paz — Sistema de Tesouraria (MDP)

Sistema web de gestão financeira e administrativa para a organização Mensageiros da Paz. Roda 100% no navegador, sem necessidade de servidor ou banco de dados — todos os dados são armazenados localmente via `localStorage`.

---

## 🚀 Como usar

1. Baixe e descompacte o arquivo `.zip` do projeto
2. Abra o arquivo `index.html` no navegador
3. Faça login com as credenciais padrão:
   - **Usuário:** `rayssa`
   - **Senha:** `123456`

> ⚠️ Não é necessário instalar nada. O sistema funciona diretamente no navegador.

---

## 👤 Perfis de Acesso

| Perfil | Acesso |
|---|---|
| **Super Admin** | Acesso completo, incluindo criação de administradores e limpeza de logs |
| **Administrador** | Acesso a todas as funcionalidades exceto gerenciamento de usuários |

---

## 📋 Funcionalidades

### 💰 Caixa
Registro e controle de todas as movimentações financeiras.
- Lançamento de entradas e saídas
- Categorias por tipo de movimentação
- Formas de pagamento: PIX, Dinheiro ou Misto
- Justificativa obrigatória para saídas
- Filtros por tipo, categoria, data e descrição

### 👗 Uniformes — Festividade e Pandeiro
Controle individual de pagamento de uniformes por participante.
- Registro de valor total, pago (PIX/Dinheiro) e saldo devedor
- Status automático: Pago, Parcial ou Pendente
- Lançamento automático no Caixa ao registrar pagamento
- Filtros por congregação e status

### 🛒 Vendas
Registro de arrecadações por venda de produtos.
- Produtos: Pamonha, Pão, Bolo, Refrigerante, Outros
- Cálculo automático do total (quantidade × unitário)
- Lançamento automático no Caixa
- Filtros por produto e período

### ⛪ Congregações
Cadastro e gerenciamento das congregações.
- Resumo financeiro por congregação
- Contagem de jovens cadastrados
- Total arrecadado em uniformes por grupo

### 👥 Jovens
Cadastro dos participantes por congregação.
- Nome, telefone e congregação
- Busca e filtros por congregação

### 📊 Relatórios
Análises financeiras completas com 7 tipos de relatório:
- **Geral** — visão completa de todas as movimentações
- **Por Período** — filtro por intervalo de datas
- **Por Pagamento** — separação entre PIX e Dinheiro
- **Saídas** — listagem com justificativas
- **Uniformes** — status de pagamento por módulo
- **Vendas** — arrecadação por produto
- **Por Congregação** — comparativo entre grupos

Todos os relatórios possuem botão de impressão.

### 🛡️ Administradores *(somente Super Admin)*
Gerenciamento dos usuários com acesso ao sistema.
- Criação de novos admins com senha padrão `acess@123`
- Troca obrigatória de senha no primeiro acesso (pop-up automático)
- Perfis: Administrador ou Super Admin
- Ativação/desativação de contas
- Badge de indicação para contas com 1º acesso pendente

### 📝 Logs do Sistema
Histórico completo de todas as ações realizadas.
- Registro automático de criações, edições, exclusões e logins
- Filtros por usuário, ação, módulo e data
- Limpeza de logs disponível apenas para Super Admin

---

## 🔐 Primeiro Acesso de Novo Admin

1. O Super Admin cria o usuário com a senha padrão `acess@123`
2. O novo usuário faz login com essa senha
3. Um pop-up abre automaticamente solicitando a criação de uma nova senha
4. Após definir a nova senha, o usuário é direcionado ao Dashboard

---

## 🗂️ Estrutura de Arquivos

```
mensageiros-da-paz/
│
├── index.html                  # Tela de login
├── dashboard.html              # Painel principal
├── caixa.html                  # Controle de caixa
├── jovens.html                 # Cadastro de jovens
├── congregacoes.html           # Gestão de congregações
├── uniforme-festividade.html   # Pagamentos – Festividade
├── uniforme-pandeiro.html      # Pagamentos – Pandeiro
├── vendas.html                 # Registro de vendas
├── relatorios.html             # Relatórios financeiros
├── administradores.html        # Gerenciamento de usuários
├── logs.html                   # Logs do sistema
│
├── css/
│   └── style.css               # Estilos globais (tema claro/escuro)
│
├── js/
│   └── core.js                 # Lógica central (AUTH, DB, LOG, sidebar, ícones)
│
└── img/
    └── logo.png                # Logotipo da organização
```

---

## 💾 Armazenamento de Dados

Todos os dados ficam salvos no `localStorage` do navegador com as seguintes chaves:

| Chave | Conteúdo |
|---|---|
| `mdp_session` | Sessão do usuário logado |
| `mdp_admins` | Lista de administradores |
| `mdp_caixa` | Movimentações financeiras |
| `mdp_congregacoes` | Cadastro de congregações |
| `mdp_mulheres` | Cadastro de jovens |
| `mdp_uniforme_fest` | Registros de Uniforme Festividade |
| `mdp_uniforme_pan` | Registros de Uniforme Pandeiro |
| `mdp_vendas` | Registro de vendas |
| `mdp_logs` | Histórico de ações |
| `mdp_theme` | Preferência de tema (claro/escuro) |

> ⚠️ **Atenção:** os dados são vinculados ao navegador e ao dispositivo. Limpar o cache ou os dados do site apagará todas as informações. Recomenda-se exportar relatórios periodicamente.

---

## 🎨 Temas

O sistema possui modo claro e modo escuro, alternável pelo botão no canto inferior da barra lateral ou na tela de login. A preferência é salva automaticamente.

---

## 🖨️ Impressão

Os relatórios possuem suporte a impressão otimizado. Ao clicar em **Imprimir**, a interface oculta automaticamente os menus e filtros, exibindo apenas o conteúdo do relatório.

---

## 🔧 Tecnologias Utilizadas

- **HTML5, CSS3, JavaScript** — sem frameworks externos
- **localStorage** — persistência de dados no navegador
- **SVG inline** — ícones sem dependências externas
- **Google Fonts** — tipografias Playfair Display e DM Sans

---

## 📌 Observações

- O sistema **não requer internet** após o download — funciona completamente offline
- Compatível com os principais navegadores modernos (Chrome, Firefox, Edge, Safari)
- Não possui backend — todos os dados ficam no dispositivo do usuário
- O usuário **`rayssa`** é o Super Admin padrão e não pode ser excluído
