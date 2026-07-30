# 🚀 Dizevolv Reservas — Central Inteligente de Agendamento de Salas

> Aplicação web full-stack de alta performance desenvolvida para resolver conflitos de agenda em salas de reunião corporativas. Projeto desenvolvido como parte do processo seletivo para Desenvolvedora da **Dizevolv**.
> 
> 

---

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando tecnologias modernas e tipagem rigorosa de ponta a ponta:

* **Front-end & Framework:** Next.js (App Router) com React e TypeScript.


* **Estilização & UI:** Tailwind CSS, componentes customizados e ícones via `lucide-react`.
* **Camada de API & Regras de Negócio:** Next.js Server Actions (API própria rodando estritamente no servidor).


* **Banco de Dados & ORM:** PostgreSQL hospedado no **Supabase**, gerenciado via **Prisma ORM**.



---

## 📋 O que foi implementado (Escopo do Piso & Diferenciais)

### 🟢 Requisitos Obrigatórios (100% Atendidos)

1. **CRUD de Reservas Completo:** Persistência total no banco de dados para criar, listar, editar (com modal dinâmico e botão de edição dedicado) e remover reservas.


2. **Listagem com Filtros e Ordenação:** Filtro instantâneo por sala específica na barra lateral e ordenação cronológica automática por horário.


3. **Estados Derivados da Resposta:** Cálculo dinâmico e em tempo real dos status das reuniões (*"Ao vivo/Em andamento"*, *"Agendado"* e *"Concluído"*).


4. **Validações Consistentes:** Bloqueio de horários fora do expediente comercial (09h às 18h), restrição de agendamentos em finais de semana, validação de capacidade máxima por sala e impedimento de horários de término retroativos ao início.


5. **CRUD de Salas:** Interface integrada no cabeçalho (*Gerenciar Salas*) para cadastrar novas salas informando nome e capacidade, além de removê-las com segurança.


6. **Camada de API Própria com Checagem no Servidor:** Validação matemática de sobreposição executada diretamente nas Server Actions do Next.js via Prisma antes de persistir no Supabase.


7. **Deploy Acessível:** Projeto pronto e estruturado para deploy contínuo na Vercel.



### ⭐ Diferenciais Adicionados

* **Visualização em Calendário / Agenda Geral:** Botão de alternância na interface permitindo alternar entre o modo de cartões de salas e uma **Visão de Calendário** agrupada por dias da semana.


* **Autenticação com Soft Login:** Sistema de identificação de usuário integrado ao armazenamento local (`localStorage`) para registrar o responsável por cada agendamento.



---

## 🏛️ Decisões de Arquitetura & Premissas de Produto

Conforme solicitado no desafio, as premissas e decisões de design assumidas para cenários não especificados foram estruturadas da seguinte forma:

* **Reservas que encostam (Buffer de 10 minutos):**
* *Decisão:* Adotamos um **buffer obrigatório de 10 minutos** entre reuniões consecutivas na mesma sala. Se uma reserva encerra às 11:00, a próxima só poderá iniciar a partir das 11:10. Isso garante tempo hábil para troca de participantes, higienização e organização do espaço corporativo sem atritos.


* **Horário de Funcionamento & Finais de Semana:**
* *Decisão:* O sistema restringe agendamentos estritamente para **dias úteis (segunda a sexta-feira)** e dentro do **horário comercial (09:00 às 18:00)**. Tentativas de agendar de madrugada ou em fins de semana são bloqueadas com mensagens de feedback claras.




* **Capacidade da Sala:**
* *Decisão:* Bloqueio rígido no front-end e no servidor. O sistema impede a confirmação da reserva caso o número de participantes informado ultrapasse a capacidade máxima cadastrada para aquela sala.




* **Edição de Reservas Conflitantes:**
* *Decisão:* Ao editar uma reserva existente, o algoritmo de checagem no servidor desconsidera temporariamente o ID da própria reserva que está sendo modificada, validando se o novo intervalo colide com *outros* agendamentos ativos na sala. Caso haja conflito, a edição é rejeitada e um alerta visual é retornado.




* **Comunicação de Conflitos ao Usuário:**
* *Decisão:* Utilização de um sistema de notificações flutuantes (*Toasts*) e mensagens de erro estilizadas dentro do próprio formulário do modal, indicando exatamente o motivo da recusa (ex: *"A sala precisa de um intervalo de pelo menos 10 minutos entre as reservas!"*).





---

## 🧠 Pergunta de Raciocínio: Como evoluir para Reservas Recorrentes?

Para suportar agendamentos recorrentes (ex: *"toda terça-feira às 14h, pelos próximos 3 meses"*), a evolução do sistema exigiria os seguintes pilares:

1. **Modelo de Dados (Banco de Dados):**
* Adicionar uma tabela ou campo de agrupamento (ex: `recurrenceGroupId` ou uma tabela `RecurrenceRule`) contendo a regra de repetição: frequência (`WEEKLY`, `DAILY`), dias da semana aplicáveis, data de início e data de término.
* Cada ocorrência gerada seria persistida como uma linha individual na tabela de `Booking`, vinculada ao mesmo grupo, permitindo gerenciar ou cancelar uma ocorrência isolada ou a série inteira.


2. **Checagem de Conflito em Lote (Batch Validation):**
* No servidor, ao requisitar uma série recorrente (ex: 12 semanas consecutivas), a API executaria uma validação transacional prévia (`Transaction`) verificando a disponibilidade com o buffer de 10 minutos para **todas** as datas projetadas. Se **apenas um** dos dias da série apresentar conflito, toda a operação é abortada antecipadamente para evitar agendamentos parciais inconsistentes.



---

## ⚙️ Passo a Passo de Setup (Como rodar do zero)

Siga os passos abaixo para clonar e executar o projeto em sua máquina:

### 1. Pré-requisitos

* Node.js (versão 18 ou superior instalada).
* Uma instância de banco de dados PostgreSQL (recomenda-se criar um projeto gratuito no [Supabase](https://supabase.com/)).



### 2. Clonar o repositório e instalar dependências

```bash
git clone https://github.com/seu-usuario/dizevolv-reservas.git
cd dizevolv-reservas/front
npm install

```

### 3. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `front` contendo a URL de conexão do seu banco PostgreSQL (Supabase/Neon):

```env
DATABASE_URL="postgresql://postgres.seu_usuario:sua_senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.seu_usuario:sua_senha@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

```

### 4. Executar as Migrations do Banco de Dados

```bash
npx prisma db push

```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev

```

Acesse a aplicação no navegador em: `http://localhost:3000` 🚀