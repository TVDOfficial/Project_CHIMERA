// js/widgets/connectionMonitorWidget.js

export function setupConnectionMonitorWidget(widgetEl, conf) {
    const body = widgetEl.querySelector('.widget-body'); if(!body) return;
    body.innerHTML = `
        <div class="status-line"><div class="icon-label-group"><i class="fas fa-globe"></i><span class="label">Status:</span></div><span class="value" id="connStatus-${conf.id}">Checking...</span></div>
        <div class="status-line"><div class="icon-label-group"><i class="fas fa-stopwatch"></i><span class="label">Server Latency:</span></div><span class="value" id="connLatency-${conf.id}">N/A</span></div>
        <div class="status-line"><div class="icon-label-group"><i class="fas fa-tachometer-alt"></i><span class="label">Est. Throughput:</span></div><span class="value" id="connSpeed-${conf.id}">N/A</span></div>
        <div class="last-checked" id="connLastChecked-${conf.id}"></div>
    `;
    const statusEl = widgetEl.querySelector(`#connStatus-${conf.id}`), latencyEl = widgetEl.querySelector(`#connLatency-${conf.id}`),
          speedEl = widgetEl.querySelector(`#connSpeed-${conf.id}`), lastCheckedEl = widgetEl.querySelector(`#connLastChecked-${conf.id}`);
    const targetUrl = 'https://www.google.com/generate_204'; // A lightweight target

    async function checkConn() {
        if(lastCheckedEl) lastCheckedEl.textContent = `Last: ${new Date().toLocaleTimeString()}`;
        if (navigator.onLine) { statusEl.textContent = 'Online'; statusEl.className = 'value online';}
        else { statusEl.textContent = 'Offline'; statusEl.className = 'value offline'; latencyEl.textContent = 'N/A'; speedEl.textContent = 'N/A'; return; }
        const startTime = performance.now();
        try {
            // Use a cache-busting query parameter to avoid cached responses
            await fetch(`${targetUrl}?_=${new Date().getTime()}`, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(5000) });
             // For 'no-cors' HEAD requests, we can't directly measure latency accurately as the response is opaque.
             // This will often result in a very low latency number or an error.
             // A more reliable way would be to fetch a small resource with CORS, but that depends on external services.
             // For now, we'll indicate a successful attempt if no error.
            latencyEl.innerHTML = `${Math.round(performance.now() - startTime)}<span class="unit">ms (approx)</span>`;
        }
        catch (error) {
            latencyEl.textContent = 'N/A'; // Can't determine for no-cors
            console.warn("Latency check issue (no-cors HEAD):", error);
        }
        if (navigator.connection?.downlink) speedEl.innerHTML = `${navigator.connection.downlink}<span class="unit">Mbps (est.)</span>`;
        else speedEl.textContent = 'N/A';
    }
    checkConn(); if (widgetEl.connectionMonitorInterval) clearInterval(widgetEl.connectionMonitorInterval);
    widgetEl.connectionMonitorInterval = setInterval(checkConn, 30000);
    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`); if (refreshBtn) refreshBtn.addEventListener('click', checkConn);
}