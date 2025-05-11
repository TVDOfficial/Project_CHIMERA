// js/widgets/quickLinksWidget.js
// Relies on `openSettingsModal` from main.js.

export function setupQuickLinksWidget(widgetEl, conf, openSettingsModalFunc) {
    const body = widgetEl.querySelector('.widget-body');
    if (!body) return;

    body.className = 'widget-body link-grid-container';
    body.innerHTML = `
        <div class="button-container">
            <button class="link-button" data-link="google"><i class="fab fa-google"></i><span>Search</span></button>
            <button class="link-button" data-link="github"><i class="fab fa-github"></i><span>Codebase</span></button>
            <button class="link-button" data-link="email"><i class="fas fa-envelope-open-text"></i><span>Comms</span></button>
            <button class="link-button" data-action="open-settings"><i class="fas fa-cogs"></i><span>Config</span></button>
        </div>`;

    body.querySelectorAll('.link-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            const link = e.currentTarget.dataset.link;

            if (action === 'open-settings') openSettingsModalFunc();
            else if (link === 'google') window.open('https://google.com', '_blank');
            else if (link === 'github') window.open('https://github.com', '_blank');
            else if (link === 'email') window.location.href = 'mailto:';
        });
    });
}