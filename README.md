# 🔧 Gemini Tweak Extension

Extensão do Chrome para personalizar a interface do **Google Gemini** com controles de privacidade e atalhos de produtividade.

---

## � Funcionalidades

### 🎛️ Seletor de Modelos Rápido

![Seletor de Modelos](screenshots/buttonsPreview.png)

- Botões de acesso rápido para alternar entre os modelos do Gemini:
  - ⚡ **Rápido** - Respostas mais velozes
  - 🧠 **Raciocínio** - Melhor para tarefas complexas
  - 💎 **Pro** - Modelo mais avançado

> Modelos são acessíveis diretamente por botões (sem menu dropdown) e o status do último modelo utilizado é salvo e restaurado automaticamente ao retornar à página.

### 🔒 Controles de Privacidade (Blur/Censura)

![Controles de Privacidade](screenshots/blurPreview.png)

Oculta seções da sidebar com efeito de blur para maior privacidade:

| Seção | Descrição |
|-------|-----------|
| **Meus Itens** | Oculta a seção de itens recentes |
| **Gems** | Oculta a lista de Gems personalizados |
| **Histórico de Conversas** | Oculta ou limita as conversas visíveis |

#### Modos do Histórico:
- 👁️ **Visível** - Mostra todas as conversas
- 🔢 **Limitado** - Mostra apenas as 5 primeiras conversas (blur nas demais)
- 🚫 **Oculto** - Aplica blur em todo o histórico

> **Nota:** Usamos blur ao invés de `display: none` para manter o lazy loading do Gemini funcionando corretamente.

### 🗑️ Exclusão Rápida de Conversas

![Exclusão Rápida](screenshots/fastDeletePreview.png)

- Adiciona um **botão de lixeira** ao lado de cada conversa.
- Permite excluir conversas rapidamente sem confirmação manual (o fluxo é automatizado).
- **Menu sempre visível**: Tanto a lixeira quanto o menu de 3 pontos ficam fixos, facilitando o acesso.
- Cores de ícones adaptadas para tema Claro e Escuro.

---

## 🚀 Instalação

1. Clone ou baixe este repositório
2. Abra o Chrome e vá para `chrome://extensions/`
3. Ative o **Modo de desenvolvedor** (canto superior direito)
4. Clique em **Carregar sem compactação**
5. Selecione a pasta do projeto

---

## 📁 Estrutura do Projeto

```
geminiExtension/
├── manifest.json      # Configurações da extensão
├── popup.html         # Interface do popup de configurações
├── popup.js           # Lógica do popup
├── styles.css         # Estilos CSS globais
├── src/               # Código fonte modularizado
│   ├── config/        # Configurações e constantes
│   ├── features/      # Funcionalidades (Botões, Sidebar, etc)
│   ├── pageObjects/   # Seletores e abstração do DOM
│   ├── states/        # Gerenciamento de estado
│   └── utils/         # Funções utilitárias
├── README.md          # Este arquivo
├── screenshots/       # Imagens de preview
└── docs/              # Documentação técnica
```

---

## ⚙️ Configurações

![Popup de Configurações](screenshots/modalPreview.png)

No topo do popup, você encontra botões de **Ação Rápida**:
- **Padrão**: Restaura as configurações originais da extensão.
- **Desligar Tudo**: Desativa todas as funcionalidades.
- **Ligar Tudo**: Ativa todas as funcionalidades.

Abaixo, as opções detalhadas:

| categoria | Opção | Descrição |
|-----------|-------|-----------|
| **Geral** | Botões Alternativos | Ativa os botões de troca rápida de modelo no topo |
| | Iniciar Sidebar Fechada | Fecha a sidebar automaticamente ao carregar a página |
| **Clean UI** | Esconder Saudação | Remove a mensagem "Olá, usuário" |
| | Esconder Boas-vindas | Remove o texto de boas-vindas inicial |
| | Esconder Sugestões | Remove os cards de sugestão de prompts |
| **Visibilidade**| Esconder Histórico | Aplica blur/oculta a lista de conversas recentes |
| | Limitar Histórico (5) | Exibe apenas os 5 itens mais recentes |
| | Esconder Meus Itens | Oculta a seção "Meus Itens" |
| | Esconder Gems | Oculta a seção "Gems" |
| **Produtividade**| Exclusão Rápida | Adiciona ícone de lixeira para deletar sem confirmação |
| | Menu Sempre Visível | Mantém o menu (3 pontos) sempre visível, sem precisar de hover |

---

## 🎨 Tecnologias

- **Manifest V3** - Formato mais recente para extensões Chrome
- **Vanilla JavaScript** - Sem dependências externas
- **CSS puro** - Efeitos de blur e transições

---

## 📝 Changelog

### v1.4 (2026-02-01)
- ✨ Adicionada **Exclusão Rápida** de conversas (lixeira)
- 🎨 Menu de conversas (3 pontos) agora fica **sempre visível**
- 🎨 Ícones com cores adaptativas automatica para temas Claro e Escuro
- 🐛 Ajustes de layout para evitar sobreposição de texto

### v1.3 (2026-02-01)
- ✨ Renomeado para "Gemini Tweak Extension"
- 🔧 Implementado sistema de blur ao invés de display:none
- 🐛 Corrigido problema de lazy loading infinito
- 📚 Adicionada documentação da estrutura DOM

### v1.2
- ➕ Adicionados controles de privacidade (Meus Itens, Gems, Histórico)
- ➕ Modo de limite de 5 conversas

### v1.0
- 🎉 Versão inicial com seletor de modelos

---

## 🤝 Contribuição

Contribuições são bem-vindas! Antes de modificar, consulte a documentação da estrutura DOM em `docs/GEMINI_DOM_STRUCTURE.md`.

---

## 📄 Licença

Este projeto é de uso pessoal. Use por sua conta e risco.

---

## ⚠️ Aviso

Esta extensão não é afiliada ao Google. O Gemini pode atualizar sua interface a qualquer momento, o que pode quebrar funcionalidades desta extensão.
