// js/widgets/systemWidget.js

export function setupSystemWidget(widgetEl, conf) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return; body.style.display = 'block';
    body.innerHTML = `
        <div class="stat-item"><span class="stat-label"><i class="fas fa-microchip"></i> CPU</span><div class="progress-track"><div id="cpuBar-${conf.id}" class="progress-fill"></div></div><span id="cpuVal-${conf.id}" class="stat-value">0%</span></div>
        <div class="stat-item"><span class="stat-label" id="ramLabel-${conf.id}"><i class="fas fa-memory"></i> JS Heap</span><div class="progress-track"><div id="ramBar-${conf.id}" class="progress-fill"></div></div><span id="ramVal-${conf.id}" class="stat-value">0%</span></div>
        <div class="stat-item"><span class="stat-label" id="diskLabel-${conf.id}"><i class="fas fa-hdd"></i> Origin Storage</span><div class="progress-track"><div id="diskBar-${conf.id}" class="progress-fill"></div></div><span id="diskVal-${conf.id}" class="stat-value">N/A</span></div>`;
    const cpuBar = widgetEl.querySelector(`#cpuBar-${conf.id}`), cpuVal = widgetEl.querySelector(`#cpuVal-${conf.id}`),
          ramBar = widgetEl.querySelector(`#ramBar-${conf.id}`), ramVal = widgetEl.querySelector(`#ramVal-${conf.id}`), ramLabel = widgetEl.querySelector(`#ramLabel-${conf.id}`),
          diskBar = widgetEl.querySelector(`#diskBar-${conf.id}`), diskVal = widgetEl.querySelector(`#diskVal-${conf.id}`), diskLabel = widgetEl.querySelector(`#diskLabel-${conf.id}`);
    function updateStats() {
        const cpu = Math.floor(Math.random() * 90) + 5; if (cpuBar) cpuBar.style.width = `${cpu}%`; if (cpuVal) cpuVal.textContent = `${cpu}%`;
        if (performance.memory?.usedJSHeapSize && performance.memory?.jsHeapSizeLimit) {
            const ramPercent = Math.min(100, Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100));
            if (ramBar) ramBar.style.width = `${ramPercent}%`; if (ramVal) ramVal.textContent = `${ramPercent}%`;
            if (ramLabel && !ramLabel.innerHTML.includes("JS Heap")) ramLabel.innerHTML = '<i class="fas fa-memory"></i> JS Heap';
        } else { const ramMock = Math.floor(Math.random() * 85) + 10; if (ramBar) ramBar.style.width = `${ramMock}%`; if (ramVal) ramVal.textContent = `${ramMock}%`; if (ramLabel && !ramLabel.innerHTML.includes("RAM (Mock)")) ramLabel.innerHTML = '<i class="fas fa-memory"></i> RAM (Mock)';}
        if (navigator.storage?.estimate) {
            navigator.storage.estimate().then(est => {
                const usage = est.quota > 0 ? Math.round((est.usage / est.quota) * 100) : 0;
                if (diskBar) diskBar.style.width = `${usage}%`; if (diskVal) diskVal.textContent = `${usage}%`;
                if (diskLabel && !diskLabel.innerHTML.includes("Origin Storage")) diskLabel.innerHTML = '<i class="fas fa-hdd"></i> Origin Storage';
            }).catch(() => { if (diskBar) diskBar.style.width = '0%'; if (diskVal) diskVal.textContent = 'N/A'; if (diskLabel && !diskLabel.innerHTML.includes("Disk (N/A)")) diskLabel.innerHTML = '<i class="fas fa-hdd"></i> Disk (N/A)';});
        } else { const diskMock = Math.floor(Math.random() * 75) + 15; if (diskBar) diskBar.style.width = `${diskMock}%`; if (diskVal) diskVal.textContent = `${diskMock}%`; if (diskLabel && !diskLabel.innerHTML.includes("Disk (Mock)")) diskLabel.innerHTML = '<i class="fas fa-hdd"></i> Disk (Mock)';}
    }
    updateStats(); if (widgetEl.dataset.systemWidgetInterval) clearInterval(parseInt(widgetEl.dataset.systemWidgetInterval));
    widgetEl.dataset.systemWidgetInterval = setInterval(updateStats, 5000);
    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`); if (refreshBtn) refreshBtn.addEventListener('click', updateStats);
}