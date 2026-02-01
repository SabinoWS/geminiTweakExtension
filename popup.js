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
});
