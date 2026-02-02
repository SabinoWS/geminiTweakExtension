/**
 * Gerenciamento de Estado Global e Storage
 */

let isExtensionEnabled = true;

let featureHistoryEnabled = false;
let featureHistoryLimitEnabled = false;
let featureMyItemsEnabled = false;
let featureGemsEnabled = false;
let featureQuickDeleteEnabled = true;
let featureAlwaysShowMenuEnabled = true;
let featureStartSidebarClosedEnabled = true;

// Clean Interface Features
let featureHideGreetingEnabled = false; // Default false
let featureHideWelcomeEnabled = true;
let featureHidePromptsEnabled = true;

let stateHistoryHidden = true;
let stateHistoryLimited = true; // Default limited to 5
let stateMyItemsHidden = true;
let stateGemsHidden = true;

// Inicialização
chrome.storage.local.get([
    'enabled',
    'featureHistoryHide',
    'featureHistoryLimit',
    'featureMyItemsHide',
    'featureGemsHide',
    'featureQuickDelete',
    'featureAlwaysShowMenu',
    'featureStartSidebarClosed',
    'featureHideGreeting',
    'featureHideWelcome',
    'featureHidePrompts'
], (result) => {
    isExtensionEnabled = result.enabled !== false;

    featureHistoryEnabled = result.featureHistoryHide !== false;
    featureHistoryLimitEnabled = result.featureHistoryLimit !== false;
    featureMyItemsEnabled = result.featureMyItemsHide !== false;
    featureGemsEnabled = result.featureGemsHide !== false;
    featureQuickDeleteEnabled = result.featureQuickDelete !== false;
    featureAlwaysShowMenuEnabled = result.featureAlwaysShowMenu !== false;
    featureStartSidebarClosedEnabled = result.featureStartSidebarClosed !== false;

    // Clean Interface defaults = true (except Greeting)
    featureHideGreetingEnabled = result.featureHideGreeting === true;
    featureHideWelcomeEnabled = result.featureHideWelcome !== false;
    featureHidePromptsEnabled = result.featureHidePrompts !== false;

    // Funções definidas em visuals.js e features/
    if (typeof updateBodyClass === 'function') {
        updateBodyClass('gemini-ext-enabled', isExtensionEnabled);
    }

    if (isExtensionEnabled) {
        if (typeof addModelButtons === 'function') addModelButtons();
        if (typeof handleStartSidebarClosed === 'function') handleStartSidebarClosed(); // Chamada da nova feature

        // Tentar sincronizar modelo do DOM primeiro, depois do storage como fallback
        setTimeout(() => {
            if (typeof syncActiveModelFromDOM === 'function') syncActiveModelFromDOM();

            // Se ainda não detectou, usar o storage como fallback
            setTimeout(() => {
                const hasActive = document.querySelector('.gemini-model-btn.active');
                if (!hasActive && typeof highlightModelButton === 'function') {
                    chrome.storage.local.get(['lastSelectedModelId'], (res) => {
                        if (res.lastSelectedModelId) {
                            highlightModelButton(res.lastSelectedModelId);
                        }
                    });
                }
            }, 500);
        }, 300);
    }

    if (typeof applyVisualOneShot === 'function') applyVisualOneShot();
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        isExtensionEnabled = changes.enabled.newValue;
        if (typeof updateBodyClass === 'function') updateBodyClass('gemini-ext-enabled', isExtensionEnabled);
        if (isExtensionEnabled && typeof addModelButtons === 'function') addModelButtons();
    }

    // Feature: Histórico (Hide All)
    if (changes.featureHistoryHide) {
        featureHistoryEnabled = changes.featureHistoryHide.newValue;
        if (featureHistoryEnabled) stateHistoryHidden = true;
        if (typeof applyVisualOneShot === 'function') applyVisualOneShot();

        if (!featureHistoryEnabled) {
            document.querySelectorAll('.gemini-history-controls').forEach(el => el.remove());
            document.body.classList.remove('gemini-history-hidden');
        } else {
            if (typeof addHideChatsControl === 'function') addHideChatsControl();
        }
    }

    // Feature: Histórico Limit (5 Items)
    if (changes.featureHistoryLimit) {
        featureHistoryLimitEnabled = changes.featureHistoryLimit.newValue;
        if (featureHistoryLimitEnabled) stateHistoryLimited = true;
        if (typeof applyVisualOneShot === 'function') applyVisualOneShot();

        // Re-add controls to update buttons (since layout might change)
        const controls = document.querySelector('.gemini-history-controls');
        if (controls) controls.remove();
        if (featureHistoryEnabled && typeof addLimitChatsControl === 'function') addLimitChatsControl();
        if (featureHistoryEnabled && typeof addHideChatsControl === 'function') addHideChatsControl();
    }

    // Feature: Meus Itens
    if (changes.featureMyItemsHide) {
        featureMyItemsEnabled = changes.featureMyItemsHide.newValue;
        if (featureMyItemsEnabled) stateMyItemsHidden = true;
        if (typeof applyVisualOneShot === 'function') applyVisualOneShot();
        if (!featureMyItemsEnabled) {
            document.querySelectorAll('.gemini-my-items-controls').forEach(el => el.remove());
            document.body.classList.remove('gemini-my-items-hidden');
        } else {
            if (typeof addMyItemsControls === 'function') addMyItemsControls();
        }
    }

    // Feature: Gems
    if (changes.featureGemsHide) {
        featureGemsEnabled = changes.featureGemsHide.newValue;
        if (featureGemsEnabled) stateGemsHidden = true;
        if (typeof applyVisualOneShot === 'function') applyVisualOneShot();
        if (!featureGemsEnabled) {
            document.querySelectorAll('.gemini-gems-controls').forEach(el => el.remove());
            document.body.classList.remove('gemini-gems-hidden');
            document.querySelectorAll('.gemini-gems-list-container').forEach(el => el.classList.remove('gemini-gems-list-container'));
        } else {
            if (typeof addGemsControls === 'function') addGemsControls();
        }
    }

    // Feature: Quick Delete
    if (changes.featureQuickDelete) {
        featureQuickDeleteEnabled = changes.featureQuickDelete.newValue;
        if (featureQuickDeleteEnabled) {
            if (typeof addDeleteChatButtons === 'function') addDeleteChatButtons();
        } else {
            document.querySelectorAll('.gemini-quick-delete-btn').forEach(btn => btn.remove());
        }
    }

    // Feature: Always Show Menu
    if (changes.featureAlwaysShowMenu) {
        featureAlwaysShowMenuEnabled = changes.featureAlwaysShowMenu.newValue;
        if (typeof applyVisualOneShot === 'function') applyVisualOneShot();
    }

    // Feature: Start Sidebar Closed
    if (changes.featureStartSidebarClosed) {
        featureStartSidebarClosedEnabled = changes.featureStartSidebarClosed.newValue;
    }

    // Features: Clean Interface
    if (changes.featureHideGreeting) {
        featureHideGreetingEnabled = changes.featureHideGreeting.newValue;
        if (typeof applyVisualOneShot === 'function') applyVisualOneShot();
    }
    if (changes.featureHideWelcome) {
        featureHideWelcomeEnabled = changes.featureHideWelcome.newValue;
        if (typeof applyVisualOneShot === 'function') applyVisualOneShot();
    }
    if (changes.featureHidePrompts) {
        featureHidePromptsEnabled = changes.featureHidePrompts.newValue;
        if (typeof applyVisualOneShot === 'function') applyVisualOneShot();
    }
});
