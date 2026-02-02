/**
 * Feature: Exclusão Rápida de Conversas (Delete Chat)
 * Dependências: ChatList PageObject, Dialogs PageObject
 */

function addDeleteChatButtons() {
    if (!featureQuickDeleteEnabled) return;

    // Seleciona todos os containers de conversas usando PageObject
    const conversationContainers = ChatList.getConversationContainers();

    conversationContainers.forEach(container => {
        // Verifica se já injetamos o botão neste container
        if (container.querySelector('.gemini-quick-delete-btn')) return;

        // Encontra o link da conversa usando PageObject
        const conversationLink = ChatList.getConversationLink(container);
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
    const menuButton = ChatList.getMenuButton(container);

    if (!menuButton) {
        throw new Error('Botão de menu não encontrado');
    }

    menuButton.click();

    await sleep(200);

    // Passo 3: Encontrar e clicar no botão "Excluir" no menu dropdown
    const deleteMenuItem = await waitForElement(() => ChatList.getDeleteMenuItem(), 2000);

    if (!deleteMenuItem) {
        // Fechar menu se não encontrou a opção
        document.body.click();
        throw new Error('Opção de excluir não encontrada no menu');
    }

    deleteMenuItem.click();

    await sleep(300);

    // Passo 4: Encontrar e clicar no botão "Excluir" do modal de confirmação
    const confirmButton = await waitForElement(() => Dialogs.getConfirmDeleteButton(), 2000);

    if (!confirmButton) {
        // Tentar fechar o diálogo
        const cancelBtn = Dialogs.getCancelButton();
        if (cancelBtn) cancelBtn.click();
        throw new Error('Botão de confirmação não encontrado');
    }

    confirmButton.click();

    // Sucesso - o container será removido automaticamente pelo Gemini
}
