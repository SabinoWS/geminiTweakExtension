/**
 * Feature: Esconder Gems
 * Dependências: SidebarPage PageObject
 */

function addGemsControls() {
    if (!featureGemsEnabled) return;

    const gemsTextNode = SidebarPage.getGemsTextNode();

    if (gemsTextNode) {
        const parent = gemsTextNode.parentElement;

        // Verifica se já injetamos (no parent ou siblings)
        if (parent.querySelector('.gemini-gems-controls') ||
            (parent.nextElementSibling && parent.nextElementSibling.classList.contains('gemini-gems-controls'))) {
            return;
        }

        const containerToHide = SidebarPage.getGemsContainerToHide(gemsTextNode);

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
            console.error('Erro ao adicionar Gems control', err);
        }

        updateButtonStates();
    }
}
