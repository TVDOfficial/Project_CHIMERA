// js/widgets/timeWidget.js

export function setupTimeWidget(widgetEl, conf) {
    const body = widgetEl.querySelector('.widget-body');
    if (body) {
        body.style.display = 'flex'; body.style.flexDirection = 'column'; body.style.alignItems = 'center';
        body.style.justifyContent = 'center'; body.style.textAlign = 'center'; body.style.height = '100%';
        body.innerHTML = '';
        const timeDisplay = document.createElement('div'); timeDisplay.className = 'main-time-display-dynamic';
        const dateDisplay = document.createElement('div'); dateDisplay.className = 'main-date-display-dynamic';
        body.appendChild(timeDisplay); body.appendChild(dateDisplay);
        function updateTime() {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            dateDisplay.textContent = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }
        updateTime();
        if (widgetEl.dataset.timeWidgetInterval) clearInterval(parseInt(widgetEl.dataset.timeWidgetInterval));
        widgetEl.dataset.timeWidgetInterval = setInterval(updateTime, 1000);
    }
}