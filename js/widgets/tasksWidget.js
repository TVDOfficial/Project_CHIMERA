// js/widgets/tasksWidget.js
// This widget relies on `settings` and `saveAppSettings` from main.js.
// And `escapeHTML` from utils.js
// We'll assume main.js handles passing/providing access to these.

export function setupTasksWidget(widgetEl, conf, settingsRef, saveAppSettingsFunc, escapeHTMLFunc) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;
    body.innerHTML = `
        <div class="task-input-area"><input type="text" id="newTaskInput-${conf.id}" placeholder="Enter new directive..."><button id="addTaskBtn-${conf.id}" class="btn-add-task" title="Add Directive"><i class="fas fa-plus-circle"></i></button></div>
        <ul id="taskListContainer-${conf.id}"></ul>`;
    const taskInput = widgetEl.querySelector(`#newTaskInput-${conf.id}`), addBtn = widgetEl.querySelector(`#addTaskBtn-${conf.id}`), listContainer = widgetEl.querySelector(`#taskListContainer-${conf.id}`);

    function renderTasks() {
        if (!listContainer) return; listContainer.innerHTML = ""; if (!Array.isArray(settingsRef.tasks)) settingsRef.tasks = [];
        settingsRef.tasks.forEach(task => {
            const li = document.createElement('li'); li.dataset.taskId = task.id;
            li.innerHTML = `<input type="checkbox" ${task.completed ? 'checked' : ''}> <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHTMLFunc(task.text)}</span> <button class="task-delete-btn"><i class="fas fa-trash-alt"></i></button>`;
            li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => { const t = settingsRef.tasks.find(x => x.id === task.id); if(t) t.completed = e.target.checked; saveAppSettingsFunc(); renderTasks(); });
            li.querySelector('.task-delete-btn').addEventListener('click', () => { settingsRef.tasks = settingsRef.tasks.filter(t => t.id !== task.id); saveAppSettingsFunc(); renderTasks(); });
            listContainer.appendChild(li);
        });
    }
    function addTask() { if (!taskInput) return; const text = taskInput.value.trim(); if (text) { if (!Array.isArray(settingsRef.tasks)) settingsRef.tasks = []; settingsRef.tasks.push({ text, completed: false, id: Date.now() }); saveAppSettingsFunc(); renderTasks(); taskInput.value = ""; }}
    if (addBtn) addBtn.addEventListener('click', addTask); if (taskInput) taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
    renderTasks();
}