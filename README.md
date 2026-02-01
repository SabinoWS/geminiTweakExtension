# 🔧 Gemini Tweak Extension

Extensão do Chrome para personalizar a interface do **Google Gemini** com controles de privacidade e atalhos de produtividade.

---

## 📋 Funcionalidades

### 🎛️ Seletor de Modelos Rápido
- Botões de acesso rápido para alternar entre os modelos do Gemini:
  - ⚡ **Rápido** - Respostas mais velozes
  - 🧠 **Raciocínio** - Melhor para tarefas complexas
  - 💎 **Pro** - Modelo mais avançado

### 🔒 Controles de Privacidade (Blur/Censura)
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
├── content.js         # Script injetado no Gemini
├── styles.css         # Estilos CSS (blur, botões, etc.)
├── popup.html         # Interface do popup de configurações
├── popup.js           # Lógica do popup
├── README.md          # Este arquivo
└── docs/
    └── GEMINI_DOM_STRUCTURE.md  # Documentação da estrutura HTML do Gemini
```

---

## ⚙️ Configurações

Clique no ícone da extensão para acessar as configurações:

| Opção | Descrição | Padrão |
|-------|-----------|--------|
| Extensão Ativada | Liga/desliga toda a extensão | ✅ Ativo |
| Ocultar Meus Itens | Aplica blur na seção "Meus Itens" | ✅ Ativo |
| Ocultar Gems | Aplica blur na seção "Gems" | ✅ Ativo |
| Ocultar Histórico | Aplica blur no histórico de conversas | ✅ Ativo |
| Limitar a 5 | Mostra apenas 5 conversas, blur nas demais | ✅ Ativo |

---

## 🎨 Tecnologias

- **Manifest V3** - Formato mais recente para extensões Chrome
- **Vanilla JavaScript** - Sem dependências externas
- **CSS puro** - Efeitos de blur e transições

---

## 📝 Changelog

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
