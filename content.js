/**
 * Gemini Extension
 */

const MODEL_OPTIONS = [
    { id: 'bard-mode-option-rápido', label: 'Rápido', icon: '⚡' },
    { id: 'bard-mode-option-raciocínio', label: 'Raciocínio', icon: '🧠' },
    { id: 'bard-mode-option-pro', label: 'Pro', icon: '💎' }
];

const ORIGINAL_SELECTOR_CLASS = '.input-area-switch';
let isExtensionEnabled = true;

let featureHistoryEnabled = false;
let featureHistoryLimitEnabled = false;
let featureMyItemsEnabled = false;
let featureGemsEnabled = false;
let featureQuickDeleteEnabled = true;
let featureAlwaysShowMenuEnabled = true;

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
    'featureAlwaysShowMenu'
], (result) => {
    isExtensionEnabled = result.enabled !== false;

    featureHistoryEnabled = result.featureHistoryHide !== false;
    featureHistoryLimitEnabled = result.featureHistoryLimit !== false;
    featureMyItemsEnabled = result.featureMyItemsHide !== false;
    featureGemsEnabled = result.featureGemsHide !== false;
    featureQuickDeleteEnabled = result.featureQuickDelete !== false;
    featureAlwaysShowMenuEnabled = result.featureAlwaysShowMenu !== false;

    updateBodyClass('gemini-ext-enabled', isExtensionEnabled);
    if (isExtensionEnabled) {
        initButtons();
        // Tentar sincronizar modelo do DOM primeiro, depois do storage como fallback
        setTimeout(() => {
            syncActiveModelFromDOM();
            // Se ainda não detectou, usar o storage como fallback
            setTimeout(() => {
                const hasActive = document.querySelector('.gemini-model-btn.active');
                if (!hasActive) {
                    chrome.storage.local.get(['lastSelectedModelId'], (res) => {
                        if (res.lastSelectedModelId) {
                            highlightModelButton(res.lastSelectedModelId);
                        }
                    });
                }
            }, 500);
        }, 300);
    }

    applyVisualOneShot();
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        isExtensionEnabled = changes.enabled.newValue;
        updateBodyClass('gemini-ext-enabled', isExtensionEnabled);
        if (isExtensionEnabled) initButtons();
    }

    // Feature: Histórico (Hide All)
    if (changes.featureHistoryHide) {
        featureHistoryEnabled = changes.featureHistoryHide.newValue;
        if (featureHistoryEnabled) stateHistoryHidden = true;
        applyVisualOneShot();
        if (!featureHistoryEnabled) {
            document.querySelectorAll('.gemini-history-controls').forEach(el => el.remove());
            document.body.classList.remove('gemini-history-hidden');
        } else {
            injectHistoryControls();
        }
    }

    // Feature: Histórico Limit (5 Items)
    if (changes.featureHistoryLimit) {
        featureHistoryLimitEnabled = changes.featureHistoryLimit.newValue;
        if (featureHistoryLimitEnabled) stateHistoryLimited = true;
        applyVisualOneShot();
        // Se desligar a feature, removemos o botão de filtro, mas mantemos o de olho
        // Re-inject controls to update buttons
        const controls = document.querySelector('.gemini-history-controls');
        if (controls) controls.remove();
        if (featureHistoryEnabled) injectHistoryControls();
    }

    // Feature: Meus Itens
    if (changes.featureMyItemsHide) {
        featureMyItemsEnabled = changes.featureMyItemsHide.newValue;
        if (featureMyItemsEnabled) stateMyItemsHidden = true;
        applyVisualOneShot();
        if (!featureMyItemsEnabled) {
            document.querySelectorAll('.gemini-my-items-controls').forEach(el => el.remove());
            document.body.classList.remove('gemini-my-items-hidden');
        } else {
            injectMyItemsControls();
        }
    }

    // Feature: Gems
    if (changes.featureGemsHide) {
        featureGemsEnabled = changes.featureGemsHide.newValue;
        if (featureGemsEnabled) stateGemsHidden = true;
        applyVisualOneShot();
        if (!featureGemsEnabled) {
            document.querySelectorAll('.gemini-gems-controls').forEach(el => el.remove());
            document.body.classList.remove('gemini-gems-hidden');
            document.querySelectorAll('.gemini-gems-list-container').forEach(el => el.classList.remove('gemini-gems-list-container'));
        } else {
            injectGemsControls();
        }
    }

    // Feature: Quick Delete
    if (changes.featureQuickDelete) {
        featureQuickDeleteEnabled = changes.featureQuickDelete.newValue;
        if (featureQuickDeleteEnabled) {
            injectQuickDeleteButtons();
        } else {
            document.querySelectorAll('.gemini-quick-delete-btn').forEach(btn => btn.remove());
        }
    }

    // Feature: Always Show Menu
    if (changes.featureAlwaysShowMenu) {
        featureAlwaysShowMenuEnabled = changes.featureAlwaysShowMenu.newValue;
        applyVisualOneShot();
    }
});

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

