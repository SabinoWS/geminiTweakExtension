document.addEventListener('DOMContentLoaded', () => {
    const toggleExt = document.getElementById('toggleExt');
    const toggleHistoryFeature = document.getElementById('toggleHistoryFeature');
    const toggleHistoryLimitFeature = document.getElementById('toggleHistoryLimitFeature');
    const toggleMyItemsFeature = document.getElementById('toggleMyItemsFeature');
    const toggleGemsFeature = document.getElementById('toggleGemsFeature');
    const toggleQuickDelete = document.getElementById('toggleQuickDelete');
    const toggleAlwaysShowMenu = document.getElementById('toggleAlwaysShowMenu');

    // Carregar estado salvo
    chrome.storage.local.get([
        'enabled',
        'featureHistoryHide',
        'featureHistoryLimit',
        'featureMyItemsHide',
        'featureGemsHide',
        'featureQuickDelete',
        'featureAlwaysShowMenu',
        'userLanguage'
    ], (result) => {
        toggleExt.checked = result.enabled !== false;
        toggleHistoryFeature.checked = result.featureHistoryHide !== false;
        toggleHistoryLimitFeature.checked = result.featureHistoryLimit !== false;
        toggleMyItemsFeature.checked = result.featureMyItemsHide !== false;
        toggleGemsFeature.checked = result.featureGemsHide !== false;
        toggleQuickDelete.checked = result.featureQuickDelete !== false;
        toggleAlwaysShowMenu.checked = result.featureAlwaysShowMenu !== false;

        // Set Language
        if (result.userLanguage) {
            currentLanguage = result.userLanguage;
        }
        updateLanguageUI();
    });

    // Language Handling
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            currentLanguage = lang;
            chrome.storage.local.set({ userLanguage: lang });
            updateLanguageUI();
        });
    });

    function updateLanguageUI() {
        // Update Buttons Active State
        langBtns.forEach(btn => {
            if (btn.dataset.lang === currentLanguage) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Update Texts
        setText('lbl_group_general', 'group_general');
        setText('lbl_opt_alt_buttons', 'opt_alt_buttons');
        setText('lbl_opt_sidebar_closed', 'opt_sidebar_closed');
        setText('lbl_group_clean', 'group_clean');
        setText('lbl_opt_hide_greeting', 'opt_hide_greeting');
        setText('lbl_opt_hide_welcome', 'opt_hide_welcome');
        setText('lbl_opt_hide_prompts', 'opt_hide_prompts');
        setText('lbl_group_visibility', 'group_visibility');
        setText('lbl_opt_hide_history', 'opt_hide_history');
        setText('lbl_opt_limit_history', 'opt_limit_history');
        setText('lbl_opt_hide_myitems', 'opt_hide_myitems');
        setText('lbl_opt_hide_gems', 'opt_hide_gems');
        setText('lbl_group_productivity', 'group_productivity');
        setText('lbl_opt_quick_delete', 'opt_quick_delete');
        setText('lbl_opt_always_menu', 'opt_always_menu');
        setText('btnReset', 'btn_reset');
        setText('btnAllOff', 'btn_all_off');
        setText('btnAllOn', 'btn_all_on');
        setText('link_github', 'link_github');
    }

    function setText(id, key) {
        const el = document.getElementById(id);
        if (el) el.innerText = i18n(key);
    }

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
            featureHidePrompts: true,
            userLanguage: 'pt-br' // Reset language to default
        });
        currentLanguage = 'pt-br';
        updateLanguageUI();
    });

    btnAllOff.addEventListener('click', () => {
        updateAll({
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
            featureHistoryLimit: true,
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
