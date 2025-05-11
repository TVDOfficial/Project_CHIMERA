// js/utils.js

export function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}

// showToast needs access to `settings` for theme-based styling.
// It's better to keep it in main.js or pass settings to it.
// For simplicity in this refactor, we'll define it in main.js
// and not export it from here. If you prefer it here,
// main.js would need to pass `settings` to it upon each call or on init.