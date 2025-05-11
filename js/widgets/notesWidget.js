// js/widgets/notesWidget.js
// Relies on `settings`, `saveAppSettings`, `showToast` from main.js.

export function setupNotesWidget(widgetEl, conf, settingsRef, saveAppSettingsFunc, showToastFunc) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;
    body.innerHTML = `<textarea id="notesTextarea-${conf.id}" placeholder="Record observations..."></textarea>`;
    const textarea = widgetEl.querySelector(`#notesTextarea-${conf.id}`); if (textarea) textarea.value = settingsRef.notes || "";
    const saveBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (saveBtn && textarea) {
        saveBtn.title = "Save Log";
        saveBtn.innerHTML = '<i class="fas fa-save"></i>';
        saveBtn.onclick = () => {
            settingsRef.notes = textarea.value;
            saveAppSettingsFunc();
            showToastFunc('Log Entry Saved.');
        };
    }
}