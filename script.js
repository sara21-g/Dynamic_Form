// State Management
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = null;
let draggedElement = null;
let searchQuery = "";
let currentSort = "date"; // 'date', 'name'

// DOM Elements
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const companyInput = document.getElementById("company");
const notesInput = document.getElementById("notes");
const contactList = document.getElementById("contactList");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const clearAllBtn = document.getElementById("clearAllBtn");
const sortNameBtn = document.getElementById("sortNameBtn");
const sortDateBtn = document.getElementById("sortDateBtn");

// Initialize
function init() {
    loadTheme();
    displayContacts();
    updateStats();
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
    updateStats();
}

// Theme Management
function loadTheme() {
    const theme = localStorage.getItem("theme") || "light";
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️ Light Mode";
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    showNotification(isDark ? "Dark mode activated" : "Light mode activated", "info");
}

// Form Management
function clearForm() {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    companyInput.value = "";
    notesInput.value = "";
    editIndex = null;
    addBtn.textContent = "➕ Add Contact";
    addBtn.style.background = "var(--bg-gradient)";
}

function resetForm() {
    clearForm();
    showNotification("Form reset successfully", "info");
}

// Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\d{10}$/;
    return re.test(phone.replace(/\D/g, ''));
}

// Formspree Integration
async function sendToFormspree(contactData) {
    try {
        const response = await fetch("https://formspree.io/f/xgolalpn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone,
                company: contactData.company || "N/A",
                notes: contactData.notes || "N/A",
                timestamp: contactData.createdAt
            })
        });
        
        if (response.ok) {
            console.log("Contact sent to email successfully");
        }
    } catch (error) {
        console.error("Error sending to Formspree:", error);
        // Don't show error to user - contact is still saved locally
    }
}

// Contact Operations
function addOrUpdateContact() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const company = companyInput.value.trim();
    const notes = notesInput.value.trim();

    // Validation
    if (!name || !email || !phone) {
        showNotification("Please fill in all required fields!", "error");
        return;
    }

    if (!validateEmail(email)) {
        showNotification("Please enter a valid email address!", "error");
        return;
    }

    if (!validatePhone(phone)) {
        showNotification("Please enter a valid 10-digit phone number!", "error");
        return;
    }

    const contactData = {
        name,
        email,
        phone,
        company,
        notes,
        favorite: editIndex !== null ? contacts[editIndex].favorite : false,
        createdAt: editIndex !== null ? contacts[editIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (editIndex === null) {
        contacts.push(contactData);
        showNotification("Contact added successfully!", "success");
        // Send new contact to Formspree
        sendToFormspree(contactData);
    } else {
        contacts[editIndex] = contactData;
        showNotification("Contact updated successfully!", "success");
    }

    saveToLocalStorage();
    displayContacts();
    clearForm();
}

function deleteContact(index) {
    if (confirm("Are you sure you want to delete this contact?")) {
        const deletedContact = contacts[index];
        contacts.splice(index, 1);
        saveToLocalStorage();
        displayContacts();
        showNotification(`Deleted ${deletedContact.name}`, "success");
    }
}

function editContact(index) {
    const contact = contacts[index];
    nameInput.value = contact.name;
    emailInput.value = contact.email;
    phoneInput.value = contact.phone;
    companyInput.value = contact.company || "";
    notesInput.value = contact.notes || "";
    editIndex = index;
    addBtn.textContent = "💾 Update Contact";
    addBtn.style.background = "linear-gradient(135deg, #28a745, #20c997)";
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification("Editing contact...", "info");
}

function toggleFavorite(index) {
    contacts[index].favorite = !contacts[index].favorite;
    saveToLocalStorage();
    displayContacts();
    const status = contacts[index].favorite ? "added to" : "removed from";
    showNotification(`Contact ${status} favorites`, "success");
}

function copyContact(contact) {
    const text = `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}${contact.company ? '\nCompany: ' + contact.company : ''}${contact.notes ? '\nNotes: ' + contact.notes : ''}`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification("Contact copied to clipboard!", "success");
    }).catch(() => {
        showNotification("Failed to copy contact", "error");
    });
}

// Search and Filter
function filterContacts() {
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.includes(query) ||
        (contact.company && contact.company.toLowerCase().includes(query))
    );
}

// Sorting
function sortContacts(type) {
    if (type === "name") {
        contacts.sort((a, b) => a.name.localeCompare(b.name));
        currentSort = "name";
        showNotification("Sorted alphabetically", "info");
    } else {
        contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        currentSort = "date";
        showNotification("Sorted by date", "info");
    }
    saveToLocalStorage();
    displayContacts();
}