// ============ INJECTION LOGIC ============ //

function injectHistoryControls() {
    if (!featureHistoryEnabled) return;
    let label = document.querySelector('[data-test-id="conversations-subtitle"], .conversations-subtitle');
    if (!label) {
        const candidates = document.querySelectorAll('.gds-label-l, .gds-label-m, div[role="heading"], span.title');
        for (const el of candidates) {
            const txt = el.innerText?.toLowerCase().trim();
            if (txt === 'conversas' || txt === 'chats' || txt === 'recent') {
                if (el.offsetParent === null) continue;
                if (el.closest('button') || el.closest('a')) continue;
                label = el;
                break;
            }
        }
    }
    if (!label) {
        const divs = document.querySelectorAll('div');
        for (const d of divs) {
            if (d.childNodes.length === 1 && d.childNodes[0].nodeType === 3 && d.innerText.trim().toLowerCase() === 'conversas') {
                if (d.offsetParent !== null && !d.closest('button')) {
                    label = d;
                    break;
                }
            }
        }
    }

    if (label && !label.querySelector('.gemini-history-controls')) {
        const controls = createControlGroup('history');
        label.style.display = 'flex';
        label.style.justifyContent = 'flex-start';
        label.style.alignItems = 'center';
        if (getComputedStyle(label).display === 'inline') label.style.display = 'flex';
        label.appendChild(controls);
        updateButtonStates();
    }
}

function injectMyItemsControls() {
    if (!featureMyItemsEnabled) return;
    const sideNavButtons = document.querySelectorAll('side-nav-entry-button, [role="button"]');
    let targetButton = null;
    for (const btn of sideNavButtons) {
        if (btn.innerText.includes('Meus itens')) {
            targetButton = btn;
            break;
        }
    }
    if (targetButton && !targetButton.querySelector('.gemini-my-items-controls')) {
        const titleContainer = targetButton.querySelector('.title-container, .gds-label-l') || targetButton;
        const iconEyeOff = `<svg viewBox="0 0 24 24"><path d="M11.83 9L15 12.17V12a3 3 0 00-3-3h-.17zm-1.42 6l-3-3h-.12a2.99 2.99 0 00-.29.02L9.29 14.5c.34 0 .68-.08 1.01-.17l.11.67zM4.13 2.87L2.86 4.14 6.78 8.06a9.92 9.92 0 00-3.69 3.94c1.66 4.14 5.76 7.02 10.37 7.02 1.63 0 3.16-.36 4.56-.99l2.77 2.77 1.27-1.27L4.13 2.87zM12 16.5c-2.76 0-5.32-1.24-7.07-3.18.52-.59 1.11-1.12 1.76-1.58L9.2 14.24a3 3 0 003.55 3.55l1.69 1.69c-.47.02-.95.02-1.44.02zm6.68-4.5c-.24-1.07-.66-2.07-1.21-2.98l1.45-1.45C20.35 8.92 21.6 10.37 22.37 12c-.59 1.25-1.38 2.37-2.32 3.32l-1.37-1.32zM12 6.5c2.4 0 4.61.97 6.22 2.54l1.34-1.34C17.65 6.09 14.94 5 12 5c-2.07 0-4.01.55-5.71 1.51l1.43 1.43c1.23-.92 2.65-1.44 4.28-1.44z"/></svg>`;
        const btnHide = document.createElement('div');
        btnHide.className = 'gemini-history-btn gemini-my-items-controls';
        btnHide.innerHTML = iconEyeOff;
        btnHide.title = 'Mostrar/Esconder Meus Itens';
        btnHide.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stateMyItemsHidden = !stateMyItemsHidden;
            applyVisualOneShot();
        });
        titleContainer.style.display = 'flex';
        titleContainer.style.justifyContent = 'flex-start';
        titleContainer.style.alignItems = 'center';
        titleContainer.appendChild(btnHide);
        updateButtonStates();
    }
}

