# 🥾 Calendário de Trilhas

Sistema desenvolvido para gerenciamento de trilhas, permitindo organizar eventos, visualizar previsões do tempo e acompanhar atividades em um calendário mensal.

---

# 📸 Preview

(Imagem do sistema)

---

# ✨ Funcionalidades

## 📅 Calendário

- Navegação entre meses
- Botão Hoje
- Destaque para o dia atual
- Atualização automática do clima
- Painel lateral inteligente

---

## 📌 Eventos

- Criar
- Editar
- Excluir
- Local
- Descrição
- Status
- Persistência em LocalStorage

Status disponíveis:

🟢 Confirmado

🔵 Lançado

🔴 Cancelado

---

## 🌤️ Clima

Integração com duas APIs:

- OpenWeather
- Open-Meteo

### Estratégia utilizada

OpenWeather
↓
Previsão de curto prazo

↓

Open-Meteo
↓
Previsão de longo prazo

As previsões são unificadas automaticamente.

---

## ☀️ Classificação personalizada

Ao invés de utilizar diretamente o código diário da API, o sistema analisa os dados horários.

Prioridade:

1. Temporal
2. Chuva forte
3. Chuva
4. Muito sol
5. Sol
6. Nublado

Isso gera uma previsão mais próxima da realidade para planejamento de trilhas.

---

# 🛠️ Tecnologias

- HTML
- CSS
- JavaScript
- Vite

APIs

- OpenWeather
- Open-Meteo

---

# 📂 Estrutura

src/

components/

services/

utils/

assets/

---

# 📖 Arquitetura

Calendário
│
├── Eventos
│
├── Clima
│ │
│ ├── OpenWeather
│ └── Open-Meteo
│
└── LocalStorage

---

# 🎨 Interface

Tema escuro

Paleta baseada em:

- Preto
- Grafite
- Cinza
- Laranja

O laranja é utilizado apenas para elementos de destaque.

---

# 🚀 Funcionalidades implementadas

- ✅ Calendário mensal
- ✅ CRUD de eventos
- ✅ Painel lateral
- ✅ LocalStorage
- ✅ Atualização automática
- ✅ Integração com APIs meteorológicas
- ✅ Classificação inteligente do clima
- ✅ Interface responsiva para desktop

---

# 🔄 Próximas melhorias

- Componentização
- Melhorias no painel lateral
- Responsividade mobile
- Refatoração da arquitetura
- Otimizações de desempenho

---

# 👨‍💻 Autor

Raphael Siqueira de Souza Lanfredi

Projeto desenvolvido para estudo, prática de desenvolvimento front-end e organização de trilhas.