// Display
function displayContacts() {
    const filteredContacts = filterContacts();
    contactList.innerHTML = "";

    if (filteredContacts.length === 0) {
        contactList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>${searchQuery ? "No contacts found" : "No contacts yet"}</h3>
                <p>${searchQuery ? "Try a different search term" : "Add your first contact to get started!"}</p>
            </div>
        `;
        return;
    }

    // Separate favorites and regular contacts
    const favorites = filteredContacts.filter(c => c.favorite);
    const regular = filteredContacts.filter(c => !c.favorite);
    const sortedContacts = [...favorites, ...regular];

    sortedContacts.forEach((contact, displayIndex) => {
        const actualIndex = contacts.indexOf(contact);
        const div = document.createElement("div");
        div.className = "contact-item";
        div.draggable = true;
        div.dataset.index = actualIndex;

        div.innerHTML = `
            <div class="contact-header">
                <div>
                    <div class="contact-name">${escapeHtml(contact.name)}</div>
                    ${contact.company ? `<div style="color: var(--primary); font-size: 0.9em;">🏢 ${escapeHtml(contact.company)}</div>` : ''}
                </div>
                <div class="contact-favorite ${contact.favorite ? 'active' : ''}" onclick="toggleFavorite(${actualIndex})">
                    ${contact.favorite ? '⭐' : '☆'}
                </div>
            </div>
            <div class="contact-details">
                <p><span class="contact-icon">📧</span> ${escapeHtml(contact.email)}</p>
                <p><span class="contact-icon">📱</span> ${escapeHtml(contact.phone)}</p>
            </div>
            ${contact.notes ? `<div class="contact-notes">💭 ${escapeHtml(contact.notes)}</div>` : ''}
            <div class="actions">
                <button class="edit-btn" onclick="editContact(${actualIndex})">✏️ Edit</button>
                <button class="copy-btn" onclick="copyContact(contacts[${actualIndex}])">📋 Copy</button>
                <button class="delete-btn" onclick="deleteContact(${actualIndex})">🗑️ Delete</button>
            </div>
        `;

        // Drag and Drop Events
        div.addEventListener("dragstart", handleDragStart);
        div.addEventListener("dragend", handleDragEnd);
        div.addEventListener("dragover", handleDragOver);
        div.addEventListener("drop", handleDrop);
        div.addEventListener("dragenter", handleDragEnter);
        div.addEventListener("dragleave", handleDragLeave);

        contactList.appendChild(div);
    });
}

// Drag and Drop Handlers
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove("dragging");
    document.querySelectorAll(".contact-item").forEach(item => {
        item.classList.remove("drag-over");
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = "move";
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add("drag-over");
    }
}

function handleDragLeave(e) {
    this.classList.remove("drag-over");
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);

        const draggedContact = contacts[draggedIndex];
        contacts.splice(draggedIndex, 1);
        const newIndex = contacts.indexOf(contacts[targetIndex]);
        contacts.splice(newIndex, 0, draggedContact);

        saveToLocalStorage();
        displayContacts();
        showNotification("Contact reordered", "info");
    }

    return false;
}

// Export/Import
function exportContacts() {
    if (contacts.length === 0) {
        showNotification("No contacts to export!", "error");
        return;
    }

    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification("Contacts exported successfully!", "success");
}

function importContacts() {
    importFile.click();
}

function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedContacts = JSON.parse(event.target.result);
            if (Array.isArray(importedContacts)) {
                if (confirm(`Import ${importedContacts.length} contacts? This will merge with existing contacts.`)) {
                    contacts = [...contacts, ...importedContacts];
                    saveToLocalStorage();
                    displayContacts();
                    showNotification(`Imported ${importedContacts.length} contacts!`, "success");
                }
            } else {
                showNotification("Invalid file format!", "error");
            }
        } catch (error) {
            showNotification("Error reading file!", "error");
        }
    };
    reader.readAsText(file);
    importFile.value = "";
}

function clearAllContacts() {
    if (contacts.length === 0) {
        showNotification("No contacts to clear!", "error");
        return;
    }

    if (confirm(`Are you sure you want to delete all ${contacts.length} contacts? This cannot be undone!`)) {
        contacts = [];
        saveToLocalStorage();
        displayContacts();
        showNotification("All contacts cleared!", "success");
    }
}

// Stats
function updateStats() {
    document.getElementById("totalContacts").textContent = contacts.length;
    document.getElementById("favoriteCount").textContent = contacts.filter(c => c.favorite).length;
}

// Notifications
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideInRight 0.3s ease reverse";
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
addBtn.addEventListener("click", addOrUpdateContact);
resetBtn.addEventListener("click", resetForm);
themeToggle.addEventListener("click", toggleTheme);
exportBtn.addEventListener("click", exportContacts);
importBtn.addEventListener("click", importContacts);
importFile.addEventListener("change", handleFileImport);
clearAllBtn.addEventListener("click", clearAllContacts);
sortNameBtn.addEventListener("click", () => sortContacts("name"));
sortDateBtn.addEventListener("click", () => sortContacts("date"));

searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    displayContacts();
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === "s") {
            e.preventDefault();
            exportContacts();
        } else if (e.key === "k") {
            e.preventDefault();
            searchInput.focus();
        }
    }
});

// Allow Enter key to submit form
[nameInput, emailInput, phoneInput, companyInput].forEach(input => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addOrUpdateContact();
        }
    });
});

// Make functions global (required for onclick handlers in HTML strings)
window.deleteContact = deleteContact;
window.editContact = editContact;
window.toggleFavorite = toggleFavorite;
window.copyContact = copyContact;

// Initialize app on page load
init();
