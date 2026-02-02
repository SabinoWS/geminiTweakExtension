/**
 * Feature: Alternador de Modelos (Custom Model Buttons)
 * Dependências: ChatInterface PageObject
 */

function addModelButtons() {
    const triggerBtn = ChatInterface.getModelSwitcherTrigger();
    if (triggerBtn && !document.querySelector('.gemini-model-switcher-container')) {
        const newButtons = createButtons();
        triggerBtn.parentElement.insertBefore(newButtons, triggerBtn);
    }
}

function createButtons() {
    const container = document.createElement('div');
    container.className = 'gemini-model-switcher-container';
    MODEL_OPTIONS.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'gemini-model-btn';
        btn.innerHTML = `<span class="btn-icon">${opt.icon}</span>`;
        btn.title = i18n(opt.labelKey);
        btn.dataset.targetId = opt.id;
        btn.addEventListener('click', (e) => {
            if (!isExtensionEnabled) return;
            e.preventDefault();
            e.stopPropagation();
            selectModelAndSend(opt.id, btn);
        });
        container.appendChild(btn);
    });
    return container;
}

async function selectModelAndSend(targetId, clickedBtn) {
    // Feedback visual imediato
    updateActiveButton(clickedBtn);

    // Salvar escolha do usuário
    chrome.storage.local.set({ lastSelectedModelId: targetId });

    // Processo de seleção (apenas abre e clica, NÃO envia)
    const triggerBtn = ChatInterface.getModelSwitcherTrigger();
    if (!triggerBtn) return;
    triggerBtn.click();
    const maxAttempts = 20;
    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        const option = ChatInterface.getModelOption(targetId);
        if (option) {
            clearInterval(interval);
            option.click();
            // Envia automaticamente após selecionar
            setTimeout(() => clickSendButton(), 200);
        } else if (attempts > maxAttempts) {
            clearInterval(interval);
            document.body.click(); // Fecha menu se falhar
        }
    }, 30);
}

function clickSendButton() {
    const sendBtn = ChatInterface.getSendButton();
    if (sendBtn) sendBtn.click();
}

function updateActiveButton(activeBtn) {
    document.querySelectorAll('.gemini-model-btn').forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
}

function syncActiveModelFromDOM() {
    if (!isExtensionEnabled) return;

    const switchBtn = ChatInterface.getModelSwitcherTrigger();
    if (!switchBtn) return;

    const textContent = switchBtn.innerText?.toLowerCase() || '';
    const htmlContent = switchBtn.innerHTML?.toLowerCase() || '';
    const ariaLabel = switchBtn.getAttribute('aria-label')?.toLowerCase() || '';
    const allContent = textContent + ' ' + htmlContent + ' ' + ariaLabel;

    let detectedId = null;

    // Detecta Pro/Advanced (deve vir primeiro pois é mais específico)
    if (allContent.includes('advanced') || allContent.includes('pro ') || allContent.includes('pro"') ||
        allContent.includes('gemini-advanced') || textContent.trim() === 'pro') {
        detectedId = 'bard-mode-option-pro';
    }
    // Detecta Thinking/Raciocínio
    else if (allContent.includes('thinking') || allContent.includes('raciocínio') || allContent.includes('raciocinio')) {
        detectedId = 'bard-mode-option-raciocínio';
    }
    // Detecta Flash/Rápido (mais genérico, fica por último)
    else if (allContent.includes('flash') || allContent.includes('rápido') || allContent.includes('rapido')) {
        detectedId = 'bard-mode-option-rápido';
    }

    if (detectedId) {
        highlightModelButton(detectedId);
        // Atualiza storage também para ficar consistente
        chrome.storage.local.set({ lastSelectedModelId: detectedId });
    }
}

function highlightModelButton(targetId) {
    const btns = document.querySelectorAll('.gemini-model-btn');
    btns.forEach(btn => {
        if (btn.dataset.targetId === targetId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateModelButtonsText() {
    const btns = document.querySelectorAll('.gemini-model-btn');
    btns.forEach(btn => {
        const targetId = btn.dataset.targetId;
        const opt = MODEL_OPTIONS.find(o => o.id === targetId);
        if (opt) {
            btn.title = i18n(opt.labelKey);
        }
    });
}

window.addEventListener('gemini-tweak-language-changed', updateModelButtonsText);
