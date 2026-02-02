/**
 * Page Object: Sidebar
 * Responsável por encontrar elementos na barra lateral (Histórico, Gems, Meus Itens)
 */
const SidebarPage = {
    getHistoryLabel: function () {
        let label = document.querySelector('[data-test-id="conversations-subtitle"], .conversations-subtitle');
        if (!label) {
            const candidates = document.querySelectorAll('.gds-label-l, .gds-label-m, div[role="heading"], span.title');
            for (const el of candidates) {
                const txt = el.innerText?.toLowerCase().trim();
                // "recent" é usado em algumas localizações
                if (txt === 'conversas' || txt === 'chats' || txt === 'recent') {
                    if (el.offsetParent === null) continue;
                    if (el.closest('button') || el.closest('a')) continue;
                    label = el;
                    break;
                }
            }
        }
        if (!label) {
            const divs = document.querySelectorAll('div');
            for (const d of divs) {
                if (d.childNodes.length === 1 && d.childNodes[0].nodeType === 3 && d.innerText.trim().toLowerCase() === 'conversas') {
                    if (d.offsetParent !== null && !d.closest('button')) {
                        label = d;
                        break;
                    }
                }
            }
        }
        return label;
    },

    ensureHistoryControlsContainer: function (label) {
        if (!label) return null;
        let controls = label.querySelector('.gemini-history-controls');
        if (!controls) {
            controls = document.createElement('div');
            controls.className = 'gemini-history-controls';

            label.style.display = 'flex';
            label.style.justifyContent = 'flex-start';
            label.style.alignItems = 'center';
            if (getComputedStyle(label).display === 'inline') label.style.display = 'flex';

            label.appendChild(controls);
        }
        return controls;
    },

    getMyItemsButton: function () {
        const sideNavButtons = document.querySelectorAll('side-nav-entry-button, [role="button"]');
        for (const btn of sideNavButtons) {
            // Verifica o texto interno
            if (btn.innerText.includes('Meus itens')) {
                return btn;
            }
        }
        return null;
    },

    getMyItemsTitleContainer: function (button) {
        if (!button) return null;
        return button.querySelector('.title-container, .gds-label-l') || button;
    },

    getGemsTextNode: function () {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        let count = 0;
        while (node = walker.nextNode()) {
            if (count++ > 5000) break; // Safety break
            if (node.nodeValue.trim() === 'Gems') {
                const parent = node.parentElement;
                // Validar contexto para evitar falsos positivos
                if (parent.closest('side-nav-section') || parent.closest('bot-list') || parent.closest('nav') || parent.closest('colla-list')) {
                    return node;
                }
            }
        }
        return null;
    },

    getGemsContainerToHide: function (textNode) {
        if (!textNode) return null;
        const parent = textNode.parentElement;
        const section = parent.closest('side-nav-section') || parent.closest('bot-list');
        if (section) {
            return section.querySelector('.bots-list-container, .list-container, .items-container');
        }
        return null;
    },

    getToggleButton: function () {
        // Selector confirmado via inspeção: data-test-id="side-nav-menu-button"
        // Classes comuns: main-menu-button
        const exactMatch = document.querySelector('button[data-test-id="side-nav-menu-button"]');
        if (exactMatch) return exactMatch;
        return document.querySelector('button[aria-label="Menu principal"], button.main-menu-button');
    },

    isSidebarOpen: function (btn) {
        // Método 1: Verificar se existe um container de navegação expandido
        // O Gemini costuma usar <side-nav> ou classes como 'side-nav-open' no app
        const sideNav = document.querySelector('side-nav, mat-sidenav, .side-nav');
        if (sideNav) {
            // Se tiver largura > 100px, provavelmente está aberta
            if (sideNav.getBoundingClientRect().width > 100) return true;
        }

        // Método 2: Verificar se a lista de conversas recentes está visível
        // Quando fechado, o histórico consome espaço ou desaparece?
        // Geralmente quando fechado, o menu vira apenas ícones ou some total.
        const historyLabel = this.getHistoryLabel();
        if (historyLabel && historyLabel.offsetParent !== null) return true;

        // Método 3: Fallback para aria-expanded (caso eles voltem a usar)
        if (btn && btn.getAttribute('aria-expanded') === 'true') return true;

        // Método 4 (Empírico): Se não achei nada "aberto", assumo fechado? 
        // Ou melhor, assumir aberto se não tenho certeza para evitar fechar sem querer?
        // Vamos verificar se existe algum texto de menu visível
        const menuTexts = document.querySelectorAll('.gds-label-l, .clickable-label');
        for (const t of menuTexts) {
            if (t.offsetParent !== null) return true;
        }

        return false;
    }
};