function injectGemsControls() {
    if (!featureGemsEnabled) return;

    // Nova estratégia: Encontrar o nó de texto exato "Gems"
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let gemsTextNode = null;

    // Limite de busca para não travar a página
    let count = 0;
    while (node = walker.nextNode()) {
        if (count++ > 5000) break; // Safety break
        if (node.nodeValue.trim() === 'Gems') {
            const parent = node.parentElement;
            // Validar contexto (Sidebar)
            if (parent.closest('side-nav-section') || parent.closest('bot-list') || parent.closest('nav') || parent.closest('colla-list')) {
                gemsTextNode = node;
                break;
            }
        }
    }

    if (gemsTextNode) {
        const parent = gemsTextNode.parentElement;

        // Verifica se já injetamos (no parent ou siblings)
        if (parent.querySelector('.gemini-gems-controls') ||
            (parent.nextElementSibling && parent.nextElementSibling.classList.contains('gemini-gems-controls'))) {
            return;
        }

        // Identificar container para esconder
        let containerToHide = null;
        let p = parent;
        // Subir até achar o container da seção
        const section = p.closest('side-nav-section') || p.closest('bot-list');
        if (section) {
            containerToHide = section.querySelector('.bots-list-container, .list-container, .items-container');
        }

        if (containerToHide) {
            containerToHide.classList.add('gemini-gems-list-container');
        }

        const iconEyeOff = `<svg viewBox="0 0 24 24"><path d="M11.83 9L15 12.17V12a3 3 0 00-3-3h-.17zm-1.42 6l-3-3h-.12a2.99 2.99 0 00-.29.02L9.29 14.5c.34 0 .68-.08 1.01-.17l.11.67zM4.13 2.87L2.86 4.14 6.78 8.06a9.92 9.92 0 00-3.69 3.94c1.66 4.14 5.76 7.02 10.37 7.02 1.63 0 3.16-.36 4.56-.99l2.77 2.77 1.27-1.27L4.13 2.87zM12 16.5c-2.76 0-5.32-1.24-7.07-3.18.52-.59 1.11-1.12 1.76-1.58L9.2 14.24a3 3 0 003.55 3.55l1.69 1.69c-.47.02-.95.02-1.44.02zm6.68-4.5c-.24-1.07-.66-2.07-1.21-2.98l1.45-1.45C20.35 8.92 21.6 10.37 22.37 12c-.59 1.25-1.38 2.37-2.32 3.32l-1.37-1.32zM12 6.5c2.4 0 4.61.97 6.22 2.54l1.34-1.34C17.65 6.09 14.94 5 12 5c-2.07 0-4.01.55-5.71 1.51l1.43 1.43c1.23-.92 2.65-1.44 4.28-1.44z"/></svg>`;
        const btnHide = document.createElement('span'); // Span
        btnHide.className = 'gemini-history-btn gemini-gems-controls';
        btnHide.innerHTML = iconEyeOff;
        btnHide.title = 'Mostrar/Esconder Gems';
        btnHide.style.marginLeft = '6px';
        btnHide.style.display = 'inline-flex';
        btnHide.style.verticalAlign = 'middle';
        btnHide.style.cursor = 'pointer';

        btnHide.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stateGemsHidden = !stateGemsHidden;
            applyVisualOneShot();
        });

        // Tentar inserir APÓS o nó de texto, dentro do parent
        // Mas o parent precisa ser capaz de exibir lado a lado
        try {
            // Insere logo após o nó de texto
            gemsTextNode.after(btnHide);

            // Força o parent a ser flex row se não for
            const style = window.getComputedStyle(parent);
            if (style.display !== 'flex') {
                parent.style.display = 'flex';
                parent.style.alignItems = 'center';
            }
            // Remove largura fixa se tiver, para não empurrar ou cortar
            parent.style.width = 'auto';
            parent.style.minWidth = '0';
        } catch (err) {
            console.error('Erro ao injetar Gems control', err);
        }

        updateButtonStates();
    }
}

