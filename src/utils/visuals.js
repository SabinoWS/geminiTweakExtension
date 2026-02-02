/**
 * Lógica Visual e Atualização de Classes CSS
 */

function applyVisualOneShot() {
    // Histórico Main Hide
    if (featureHistoryEnabled) {
        if (stateHistoryHidden) document.body.classList.add('gemini-history-hidden');
        else document.body.classList.remove('gemini-history-hidden');
    } else {
        document.body.classList.remove('gemini-history-hidden');
    }

    // Histórico Limit 5
    // Só aplica limite se a feature "Limit" estiver ativa E o user escolheu limitar
    if (featureHistoryLimitEnabled) {
        if (stateHistoryLimited) document.body.classList.add('gemini-history-limited');
        else document.body.classList.remove('gemini-history-limited');
    } else {
        document.body.classList.remove('gemini-history-limited');
    }

    // Meus Itens
    if (featureMyItemsEnabled) {
        if (stateMyItemsHidden) document.body.classList.add('gemini-my-items-hidden');
        else document.body.classList.remove('gemini-my-items-hidden');
    } else {
        document.body.classList.remove('gemini-my-items-hidden');
    }

    // Gems
    if (featureGemsEnabled) {
        if (stateGemsHidden) document.body.classList.add('gemini-gems-hidden');
        else document.body.classList.remove('gemini-gems-hidden');
    } else {
        document.body.classList.remove('gemini-gems-hidden');
    }

    // Always Show Menu
    if (featureAlwaysShowMenuEnabled) {
        document.body.classList.add('gemini-always-show-menu');
    } else {
        document.body.classList.remove('gemini-always-show-menu');
    }

    updateButtonStates();
}

function updateButtonStates() {
    const btnHistory = document.getElementById('gemini-btn-hide-all');
    if (btnHistory) btnHistory.classList.toggle('active', stateHistoryHidden);

    const btnHistoryLimit = document.getElementById('gemini-btn-limit-5');
    if (btnHistoryLimit) btnHistoryLimit.classList.toggle('active', stateHistoryLimited);

    const btnMyItems = document.querySelector('.gemini-my-items-controls');
    if (btnMyItems) btnMyItems.classList.toggle('active', stateMyItemsHidden);

    const btnGems = document.querySelector('.gemini-gems-controls');
    if (btnGems) btnGems.classList.toggle('active', stateGemsHidden);
}

function updateBodyClass(className, isActive) {
    if (isActive) document.body.classList.add(className);
    else document.body.classList.remove(className);
}
