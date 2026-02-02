document.addEventListener('DOMContentLoaded', () => {
    const toggleExt = document.getElementById('toggleExt');
    const toggleHistoryFeature = document.getElementById('toggleHistoryFeature');
    const toggleHistoryLimitFeature = document.getElementById('toggleHistoryLimitFeature');
    const toggleMyItemsFeature = document.getElementById('toggleMyItemsFeature');
    const toggleGemsFeature = document.getElementById('toggleGemsFeature');
    const toggleQuickDelete = document.getElementById('toggleQuickDelete');
    const toggleAlwaysShowMenu = document.getElementById('toggleAlwaysShowMenu');

    // Carregar estado salvo
    // Default = true (!== false)
    chrome.storage.local.get([
        'enabled',
        'featureHistoryHide',
        'featureHistoryLimit',
        'featureMyItemsHide',
        'featureGemsHide',
        'featureQuickDelete',
        'featureAlwaysShowMenu'
    ], (result) => {
        toggleExt.checked = result.enabled !== false;

        toggleHistoryFeature.checked = result.featureHistoryHide !== false;
        toggleHistoryLimitFeature.checked = result.featureHistoryLimit !== false;
        toggleMyItemsFeature.checked = result.featureMyItemsHide !== false;
        toggleGemsFeature.checked = result.featureGemsHide !== false;
        toggleQuickDelete.checked = result.featureQuickDelete !== false;
        toggleAlwaysShowMenu.checked = result.featureAlwaysShowMenu !== false;
    });

    // Salvar Toggle Extensão
    toggleExt.addEventListener('change', () => {
        chrome.storage.local.set({ enabled: toggleExt.checked });
    });

    // Salvar Features
    toggleHistoryFeature.addEventListener('change', () => {
        chrome.storage.local.set({ featureHistoryHide: toggleHistoryFeature.checked });
    });

    toggleHistoryLimitFeature.addEventListener('change', () => {
        chrome.storage.local.set({ featureHistoryLimit: toggleHistoryLimitFeature.checked });
    });

    toggleMyItemsFeature.addEventListener('change', () => {
        chrome.storage.local.set({ featureMyItemsHide: toggleMyItemsFeature.checked });
    });

    toggleGemsFeature.addEventListener('change', () => {
        chrome.storage.local.set({ featureGemsHide: toggleGemsFeature.checked });
    });

    toggleQuickDelete.addEventListener('change', () => {
        chrome.storage.local.set({ featureQuickDelete: toggleQuickDelete.checked });
    });

    toggleAlwaysShowMenu.addEventListener('change', () => {
        chrome.storage.local.set({ featureAlwaysShowMenu: toggleAlwaysShowMenu.checked });
    });

    const toggleStartSidebarClosed = document.getElementById('toggleStartSidebarClosed');
    // Clean Interface Toggles
    const toggleHideGreeting = document.getElementById('toggleHideGreeting');
    const toggleHideWelcome = document.getElementById('toggleHideWelcome');
    const toggleHidePrompts = document.getElementById('toggleHidePrompts');

    // Load
    chrome.storage.local.get([
        'featureStartSidebarClosed',
        'featureHideGreeting',
        'featureHideWelcome',
        'featureHidePrompts'
    ], (r) => {
        toggleStartSidebarClosed.checked = r.featureStartSidebarClosed !== false;
        toggleHideGreeting.checked = r.featureHideGreeting === true; // Default False
        toggleHideWelcome.checked = r.featureHideWelcome !== false;
        toggleHidePrompts.checked = r.featureHidePrompts !== false;
    });

    // Save
    toggleStartSidebarClosed.addEventListener('change', () => {
        chrome.storage.local.set({ featureStartSidebarClosed: toggleStartSidebarClosed.checked });
    });

    toggleHideGreeting.addEventListener('change', () => {
        chrome.storage.local.set({ featureHideGreeting: toggleHideGreeting.checked });
    });

    toggleHideWelcome.addEventListener('change', () => {
        chrome.storage.local.set({ featureHideWelcome: toggleHideWelcome.checked });
    });

    toggleHidePrompts.addEventListener('change', () => {
        chrome.storage.local.set({ featureHidePrompts: toggleHidePrompts.checked });
    });

    // Actions Buttons
    const btnReset = document.getElementById('btnReset');
    const btnAllOff = document.getElementById('btnAllOff');
    const btnAllOn = document.getElementById('btnAllOn');

    function updateAll(settings) {
        chrome.storage.local.set(settings, () => {
            // Update UI
            if (settings.enabled !== undefined) toggleExt.checked = settings.enabled;
            if (settings.featureHistoryHide !== undefined) toggleHistoryFeature.checked = settings.featureHistoryHide;
            if (settings.featureHistoryLimit !== undefined) toggleHistoryLimitFeature.checked = settings.featureHistoryLimit;
            if (settings.featureMyItemsHide !== undefined) toggleMyItemsFeature.checked = settings.featureMyItemsHide;
            if (settings.featureGemsHide !== undefined) toggleGemsFeature.checked = settings.featureGemsHide;
            if (settings.featureQuickDelete !== undefined) toggleQuickDelete.checked = settings.featureQuickDelete;
            if (settings.featureAlwaysShowMenu !== undefined) toggleAlwaysShowMenu.checked = settings.featureAlwaysShowMenu;
            if (settings.featureStartSidebarClosed !== undefined) toggleStartSidebarClosed.checked = settings.featureStartSidebarClosed;
            if (settings.featureHideGreeting !== undefined) toggleHideGreeting.checked = settings.featureHideGreeting;
            if (settings.featureHideWelcome !== undefined) toggleHideWelcome.checked = settings.featureHideWelcome;
            if (settings.featureHidePrompts !== undefined) toggleHidePrompts.checked = settings.featureHidePrompts;
        });
    }

    btnReset.addEventListener('click', () => {
        updateAll({
            enabled: true,
            featureHistoryHide: true,
            featureHistoryLimit: true,
            featureMyItemsHide: true,
            featureGemsHide: true,
            featureQuickDelete: true,
            featureAlwaysShowMenu: true,
            featureStartSidebarClosed: true,
            featureHideGreeting: false, // Default False
            featureHideWelcome: true,
            featureHidePrompts: true
        });
    });

    btnAllOff.addEventListener('click', () => {
        updateAll({
            // enabled: true, // Keep extension enabled, just disable features? Or disable ext? 'Desligar Tudo' implies features off.
            // If we disable 'enabled', it kills everything anyway. Let's keep enabled TRUE but features FALSE so user can selectively enable.
            featureHistoryHide: false,
            featureHistoryLimit: false,
            featureMyItemsHide: false,
            featureGemsHide: false,
            featureQuickDelete: false,
            featureAlwaysShowMenu: false,
            featureStartSidebarClosed: false,
            featureHideGreeting: false,
            featureHideWelcome: false,
            featureHidePrompts: false
        });
    });

    btnAllOn.addEventListener('click', () => {
        updateAll({
            enabled: true,
            featureHistoryHide: true,
            featureHistoryLimit: true, // Limit toggled ON usually conflicts with Hide All? Logic handles it (Hide takes precedence).
            featureMyItemsHide: true,
            featureGemsHide: true,
            featureQuickDelete: true,
            featureAlwaysShowMenu: true,
            featureStartSidebarClosed: true,
            featureHideGreeting: true,
            featureHideWelcome: true,
            featureHidePrompts: true
        });
    });
});
