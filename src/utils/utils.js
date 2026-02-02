/**
 * Funções Utilitárias
 */

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

function getHistoryLabel() {
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
    return label;
}

function ensureHistoryControlsContainer(label) {
    if (!label) return null;
    let controls = label.querySelector('.gemini-history-controls');
    if (!controls) {
        controls = document.createElement('div');
        controls.className = 'gemini-history-controls';

        label.style.display = 'flex';
        label.style.justifyContent = 'flex-start';
        label.style.alignItems = 'center';
        if (getComputedStyle(label).display === 'inline') label.style.display = 'flex';

        label.appendChild(controls);
    }
    return controls;
}
