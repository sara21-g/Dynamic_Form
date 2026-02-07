# 📇 Contact Manager Pro

A modern, feature-rich contact management application built with **100% Vanilla JavaScript** (no frameworks or libraries).

## ✨ Features

### Core Functionality
- ✅ **Add/Edit/Delete Contacts** - Full CRUD operations
- 📝 **Contact Fields** - Name, Email, Phone, Company, Notes
- 🔍 **Real-time Search** - Filter by name, email, phone, or company
- ⭐ **Favorite Contacts** - Mark important contacts
- 💾 **Local Storage** - All data persists after page refresh

### Advanced Features
- 🌓 **Dark/Light Mode** - Toggle between themes
- 🎯 **Drag & Drop** - Reorder contacts intuitively
- 📊 **Statistics** - Track total contacts and favorites
- 🔤 **Sort Options** - Sort by name (A-Z) or date added
- 📥 **Export Data** - Save contacts as JSON file
- 📤 **Import Data** - Load contacts from JSON file
- 📋 **Copy to Clipboard** - Quick copy contact details
- 🗑️ **Clear All** - Remove all contacts with confirmation

### User Experience
- 🎨 Beautiful gradient UI with glassmorphism effects
- 🎭 Smooth animations and transitions
- 📱 Fully responsive design (mobile-friendly)
- 🔔 Toast notifications for all actions
- ⌨️ Keyboard shortcuts (Ctrl+S to export, Ctrl+K to search)
- ✅ Form validation with helpful error messages
- 🎯 Enter key support for quick form submission

## 🚀 How to Use

### Option 1: Open Locally
1. Download all three files:
   - `index.html`
   - `styles.css`
   - `script.js`
2. Keep them in the same folder
3. Double-click `index.html` to open in your browser

### Option 2: Deploy on GitHub Pages
1. Create a new repository on GitHub
2. Upload all three files
3. Go to Settings → Pages
4. Select "Deploy from main branch"
5. Access your live site at: `https://yourusername.github.io/repository-name`

### Option 3: Use Live Server (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## 📁 File Structure

```
contact-manager/
│
├── index.html      # HTML structure
├── styles.css      # All styling and animations
├── script.js       # JavaScript functionality
└── README.md       # Documentation (this file)
```

## 🎯 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with:
  - CSS Grid & Flexbox
  - CSS Variables (Custom Properties)
  - Animations & Transitions
  - Media Queries for responsiveness
- **Vanilla JavaScript (ES6+)** - No frameworks:
  - Local Storage API
  - Drag & Drop API
  - Clipboard API
  - File Reader API
  - DOM Manipulation
  - Event Handling

### Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Minimum Requirements:** Any modern browser with ES6 support

## 📝 Usage Examples

### Adding a Contact
1. Fill in the required fields (Name, Email, Phone)
2. Optionally add Company and Notes
3. Click "Add Contact" or press Enter

### Searching Contacts
- Type in the search bar to filter contacts in real-time
- Search works across name, email, phone, and company fields

### Exporting/Importing
- **Export:** Click "Export" to download a JSON file of all contacts
- **Import:** Click "Import" and select a previously exported JSON file

### Keyboard Shortcuts
- `Ctrl + S` (or `Cmd + S` on Mac) - Export contacts
- `Ctrl + K` (or `Cmd + K` on Mac) - Focus search bar
- `Enter` - Submit form when in input fields

## 🎨 Customization

You can easily customize the colors by editing the CSS variables in `styles.css`:

```css
:root {
    --primary: #667eea;        /* Main color */
    --secondary: #764ba2;      /* Secondary color */
    --success: #28a745;        /* Success messages */
    --danger: #dc3545;         /* Delete/error actions */
    /* ... more variables */
}
```

## 🐛 Known Limitations

- Data is stored locally (not synced across devices)
- No user authentication/multi-user support
- Maximum storage depends on browser's localStorage limit (~5-10MB)

## 📄 License

This project is free to use for educational purposes.

## 👨‍💻 Assignment Compliance

This project meets all requirements:
- ✅ Add/Edit/Delete functionality
- ✅ Form validation
- ✅ Real-time display
- ✅ Local storage persistence
- ✅ Drag-and-drop reordering (bonus)
- ✅ Search functionality (bonus)
- ✅ Professional styling
- ✅ **100% Vanilla JavaScript** - No frameworks

## 🤝 Contributing

Feel free to fork this project and add your own features!

---

Made with ❤️ using Vanilla JavaScript
