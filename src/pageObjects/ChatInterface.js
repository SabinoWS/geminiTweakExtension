/**
 * Page Object: ChatInterface
 * Responsável por encontrar elementos na área de chat e input (Modelo, Enviar, Stop)
 */
const ChatInterface = {
    // defined in config.js but we access it here
    getModelSwitcherTrigger: function () {
        return document.querySelector(ORIGINAL_SELECTOR_CLASS);
    },

    getModelOption: function (id) {
        return document.querySelector(`[data-test-id="${id}"]`);
    },

    getSendButton: function () {
        // Tenta vários seletores conhecidos
        const sendSelectors = ['.send-button', 'button[aria-label="Enviar"]', 'button[aria-label="Send message"]'];
        for (const selector of sendSelectors) {
            const el = document.querySelector(selector);
            if (el) return el;
        }
        // Fallback pelos ícones
        const icons = document.querySelectorAll('[data-mat-icon-name="send"]');
        if (icons.length > 0) return icons[icons.length - 1].closest('button');
        return null;
    },

    // Encontra botões que eram "send" mas viraram "stop" (durante geração)
    getStopButtons: function () {
        return document.querySelectorAll('.gemini-hidden-send-button:has([data-mat-icon-name="stop"])');
    },

    getSendIcons: function () {
        return document.querySelectorAll('[data-mat-icon-name="send"]');
    }
};
