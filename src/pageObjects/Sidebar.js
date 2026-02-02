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
    }
};
