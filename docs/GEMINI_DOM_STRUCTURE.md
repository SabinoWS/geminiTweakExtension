# 📐 Estrutura DOM do Google Gemini

> **Última atualização:** 2026-02-01  
> **Versão do Gemini:** Interface web atual

Este documento descreve a estrutura HTML/DOM do site do Google Gemini para facilitar manutenção e novas funcionalidades da extensão.

---

## 🏗️ Visão Geral da Sidebar

A sidebar do Gemini contém as seguintes seções principais:

```
<infinite-scroller>
├── [Header: Nova Conversa]
├── [Seção: Meus Itens]
├── [Seção: Gems]
├── [Seção: Histórico de Conversas]
└── <div class="loading-content-spinner-container">  <!-- Spinner de lazy loading -->
</infinite-scroller>
```

---

## 📦 Seções Detalhadas

### 1. Meus Itens

```html
<div class="side-nav-entry-container">
  <side-nav-entry-button>
    <button>
      <span>Meus itens</span>
      <!-- Aqui injetamos .gemini-my-items-controls -->
    </button>
  </side-nav-entry-button>
  
  <my-stuff-recents-preview>
    <!-- Conteúdo de itens recentes -->
    <!-- ALVO DO BLUR: my-stuff-recents-preview -->
  </my-stuff-recents-preview>
</div>
```

**Seletor para blur:** `my-stuff-recents-preview`

---

### 2. Gems

```html
<div class="side-nav-entry-container">
  <side-nav-entry-button>
    <button>
      <span>Gems</span>
      <!-- Aqui injetamos .gemini-gems-controls -->
    </button>
  </side-nav-entry-button>
  
  <div class="gemini-gems-list-container">
    <!-- Lista de Gems -->
    <!-- ALVO DO BLUR: .gemini-gems-list-container -->
  </div>
</div>
```

**Seletor para blur:** `.gemini-gems-list-container`

> **Nota:** O seletor `.gemini-gems-list-container` é uma classe que adicionamos via JavaScript, pois o container original não tem uma classe única.

---

### 3. Histórico de Conversas

Esta é a seção mais complexa:

```html
<div class="chat-history">
  <!-- Título "Conversas" -->
  <div class="conversations-subtitle">
    <span>Conversas</span>
    <!-- Aqui injetamos .gemini-history-controls (botões de olho e filtro) -->
  </div>
  
  <!-- Container principal das conversas -->
  <div class="conversations-container">
    
    <!-- IMPORTANTE: Cada conversa tem seu próprio wrapper! -->
    <div class="conversation-items-container">  <!-- 1ª conversa -->
      <a class="conversation mat-ripple">
        <span class="conversation-title">Título da Conversa 1</span>
      </a>
      <div class="conversation-actions-container">
        <!-- Menu de ações (deletar, fixar, etc.) -->
      </div>
    </div>
    
    <div class="conversation-items-container">  <!-- 2ª conversa -->
      <a class="conversation mat-ripple">...</a>
      <div class="conversation-actions-container">...</div>
    </div>
    
    <div class="conversation-items-container">  <!-- 3ª conversa -->
      ...
    </div>
    
    <!-- ... e assim por diante -->
    
  </div>
</div>

<!-- FORA do .chat-history, é irmão dele! -->
<div class="loading-content-spinner-container">
  <!-- Spinner de loading do lazy load -->
</div>
```

**Seletores importantes:**

| Seletor | Uso | Notas |
|---------|-----|-------|
| `.chat-history` | Container geral | Inclui título e lista |
| `.conversations-container` | Lista de conversas | Contém todos os wrappers |
| `.conversation-items-container` | Wrapper de CADA conversa | Um por conversa! |
| `a.conversation` | Link da conversa | Dentro do wrapper |
| `.loading-content-spinner-container` | Spinner de loading | **FORA** do .chat-history |

---

## 🎯 Seletores CSS Usados na Extensão

### Blur Completo do Histórico
```css
body.gemini-history-hidden .conversation-items-container {
  filter: blur(10px);
  /* ... */
}
```

### Limite de 5 Conversas
```css
body.gemini-history-limited .conversations-container > .conversation-items-container:nth-child(n+6) {
  filter: blur(8px);
  /* ... */
}
```

> **Por que `nth-child` no wrapper?**  
> Cada `a.conversation` é o **único filho** do seu `.conversation-items-container`.  
> Portanto, `a:nth-child(n+6)` nunca funcionaria.  
> Precisamos selecionar o **wrapper** a partir do 6º.

---

## 🔄 Lazy Loading

O Gemini usa `IntersectionObserver` para carregar conversas conforme o usuário faz scroll.

**Comportamento:**
1. Exibe lista inicial de ~10-20 conversas
2. Quando o spinner entra na viewport, carrega mais
3. Repete até acabar o histórico

**Problema anterior:**
- Usar `display: none` removia elementos do layout
- O Gemini pensava que precisava carregar mais
- Resultava em loop infinito de loading

**Solução atual:**
- Usar `filter: blur()` mantém elementos no layout
- Lazy loading funciona normalmente
- Conteúdo fica ilegível mas presente

---

## 🔍 Como Inspecionar Mudanças

Se o Gemini atualizar a interface, use este JavaScript no console:

```javascript
// Encontrar containers de conversa
document.querySelectorAll('.conversation-items-container')

// Ver estrutura do primeiro item
const first = document.querySelector('.conversation-items-container');
console.log({
  parent: first.parentElement.className,
  children: Array.from(first.children).map(c => c.tagName + '.' + c.className)
});

// Encontrar spinner de loading
document.querySelector('.loading-content-spinner-container')

// Ver hierarquia completa
const conv = document.querySelector('a.conversation');
let el = conv;
while (el && el !== document.body) {
  console.log(el.tagName + '.' + el.className);
  el = el.parentElement;
}
```

---

## ⚠️ Pontos de Atenção

1. **Spinner fora do container**
   - O `.loading-content-spinner-container` é irmão de `.chat-history`, não filho
   - Se precisar ocultá-lo, precisa de regra CSS separada

2. **Um wrapper por conversa**
   - Diferente de uma lista simples `<ul><li>...</li></ul>`
   - Cada conversa tem seu próprio `.conversation-items-container`

3. **Classes dinâmicas**
   - O Gemini usa classes do Angular Material (`mat-ripple`, `mat-mdc-*`)
   - Evite depender dessas classes, podem mudar

4. **Lazy loading sensível**
   - Não usar `display: none` em elementos observados
   - Preferir `visibility: hidden` ou `filter: blur()`

---

## 📅 Histórico de Mudanças do Gemini

| Data | Mudança Observada |
|------|-------------------|
| 2026-02-01 | Estrutura documentada pela primeira vez |

---