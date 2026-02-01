document.addEventListener('DOMContentLoaded', () => {
    const toggleExt = document.getElementById('toggleExt');
    const toggleHistoryFeature = document.getElementById('toggleHistoryFeature');
    const toggleHistoryLimitFeature = document.getElementById('toggleHistoryLimitFeature');
    const toggleMyItemsFeature = document.getElementById('toggleMyItemsFeature');
    const toggleGemsFeature = document.getElementById('toggleGemsFeature');

    // Carregar estado salvo
    // Default = true (!== false)
    chrome.storage.local.get([
        'enabled',
        'featureHistoryHide',
        'featureHistoryLimit',
        'featureMyItemsHide',
        'featureGemsHide'
    ], (result) => {
        toggleExt.checked = result.enabled !== false;

        toggleHistoryFeature.checked = result.featureHistoryHide !== false;
        toggleHistoryLimitFeature.checked = result.featureHistoryLimit !== false;
        toggleMyItemsFeature.checked = result.featureMyItemsHide !== false;
        toggleGemsFeature.checked = result.featureGemsHide !== false;
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
});