function createControlGroup(type) {
    const controls = document.createElement('div');
    controls.className = 'gemini-history-controls';
    if (type === 'history') {
        // Icone de Lista / Filtro
        if (featureHistoryLimitEnabled) {
            const iconFilter = `<svg viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`;
            const btnLimit = createIconBtn('gemini-btn-limit-5', 'Mostrar apenas 5 recentes',
                iconFilter,
                (e) => {
                    stateHistoryLimited = !stateHistoryLimited;
                    applyVisualOneShot();
                }
            );
            controls.appendChild(btnLimit);
        }

        // Icone de Olho
        const iconEyeOff = `<svg viewBox="0 0 24 24"><path d="M11.83 9L15 12.17V12a3 3 0 00-3-3h-.17zm-1.42 6l-3-3h-.12a2.99 2.99 0 00-.29.02L9.29 14.5c.34 0 .68-.08 1.01-.17l.11.67zM4.13 2.87L2.86 4.14 6.78 8.06a9.92 9.92 0 00-3.69 3.94c1.66 4.14 5.76 7.02 10.37 7.02 1.63 0 3.16-.36 4.56-.99l2.77 2.77 1.27-1.27L4.13 2.87zM12 16.5c-2.76 0-5.32-1.24-7.07-3.18.52-.59 1.11-1.12 1.76-1.58L9.2 14.24a3 3 0 003.55 3.55l1.69 1.69c-.47.02-.95.02-1.44.02zm6.68-4.5c-.24-1.07-.66-2.07-1.21-2.98l1.45-1.45C20.35 8.92 21.6 10.37 22.37 12c-.59 1.25-1.38 2.37-2.32 3.32l-1.37-1.32zM12 6.5c2.4 0 4.61.97 6.22 2.54l1.34-1.34C17.65 6.09 14.94 5 12 5c-2.07 0-4.01.55-5.71 1.51l1.43 1.43c1.23-.92 2.65-1.44 4.28-1.44z"/></svg>`;
        const btnHide = createIconBtn('gemini-btn-hide-all', 'Mostrar/Esconder Histórico',
            iconEyeOff,
            (e) => {
                stateHistoryHidden = !stateHistoryHidden;
                applyVisualOneShot();
            }
        );
        controls.appendChild(btnHide);
    }
    return controls;
}

function createIconBtn(id, title, svg, onClick) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'gemini-history-btn';
    btn.title = title;
    btn.innerHTML = svg;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick(e);
    });
    return btn;
}

function initButtons() {
    const triggerBtn = document.querySelector(ORIGINAL_SELECTOR_CLASS);
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
        btn.title = opt.label;
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
    const triggerBtn = document.querySelector(ORIGINAL_SELECTOR_CLASS);
    if (!triggerBtn) return;
    triggerBtn.click();
    const maxAttempts = 20;
    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        const option = document.querySelector(`[data-test-id="${targetId}"]`);
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
    const sendSelectors = ['.send-button', 'button[aria-label="Enviar"]', 'button[aria-label="Send message"]'];
    let sendBtn = null;
    for (const selector of sendSelectors) {
        const el = document.querySelector(selector);
        if (el) { sendBtn = el; break; }
    }
    if (!sendBtn) {
        const icons = document.querySelectorAll('[data-mat-icon-name="send"]');
        if (icons.length > 0) sendBtn = icons[icons.length - 1].closest('button');
    }
    if (sendBtn) sendBtn.click();
}

function updateActiveButton(activeBtn) {
    document.querySelectorAll('.gemini-model-btn').forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
}

const observer = new MutationObserver((mutations) => {
    if (isExtensionEnabled) {
        const triggerBtn = document.querySelector(ORIGINAL_SELECTOR_CLASS);
        if (triggerBtn && !document.querySelector('.gemini-model-switcher-container')) initButtons();
        // Esconde apenas botões de enviar, não de stop
        const sendIcons = document.querySelectorAll('[data-mat-icon-name="send"]');
        if (sendIcons.length > 0) {
            const btn = sendIcons[sendIcons.length - 1].closest('button');
            if (btn && !btn.classList.contains('gemini-hidden-send-button')) btn.classList.add('gemini-hidden-send-button');
        }
        // Remove a classe de botões que agora são de stop (mudaram de estado)
        const stopButtons = document.querySelectorAll('.gemini-hidden-send-button:has([data-mat-icon-name="stop"])');
        stopButtons.forEach(btn => btn.classList.remove('gemini-hidden-send-button'));
    }
    injectHistoryControls();
    injectMyItemsControls();
    injectGemsControls();
    injectQuickDeleteButtons();
});

