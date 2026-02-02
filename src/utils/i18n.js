
const TRANSLATIONS = {
    "pt-br": {
        // Popeup Section Headers
        "group_general": "Geral",
        "group_clean": "Clean Interface",
        "group_visibility": "Visibilidade",
        "group_productivity": "Produtividade",

        // Popup Checkbox Labels
        "opt_alt_buttons": "Botões Alternativos",
        "opt_sidebar_closed": "Iniciar Sidebar Fechada",
        "opt_hide_greeting": "Esconder Saudação (Bom dia)",
        "opt_hide_welcome": "Esconder Boas-vindas (Olá)",
        "opt_hide_prompts": "Esconder Sugestões (Iniciais)",
        "opt_hide_history": "Esconder Histórico",
        "opt_limit_history": "Limitar Histórico (5)",
        "opt_hide_myitems": "Esconder Meus Itens",
        "opt_hide_gems": "Esconder Gems",
        "opt_quick_delete": "Exclusão Rápida (Lixeira)",
        "opt_always_menu": "Menu Sempre Visível (3 Pontos)",

        // Buttons
        "btn_reset": "Padrão",
        "btn_all_off": "Desligar Tudo",
        "btn_all_on": "Ligar Tudo",
        "link_github": "Ver no GitHub ↗",

        // In-Page UI - Model Buttons
        "model_rapid": "Rápido",
        "model_reasoning": "Raciocínio",
        "model_pro": "Pro",

        // In-Page UI - Tooltips
        "tooltip_quick_delete": "Excluir conversa rapidamente",
        "tooltip_show_hide_gems": "Mostrar/Esconder Gems",
        "tooltip_show_hide_history": "Mostrar/Esconder Histórico",
        "tooltip_limit_history": "Mostrar apenas 5 recentes",
        "tooltip_show_hide_myitems": "Mostrar/Esconder Meus Itens",
    },
    "es": {
        "group_general": "General",
        "group_clean": "Interfaz Limpia",
        "group_visibility": "Visibilidad",
        "group_productivity": "Productividad",
        "opt_alt_buttons": "Botones Alternativos",
        "opt_sidebar_closed": "Iniciar Barra Lateral Cerrada",
        "opt_hide_greeting": "Ocultar Saludo",
        "opt_hide_welcome": "Ocultar Bienvenida",
        "opt_hide_prompts": "Ocultar Sugerencias",
        "opt_hide_history": "Ocultar Historial",
        "opt_limit_history": "Limitar Historial (5)",
        "opt_hide_myitems": "Ocultar Mis Elementos",
        "opt_hide_gems": "Ocultar Gems",
        "opt_quick_delete": "Eliminación Rápida (Papelera)",
        "opt_always_menu": "Menú Siempre Visible (3 Puntos)",
        "btn_reset": "Restaurar",
        "btn_all_off": "Apagar Todo",
        "btn_all_on": "Encender Todo",
        "link_github": "Ver en GitHub ↗",
        "model_rapid": "Rápido",
        "model_reasoning": "Razonamiento",
        "model_pro": "Pro",
        "tooltip_quick_delete": "Eliminar conversación rápidamente",
        "tooltip_show_hide_gems": "Mostrar/Ocultar Gems",
        "tooltip_show_hide_history": "Mostrar/Ocultar Historial",
        "tooltip_limit_history": "Mostrar solo 5 recientes",
        "tooltip_show_hide_myitems": "Mostrar/Ocultar Mis Elementos",
    },
    "en": {
        "group_general": "General",
        "group_clean": "Clean Interface",
        "group_visibility": "Visibility",
        "group_productivity": "Productivity",
        "opt_alt_buttons": "Alternative Buttons",
        "opt_sidebar_closed": "Start Sidebar Closed",
        "opt_hide_greeting": "Hide Greeting",
        "opt_hide_welcome": "Hide Welcome",
        "opt_hide_prompts": "Hide Suggestions",
        "opt_hide_history": "Hide History",
        "opt_limit_history": "Limit History (5)",
        "opt_hide_myitems": "Hide My Items",
        "opt_hide_gems": "Hide Gems",
        "opt_quick_delete": "Quick Delete (Trash)",
        "opt_always_menu": "Always Show Menu (3 Dots)",
        "btn_reset": "Reset",
        "btn_all_off": "All Off",
        "btn_all_on": "All On",
        "link_github": "View on GitHub ↗",
        "model_rapid": "Fast",
        "model_reasoning": "Reasoning",
        "model_pro": "Pro",
        "tooltip_quick_delete": "Quickly delete conversation",
        "tooltip_show_hide_gems": "Show/Hide Gems",
        "tooltip_show_hide_history": "Show/Hide History",
        "tooltip_limit_history": "Show only 5 recent",
        "tooltip_show_hide_myitems": "Show/Hide My Items",
    },
    "zh": {
        "group_general": "常规",
        "group_clean": "简洁界面",
        "group_visibility": "可见性",
        "group_productivity": "生产力",
        "opt_alt_buttons": "替代按钮",
        "opt_sidebar_closed": "启动时关闭侧边栏",
        "opt_hide_greeting": "隐藏问候",
        "opt_hide_welcome": "隐藏欢迎",
        "opt_hide_prompts": "隐藏建议",
        "opt_hide_history": "隐藏历史记录",
        "opt_limit_history": "限制历史记录 (5)",
        "opt_hide_myitems": "隐藏我的项目",
        "opt_hide_gems": "隐藏 Gems",
        "opt_quick_delete": "快速删除 (垃圾桶)",
        "opt_always_menu": "始终显示菜单 (3点)",
        "btn_reset": "重置",
        "btn_all_off": "全部关闭",
        "btn_all_on": "全部开启",
        "link_github": "在 GitHub 上查看 ↗",
        "model_rapid": "其实 (Fast)",
        "model_reasoning": "推理 (Reasoning)",
        "model_pro": "专业 (Pro)",
        "tooltip_quick_delete": "快速删除对话",
        "tooltip_show_hide_gems": "显示/隐藏 Gems",
        "tooltip_show_hide_history": "显示/隐藏 历史记录",
        "tooltip_limit_history": "仅显示最近5条",
        "tooltip_show_hide_myitems": "显示/隐藏 我的项目",
    }
};

let currentLanguage = 'pt-br';

function i18n(key) {
    const lang = TRANSLATIONS[currentLanguage] ? currentLanguage : 'pt-br';
    return TRANSLATIONS[lang][key] || TRANSLATIONS['pt-br'][key] || key;
}

// Para uso nos content scripts, precisamos atualizar currentLanguage com base no storage
function loadLanguage() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['userLanguage'], (result) => {
            if (result.userLanguage) {
                currentLanguage = result.userLanguage;
            }
        });
    }
}

// Inicializa carregando a linguagem
loadLanguage();

// Listener para mudanças de linguagem (Content Script)
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.userLanguage) {
            currentLanguage = changes.userLanguage.newValue;
            window.dispatchEvent(new CustomEvent('gemini-tweak-language-changed'));
        }
    });
}
