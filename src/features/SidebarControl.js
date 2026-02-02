/**
 * Feature: Start Sidebar Closed
 * Controla o estado inicial da barra lateral.
 */

let hasInitializedSidebarControl = false;

function handleStartSidebarClosed() {
    if (hasInitializedSidebarControl) return;
    hasInitializedSidebarControl = true;

    if (!isExtensionEnabled) return;
    if (!featureStartSidebarClosedEnabled) return;

    console.log('[Gemini Tweak] Initializing Sidebar Control...');

    const maxAttempts = 20;
    let attempts = 0;

    const intervalId = setInterval(() => {
        attempts++;
        const btn = SidebarPage.getToggleButton();

        // Debug
        // console.log(`[Gemini Tweak] Attempt ${attempts}: Button found?`, !!btn);

        if (btn) {
            // Se encontrar, verifica estado
            // Em alguns frameworks, o aria-expanded demora a atualizar. 
            // Vamos confiar no atributo se existir.
            const isOpen = SidebarPage.isSidebarOpen(btn);
            console.log('[Gemini Tweak] Sidebar button found. Open?', isOpen);

            if (isOpen) {
                btn.click();
                console.log('[Gemini Tweak] Sidebar closed automatically.');
            }
            // Para de tentar assim que encontrar o botão e decidir o que fazer
            clearInterval(intervalId);
        }

        // Aumentar tentativas pois o carregamento pode ser lento
        if (attempts >= 40) { // ~20 segundos (40 * 500ms)
            clearInterval(intervalId);
            console.log('[Gemini Tweak] Sidebar button not found after timeout.');
        }
    }, 500);
}
