/**
 * Page Object: Dialogs
 * Responsável por encontrar elementos em modais (como confirmação de delete)
 */
const Dialogs = {
    getConfirmDeleteButton: function () {
        const dialogButtons = document.querySelectorAll('mat-dialog-container button, .mat-mdc-dialog-container button, [role="dialog"] button');
        for (const btn of dialogButtons) {
            const text = btn.innerText.trim().toLowerCase();
            if (text === 'excluir' || text === 'delete') {
                return btn;
            }
        }
        return null;
    },

    getCancelButton: function () {
        // Geralmente o primeiro botão ou o que não é "confirmar"
        // Mas por segurança, clicar em qualquer outro fecha
        return document.querySelector('mat-dialog-container button, .mat-mdc-dialog-container button');
    }
};
