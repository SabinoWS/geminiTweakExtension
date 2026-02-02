/**
 * Page Object: ChatList
 * Responsável por encontrar elementos na lista de conversas recentes
 */
const ChatList = {
    getConversationContainers: function () {
        return document.querySelectorAll('.conversation-items-container');
    },

    getConversationLink: function (container) {
        if (!container) return null;
        return container.querySelector('a.conversation');
    },

    getMenuButton: function (container) {
        if (!container) return null;
        return container.querySelector('button.conversation-actions-menu-button') ||
            container.querySelector('button[data-test-id="actions-menu-button"]') ||
            container.querySelector('button[aria-label*="menu"]');
    },

    getDeleteMenuItem: function () {
        const menuItems = document.querySelectorAll('button[role="menuitem"]');
        for (const item of menuItems) {
            const txt = item.innerText || '';
            if (txt.includes('Excluir') || txt.includes('Delete')) {
                return item;
            }
        }
        return null;
    }
};