observer.observe(document.body, { childList: true, subtree: true });

// Sincronizar modelo ativo periodicamente (pois o DOM pode mudar ou demorar a carregar)
setInterval(syncActiveModelFromDOM, 1000);

function syncActiveModelFromDOM() {
    if (!isExtensionEnabled) return;

    const switchBtn = document.querySelector(ORIGINAL_SELECTOR_CLASS);
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

// ============ EXCLUSÃO RÁPIDA DE CONVERSAS ============ //

const TRASH_ICON_SVG = `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;
const LOADING_ICON_SVG = `<svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`;

function injectQuickDeleteButtons() {
    if (!featureQuickDeleteEnabled) return;

    // Seleciona todos os containers de conversas que ainda não têm o botão de exclusão
    const conversationContainers = document.querySelectorAll('.conversation-items-container');

    conversationContainers.forEach(container => {
        // Verifica se já injetamos o botão neste container
        if (container.querySelector('.gemini-quick-delete-btn')) return;

        // Encontra o link da conversa dentro do container
        const conversationLink = container.querySelector('a.conversation');
        if (!conversationLink) return;

        // Cria o botão de exclusão rápida
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'gemini-quick-delete-btn';
        deleteBtn.innerHTML = TRASH_ICON_SVG;
        deleteBtn.title = 'Excluir conversa rapidamente';

        // Handler de clique para exclusão rápida
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Evitar cliques múltiplos
            if (deleteBtn.classList.contains('deleting')) return;

            // Feedback visual de carregamento
            deleteBtn.classList.add('deleting');
            deleteBtn.innerHTML = LOADING_ICON_SVG;

            try {
                await executeQuickDelete(container, conversationLink);
            } catch (error) {
                console.error('Erro ao excluir conversa:', error);
                // Restaurar botão em caso de erro
                deleteBtn.classList.remove('deleting');
                deleteBtn.innerHTML = TRASH_ICON_SVG;
            }
        });

        // Adiciona o botão ao container
        container.appendChild(deleteBtn);
    });
}

async function executeQuickDelete(container, conversationLink) {
    // Passo 1: Disparar hover para garantir que o menu esteja disponível
    conversationLink.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    await sleep(100);

    // Passo 2: Encontrar e clicar no botão de menu (3 pontos)
    const menuButton = container.querySelector('button.conversation-actions-menu-button') ||
        container.querySelector('button[data-test-id="actions-menu-button"]') ||
        container.querySelector('button[aria-label*="menu"]');

    if (!menuButton) {
        throw new Error('Botão de menu não encontrado');
    }

    menuButton.click();

    await sleep(200);

    // Passo 3: Encontrar e clicar no botão "Excluir" no menu dropdown
    const deleteMenuItem = await waitForElement(() => {
        const menuItems = document.querySelectorAll('button[role="menuitem"]');
        for (const item of menuItems) {
            if (item.innerText.includes('Excluir') || item.innerText.includes('Delete')) {
                return item;
            }
        }
        return null;
    }, 2000);

    if (!deleteMenuItem) {
        // Fechar menu se não encontrou a opção
        document.body.click();
        throw new Error('Opção de excluir não encontrada no menu');
    }

    deleteMenuItem.click();

    await sleep(300);

    // Passo 4: Encontrar e clicar no botão "Excluir" do modal de confirmação
    const confirmButton = await waitForElement(() => {
        const dialogButtons = document.querySelectorAll('mat-dialog-container button, .mat-mdc-dialog-container button, [role="dialog"] button');
        for (const btn of dialogButtons) {
            const text = btn.innerText.trim().toLowerCase();
            if (text === 'excluir' || text === 'delete') {
                return btn;
            }
        }
        return null;
    }, 2000);

    if (!confirmButton) {
        // Tentar fechar o diálogo
        const cancelBtn = document.querySelector('mat-dialog-container button, .mat-mdc-dialog-container button');
        if (cancelBtn) cancelBtn.click();
        throw new Error('Botão de confirmação não encontrado');
    }

    confirmButton.click();

    // Sucesso - o container será removido automaticamente pelo Gemini
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForElement(finder, timeout = 2000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const element = finder();
        if (element) return element;
        await sleep(50);
    }
    return null;
}
