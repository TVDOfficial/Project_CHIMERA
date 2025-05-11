// js/widgets/rssFeedWidget.js
// Relies on `settings` and `escapeHTML` from main.js (passed or global).

export function setupRssFeedWidget(widgetEl, conf, settingsRef, escapeHTMLFunc) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;

    async function fetchAndDisplayFeed() {
        const feedUrl = settingsRef.rssFeedUrl || 'https://feeds.bbci.co.uk/news/world/rss.xml';
        const itemCount = settingsRef.rssItemCount || 5;

        body.innerHTML = `<div class="rss-feed-loading" style="text-align: center; padding: 20px;">Loading feed... <i class="fas fa-spinner fa-spin"></i></div>`;
        if (!feedUrl) { body.innerHTML = `<div class="rss-feed-no-url" style="text-align: center; padding: 20px;">No RSS Feed URL configured in settings.</div>`; return; }

        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;

        try {
            const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(15000) });
            if (!response.ok) throw new Error(`HTTP error ${response.status} fetching feed via proxy.`);
            const str = await response.text();
            const data = new window.DOMParser().parseFromString(str, "text/xml");

            const items = Array.from(data.querySelectorAll("item, entry")).slice(0, itemCount);
            if (items.length === 0) { body.innerHTML = `<div class="rss-feed-error" style="text-align: center; padding: 20px;">No items found in feed.</div>`; return; }

            const list = document.createElement('ul'); list.className = 'rss-feed-list';
            items.forEach(item => {
                const title = item.querySelector("title")?.textContent || "No Title";
                const link = item.querySelector("link")?.textContent || item.querySelector("link[href]")?.getAttribute('href') || "#";
                const pubDateEl = item.querySelector("pubDate, published");
                const pubDate = pubDateEl ? new Date(pubDateEl.textContent).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) : '';

                const li = document.createElement('li');
                li.className = 'rss-item'; // This class is not strictly needed if all styling is on .rss-card

                let imageUrl = item.querySelector("media\\:thumbnail, enclosure[url]")?.getAttribute("url") ||
                                 item.querySelector("media\\:content[url][medium='image']")?.getAttribute("url") ||
                                 item.querySelector("image url")?.textContent || // For channel image as fallback
                                 '';

                li.innerHTML = `
                    <a href="${escapeHTMLFunc(link)}" target="_blank" class="rss-card">
                        ${imageUrl ? `<img src="${escapeHTMLFunc(imageUrl)}" class="rss-thumb" alt="Feed image" />` : ''}
                        <div class="rss-card-content">
                            <div class="rss-item-title">${escapeHTMLFunc(title)}</div>
                            ${pubDate ? `<div class="rss-item-meta">${escapeHTMLFunc(pubDate)}</div>` : ''}
                        </div>
                    </a>
                `;
                list.appendChild(li);
            });
            body.innerHTML = ''; body.appendChild(list);
        } catch (error) {
            console.error("RSS Feed Error:", error);
            body.innerHTML = `<div class="rss-feed-error" style="text-align: center; padding: 10px;">Error loading feed.<br><small style="font-size:0.8em">${escapeHTMLFunc(error.message)}</small></div>`;
        }
    }
    fetchAndDisplayFeed();
    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (refreshBtn) refreshBtn.addEventListener('click', fetchAndDisplayFeed);

    if (widgetEl.rssFeedInterval) clearInterval(widgetEl.rssFeedInterval);
    widgetEl.rssFeedInterval = setInterval(fetchAndDisplayFeed, 15 * 60 * 1000);
}