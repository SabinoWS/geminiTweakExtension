/**
 * Main Entry Point - Inicialização e Observadores
 */

const observer = new MutationObserver((mutations) => {
    if (isExtensionEnabled) {
        // Tentativa de usar PageObject para verificar se existe o trigger
        const triggerBtn = document.querySelector(ORIGINAL_SELECTOR_CLASS); // Mantendo original por enquanto para evitar dependencia circular ou loading
        if (triggerBtn && !document.querySelector('.gemini-model-switcher-container')) {
            if (typeof addModelButtons === 'function') addModelButtons();
        }

        // Esconde apenas botões de enviar, não de stop
        // Usamos ChatInterface se disponível, mas como Main carrega por ultimo, deve estar ok.
        // Mas por segurança, vamos deixar seletores diretos aqui ou usar ChatInterface.
        if (typeof ChatInterface !== 'undefined') {
            const sendIcons = ChatInterface.getSendIcons(); // Novo metodo que adicionei mentalmente, preciso garantir que existe no ChatInterface se for usar
            // Vou usar direto querySelectorAll para garantir sem editar o ChatInterface agora se esqueci
            const icons = document.querySelectorAll('[data-mat-icon-name="send"]');
            if (icons.length > 0) {
                const btn = icons[icons.length - 1].closest('button');
                if (btn && !btn.classList.contains('gemini-hidden-send-button')) btn.classList.add('gemini-hidden-send-button');
            }

            const stopButtons = ChatInterface.getStopButtons();
            stopButtons.forEach(btn => btn.classList.remove('gemini-hidden-send-button'));
        }
    }

    if (typeof addHideChatsControl === 'function') addHideChatsControl();
    if (typeof addLimitChatsControl === 'function') addLimitChatsControl();
    if (typeof addMyItemsControls === 'function') addMyItemsControls();
    if (typeof addGemsControls === 'function') addGemsControls();
    if (typeof addDeleteChatButtons === 'function') addDeleteChatButtons();
});

observer.observe(document.body, { childList: true, subtree: true });

// Sincronizar modelo ativo periodicamente (pois o DOM pode mudar ou demorar a carregar)
setInterval(() => {
    if (typeof syncActiveModelFromDOM === 'function') syncActiveModelFromDOM();
}, 1000);
