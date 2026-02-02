[🇧🇷 Português](README.md) | [🇬🇧 English](README_en.md) | [🇪🇸 Español](README_es.md) | [🇨🇳 中文](README_zh.md)

# 🔧 Gemini Tweak Extension

Chrome extension to customize the **Google Gemini** interface with privacy controls and productivity shortcuts.

---

## ✨ Features

### 🎛️ Quick Model Selector

![Model Selector](screenshots/buttonsPreview.png)

- Quick access buttons to switch between Gemini models:
  - ⚡ **Fast** - Faster responses
  - 🧠 **Reasoning** - Better for complex tasks
  - 💎 **Pro** - Most advanced model

> Models are directly accessible via buttons (without dropdown menu) and the status of the last used model is automatically saved and restored when returning to the page.

### 🔒 Privacy Controls (Blur/Censorship)

![Privacy Controls](screenshots/blurPreview.png)

Hides sidebar sections with a blur effect for greater privacy:

| Section | Description |
|---------|-------------|
| **My Items** | Hides the recent items section |
| **Gems** | Hides the personalized Gems list |
| **Conversation History** | Hides or limits visible conversations |

#### History Modes:
- 👁️ **Visible** - Shows all conversations
- 🔢 **Limited** - Shows only the first 5 conversations (blur on the rest)
- 🚫 **Hidden** - Applies blur to the entire history

> **Note:** We use blur instead of `display: none` to keep Gemini's lazy loading working correctly.

### 🗑️ Quick Conversation Deletion

![Quick Deletion](screenshots/fastDeletePreview.png)

- Adds a **trash can button** next to each conversation.
- Allows deleting conversations quickly without manual confirmation (the flow is automated).
- **Menu always visible**: Both the trash can and the 3-dot menu remain fixed, facilitating access.
- Icon colors adapted for Light and Dark themes.

---

## 🚀 Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right corner)
4. Click on **Load unpacked**
5. Select the project folder

---

## 📁 Project Structure

```
geminiExtension/
├── manifest.json      # Extension configuration
├── popup.html         # Settings popup interface
├── popup.js           # Popup logic
├── styles.css         # Global CSS styles
├── src/               # Modularized source code
│   ├── config/        # Configuration and constants
│   ├── features/      # Features (Buttons, Sidebar, etc)
│   ├── pageObjects/   # Selectors and DOM abstraction
│   ├── states/        # State management
│   └── utils/         # Utility functions
├── README.md          # This file
├── screenshots/       # Preview images
└── docs/              # Technical documentation
```

---

## ⚙️ Settings

![Settings Popup](screenshots/modalPreview.png)

At the top of the popup, you find **Quick Action** buttons:
- **Default**: Restores original extension settings.
- **All Off**: Disables all features.
- **All On**: Enables all features.

Below, the detailed options:

| Category | Option | Description |
|-----------|-------|-----------|
| **General** | Alternative Buttons | Enables quick model switch buttons at the top |
| | Start Sidebar Closed | Automatically closes sidebar when page loads |
| **Clean UI** | Hide Greeting | Removes "Hello, user" message |
| | Hide Welcome | Removes initial welcome text |
| | Hide Suggestions | Removes prompt suggestion cards |
| **Visibility**| Hide History | Applies blur/hides recent conversations list |
| | Limit History (5) | Displays only the 5 most recent items |
| | Hide My Items | Hides "My Items" section |
| | Hide Gems | Hides "Gems" section |
| **Productivity**| Quick Delete | Adds trash icon to delete without confirmation |
| | Always Show Menu | Keeps the menu (3 dots) always visible, without needing hover |

---

## 🎨 Technologies

- **Manifest V3** - Latest Chrome extension format
- **Vanilla JavaScript** - No external dependencies
- **Pure CSS** - Blur effects and transitions

---

## 📝 Changelog

### v1.4 (2026-02-01)
- ✨ Added **Quick Delete** for conversations (trash can)
- 🎨 Conversation menu (3 dots) is now **always visible**
- 🎨 Icons with automatic adaptive colors for Light and Dark themes
- 🐛 Layout adjustments to avoid text overlap

### v1.3 (2026-02-01)
- ✨ Renamed to "Gemini Tweak Extension"
- 🔧 Implemented blur system instead of display:none
- 🐛 Fixed infinite lazy loading issue
- 📚 Added DOM structure documentation

### v1.2
- ➕ Added privacy controls (My Items, Gems, History)
- ➕ 5 conversation limit mode

### v1.0
- 🎉 Initial version with model selector

---

## 🤝 Contribution

Contributions are welcome! Before modifying, consult the DOM structure documentation in `docs/GEMINI_DOM_STRUCTURE.md`.

---

## 📄 License

This project is for personal use. Use at your own risk.

---

## ⚠️ Warning

This extension is not affiliated with Google. Gemini may update its interface at any time, which may break functionalities of this extension.
