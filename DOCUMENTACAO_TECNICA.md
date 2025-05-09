# Documentação Técnica - Planeja+

## Visão Geral

O Planeja+ é uma aplicação web para planejamento e organização de eventos, permitindo que usuários criem eventos, gerenciem convidados, atribuam itens e acompanhem confirmações. A aplicação foi desenvolvida utilizando tecnologias modernas e segue as melhores práticas de desenvolvimento web.

## Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React com renderização do lado do servidor
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework CSS utilitário
- **Framer Motion**: Biblioteca para animações
- **Shadcn/UI**: Componentes de UI reutilizáveis
- **Lucide React**: Biblioteca de ícones

### Backend
- **Supabase**: Plataforma de backend como serviço
- **PostgreSQL**: Banco de dados relacional
- **Autenticação JWT**: Sistema de autenticação seguro

## Arquitetura do Sistema

O Planeja+ segue uma arquitetura de camadas:

1. **Camada de Apresentação**: Componentes React e páginas Next.js
2. **Camada de Serviços**: Funções que interagem com a API do Supabase
3. **Camada de Dados**: Banco de dados PostgreSQL gerenciado pelo Supabase

### Diagrama de Arquitetura

\`\`\`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Componentes    │────▶│    Serviços     │────▶│    Supabase     │
│     React       │     │                 │     │   (PostgreSQL)  │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
\`\`\`

## Estrutura do Banco de Dados

### Tabelas Principais

1. **users**: Armazena informações dos usuários
   - `id`: UUID (chave primária)
   - `email`: VARCHAR(255) (único)
   - `name`: VARCHAR(255)
   - `password_hash`: VARCHAR(255)
   - `profile_photo`: TEXT
   - `created_at`: TIMESTAMP
   - `updated_at`: TIMESTAMP

2. **contacts**: Armazena contatos dos usuários
   - `id`: UUID (chave primária)
   - `user_id`: UUID (chave estrangeira para users)
   - `name`: VARCHAR(255)
   - `email`: VARCHAR(255)
   - `phone`: VARCHAR(20)
   - `is_favorite`: BOOLEAN
   - `created_at`: TIMESTAMP
   - `updated_at`: TIMESTAMP

3. **events**: Armazena eventos criados pelos usuários
   - `id`: UUID (chave primária)
   - `user_id`: UUID (chave estrangeira para users)
   - `title`: VARCHAR(255)
   - `type`: VARCHAR(50)
   - `date`: DATE
   - `time`: TIME
   - `location`: TEXT
   - `description`: TEXT
   - `created_at`: TIMESTAMP
   - `updated_at`: TIMESTAMP

4. **guests**: Armazena convidados dos eventos
   - `id`: UUID (chave primária)
   - `event_id`: UUID (chave estrangeira para events)
   - `name`: VARCHAR(255)
   - `email`: VARCHAR(255)
   - `phone`: VARCHAR(20)
   - `status`: VARCHAR(20)
   - `invite_sent_at`: TIMESTAMP
   - `created_at`: TIMESTAMP
   - `updated_at`: TIMESTAMP

5. **items**: Armazena itens dos eventos
   - `id`: UUID (chave primária)
   - `event_id`: UUID (chave estrangeira para events)
   - `name`: VARCHAR(255)
   - `price`: DECIMAL(10, 2)
   - `image`: TEXT
   - `created_at`: TIMESTAMP
   - `updated_at`: TIMESTAMP

6. **item_assignments**: Armazena atribuições de itens a convidados
   - `id`: UUID (chave primária)
   - `item_id`: UUID (chave estrangeira para items)
   - `guest_id`: UUID (chave estrangeira para guests)
   - `contact_id`: UUID (chave estrangeira para contacts)
   - `name`: VARCHAR(255)
   - `created_at`: TIMESTAMP
   - `updated_at`: TIMESTAMP

7. **notification_settings**: Armazena configurações de notificação dos usuários
   - `id`: UUID (chave primária)
   - `user_id`: UUID (chave estrangeira para users)
   - `email_notifications`: BOOLEAN
   - `push_notifications`: BOOLEAN
   - `event_reminders`: BOOLEAN
   - `guest_updates`: BOOLEAN
   - `created_at`: TIMESTAMP
   - `updated_at`: TIMESTAMP

### Diagrama de Relacionamento de Entidades (ERD)

\`\`\`
┌─────────┐       ┌─────────┐       ┌─────────┐
│         │       │         │       │         │
│  users  │──1─┬─N│ events  │──1─┬─N│ guests  │
│         │    │  │         │    │  │         │
└─────────┘    │  └─────────┘    │  └─────────┘
     │         │       │         │       │
     │         │       │         │       │
     │         │       │         │       │
     │         │  ┌────▼────┐    │       │
     │         └─N│         │    │       │
     └────1─┬─N┐  │  items  │◀───┘       │
            │  │  │         │            │
┌─────────┐ │  │  └─────────┘            │
│         │ │  │       │                 │
│contacts │◀┘  │       │                 │
│         │    │       │                 │
└─────────┘    │  ┌────▼────────┐        │
     │         └─N│              │◀───────┘
     └────────────┤item_assignments│
                  │              │
                  └──────────────┘
\`\`\`

## Funcionalidades Principais

### Autenticação e Perfil
- Registro de usuários
- Login com email e senha
- Gerenciamento de perfil
- Upload de foto de perfil

### Gerenciamento de Contatos
- Adicionar, editar e excluir contatos
- Marcar contatos como favoritos
- Buscar contatos

### Gerenciamento de Eventos
- Criar, editar e excluir eventos
- Definir tipo de evento (Festa ou Colaborativo)
- Adicionar detalhes como data, hora e local

### Gerenciamento de Convidados
- Adicionar convidados individualmente ou em massa
- Enviar convites por email e SMS
- Acompanhar confirmações
- Importar convidados da lista de contatos

### Gerenciamento de Itens
- Adicionar itens ao evento
- Definir preços
- Atribuir responsáveis
- Upload de fotos dos itens

### Notificações
- Configurar preferências de notificação
- Receber atualizações sobre confirmações
- Lembretes de eventos

## Fluxos de Usuário

### Fluxo de Criação de Evento
1. Usuário faz login na plataforma
2. Acessa a página de dashboard
3. Clica em "Criar novo evento"
4. Preenche os detalhes do evento
5. Salva o evento
6. É redirecionado para a página do evento

### Fluxo de Adição de Convidados
1. Usuário acessa a página do evento
2. Clica na aba "Convidados"
3. Clica em "Adicionar convidados"
4. Seleciona contatos existentes ou adiciona novos convidados
5. Envia convites

### Fluxo de Confirmação de Presença
1. Convidado recebe convite por email ou SMS
2. Clica no link de confirmação
3. Visualiza os detalhes do evento
4. Confirma ou recusa presença
5. Recebe confirmação da ação

## Segurança

### Autenticação
- Senhas armazenadas com hash seguro
- Tokens JWT para autenticação
- Sessões gerenciadas pelo Supabase

### Autorização
- Controle de acesso baseado em usuário
- Verificação de propriedade de recursos
- Políticas de segurança no nível do banco de dados (RLS)

### Proteção de Dados
- Validação de entrada de dados
- Sanitização de saída
- Proteção contra injeção SQL

## Desempenho e Escalabilidade

### Otimizações de Desempenho
- Componentes React otimizados
- Carregamento sob demanda
- Índices no banco de dados para consultas frequentes

### Estratégias de Escalabilidade
- Arquitetura serverless
- Banco de dados PostgreSQL escalável
- Cache de dados frequentemente acessados

## Considerações de Acessibilidade

- Contraste de cores adequado
- Suporte a navegação por teclado
- Textos alternativos para imagens
- Estrutura semântica HTML
- Suporte a leitores de tela

## Futuras Melhorias

- Integração com calendários externos (Google, Outlook)
- Sistema de pagamentos para eventos colaborativos
- Aplicativo móvel nativo
- Notificações push
- Integração com WhatsApp para convites
- Estatísticas e análises de eventos
- Templates personalizáveis para convites
- Galeria de fotos do evento
- Chat entre participantes
- QR Code para check-in

## Conclusão

O Planeja+ é uma aplicação robusta e escalável para gerenciamento de eventos, construída com tecnologias modernas e seguindo as melhores práticas de desenvolvimento. A integração com o Supabase proporciona um backend poderoso e seguro, enquanto a interface de usuário intuitiva e responsiva oferece uma excelente experiência para os usuários.
