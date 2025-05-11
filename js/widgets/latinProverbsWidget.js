// js/widgets/latinProverbsWidget.js
import proverbsData from './proverbs.json'; // Updated import path

export function setupLatinProverbsWidget(widgetEl, conf, settingsRef, escapeHTMLFunc) {
    const body = widgetEl.querySelector('.widget-body');
    if (!body) return;

    // Clear previous content and structure
    body.innerHTML = `
        <div class="latin-proverb-content-area">
            <p class="latin-proverb-loading">Loading proverbs...</p>
        </div>
        <div class="latin-proverb-controls">
            <button class="widget-btn proverb-prev-btn" title="Previous Proverb"><i class="fas fa-chevron-left"></i></button>
            <button class="widget-btn proverb-next-btn" title="Next Proverb"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;

    const contentArea = body.querySelector('.latin-proverb-content-area');
    const prevBtn = body.querySelector('.proverb-prev-btn');
    const nextBtn = body.querySelector('.proverb-next-btn');

    let proverbs = [];
    let currentIndex = -1;
    
    if (widgetEl.proverbInterval) {
        clearInterval(widgetEl.proverbInterval);
    }

    function loadProverbs() {
        if (proverbsData && proverbsData.length > 0) {
            proverbs = proverbsData;
            displayRandomProverb();
            startAutoRefresh();
        } else {
            console.error("Latin Proverbs Widget Error: No proverbs data found or data is empty.");
            contentArea.innerHTML = '<p class="latin-proverb-error">No proverbs found or data is empty.</p>';
        }
    }

    function displayProverbAtIndex(index) {
        if (proverbs.length === 0 || index < 0 || index >= proverbs.length) {
            contentArea.innerHTML = '<p class="latin-proverb-error">Proverb not available.</p>';
            return;
        }
        currentIndex = index;
        const selectedProverb = proverbs[currentIndex];

        contentArea.innerHTML = `
            <div class="latin-proverb-text">"${escapeHTMLFunc(selectedProverb.proverb)}"</div>
            <div class="latin-proverb-translation">${escapeHTMLFunc(selectedProverb.translation)}</div>
            ${selectedProverb.meaning ? `<div class="latin-proverb-meaning">${escapeHTMLFunc(selectedProverb.meaning)}</div>` : ''}
        `;
    }

    function displayRandomProverb() {
        if (proverbs.length === 0) return;
        const randomIndex = Math.floor(Math.random() * proverbs.length);
        displayProverbAtIndex(randomIndex);
    }

    function showNextProverb() {
        if (proverbs.length === 0) return;
        let nextIdx = currentIndex + 1;
        if (nextIdx >= proverbs.length) {
            nextIdx = 0; // Wrap around
        }
        displayProverbAtIndex(nextIdx);
        resetAutoRefreshTimer();
    }

    function showPrevProverb() {
        if (proverbs.length === 0) return;
        let prevIdx = currentIndex - 1;
        if (prevIdx < 0) {
            prevIdx = proverbs.length - 1; // Wrap around
        }
        displayProverbAtIndex(prevIdx);
        resetAutoRefreshTimer();
    }
    
    function startAutoRefresh() {
        if (widgetEl.proverbInterval) clearInterval(widgetEl.proverbInterval);
        widgetEl.proverbInterval = setInterval(() => {
            displayRandomProverb();
        }, 60 * 1000); // 1 minute
    }

    function resetAutoRefreshTimer() {
        startAutoRefresh(); // Clears existing and starts a new one
    }

    // Event Listeners
    prevBtn.addEventListener('click', showPrevProverb);
    nextBtn.addEventListener('click', showNextProverb);

    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (refreshBtn) {
        // Remove existing event listener to avoid duplicates if any
        const newRefreshBtn = refreshBtn.cloneNode(true);
        refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
        newRefreshBtn.addEventListener('click', () => {
            displayRandomProverb();
            resetAutoRefreshTimer();
        });
    }
    
    loadProverbs(); // Load proverbs from imported data
} 