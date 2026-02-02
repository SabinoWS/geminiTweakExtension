/**
 * Feature: Limitar Histórico (5 Items)
 * Dependências: SidebarPage PageObject
 */

function addLimitChatsControl() {
    if (!featureHistoryLimitEnabled || !featureHistoryEnabled) return;

    // Obter label e garantir container
    const label = SidebarPage.getHistoryLabel();
    if (!label) return;

    const controls = SidebarPage.ensureHistoryControlsContainer(label);
    if (!controls) return;

    // Verificar se já existe o botão de limit
    if (controls.querySelector('#gemini-btn-limit-5')) return;

    // Icone de Lista / Filtro
    const iconFilter = `<svg viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`;

    // Inserir antes, se o botão hide já existir, ou dar append se não.
    const btnLimit = createIconBtn('gemini-btn-limit-5', i18n('tooltip_limit_history'),
        iconFilter,
        (e) => {
            stateHistoryLimited = !stateHistoryLimited;
            applyVisualOneShot();
        }
    );

    // Se já tiver algum botão (provavelmente o hide), insere antes dele
    if (controls.firstChild) {
        controls.insertBefore(btnLimit, controls.firstChild);
    } else {
        controls.appendChild(btnLimit);
    }

    updateButtonStates();
}
