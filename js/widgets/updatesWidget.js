export function setupUpdatesWidget(widgetEl, conf) {
    const body = widgetEl.querySelector('.widget-body');
    if (!body) {
        console.error("UpdatesWidget: .widget-body not found");
        return;
    }

    const updatesJsonUrl = 'https://raw.githubusercontent.com/TVDOfficial/Project_CHIMERA/main/updates.json';
    // const updatesJsonUrl = conf.updatesUrl || 'YOUR_FALLBACK_OR_DEFAULT_UPDATES_JSON_URL_HERE'; // Alternative if passed in conf

    async function fetchAndUpdateWidget() {
        try {
            const response = await fetch(updatesJsonUrl + '?t=' + new Date().getTime(), { cache: 'no-store' }); // Bust cache
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const config = await response.json();
            renderWidgetContent(config);
        } catch (error) {
            console.error('UpdatesWidget: Failed to fetch or parse updates.json:', error);
            renderDefaultAnnouncement(error.message);
        }
    }

    function renderWidgetContent(config) {
        body.innerHTML = ''; // Clear previous content

        const type = config.widgetType;
        const widgetConf = config.widgetConfig || {};

        switch (type) {
            case 'announcement':
                renderAnnouncement(widgetConf.title, widgetConf.message);
                break;
            case 'spotifyEmbed':
                if (widgetConf.embedUrl) {
                    renderSpotifyEmbed(widgetConf.embedUrl);
                } else {
                    renderError("Spotify embed URL missing in config.");
                }
                break;
            case 'htmlContent':
                if (widgetConf.html) {
                    renderHtmlContent(widgetConf.html);
                } else {
                    renderError("HTML content missing in config.");
                }
                break;
            case 'image':
                if (widgetConf.imageUrl) {
                    renderImage(widgetConf.imageUrl, widgetConf.altText, widgetConf.linkUrl);
                } else {
                    renderError("Image URL missing in config.");
                }
                break;
            default:
                console.warn(`UpdatesWidget: Unknown widgetType: ${type}`);
                renderDefaultAnnouncement("Invalid widget type specified in updates.json.");
        }
    }

    function renderAnnouncement(title, message) {
        const container = document.createElement('div');
        container.className = 'updates-announcement';
        if (title) {
            const titleEl = document.createElement('h3');
            titleEl.style.marginTop = '0';
            titleEl.textContent = title;
            container.appendChild(titleEl);
        }
        const messageEl = document.createElement('p');
        messageEl.textContent = message || "No announcement message provided.";
        messageEl.style.marginBottom = '0';
        container.appendChild(messageEl);
        body.appendChild(container);
    }

    function renderSpotifyEmbed(embedUrl) {
        const iframe = document.createElement('iframe');
        iframe.style.borderRadius = '12px';
        iframe.src = embedUrl;
        iframe.width = '100%';
        iframe.height = '100%'; // Or a fixed height like '352' or '152' for smaller embeds
        if (embedUrl.includes('/track/')) {
             iframe.height = '152'; // Compact for single tracks
        } else {
             iframe.height = '352'; // Taller for playlists/albums
        }
        iframe.setAttribute('frameBorder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
        iframe.setAttribute('loading', 'lazy');
        body.appendChild(iframe);
        body.style.padding = '0'; // Remove padding for iframe to fit well
        widgetEl.style.overflow = 'hidden'; // Ensure iframe corners are rounded if body has padding
    }

    function renderHtmlContent(htmlString) {
        // Note: Injecting HTML can be risky if the source is not trusted.
        // Ensure that the content of updates.json is from a trusted source.
        body.innerHTML = htmlString;
    }

    function renderImage(imageUrl, altText, linkUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = altText || 'Update image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.borderRadius = '4px';

        if (linkUrl) {
            const link = document.createElement('a');
            link.href = linkUrl;
            link.target = '_blank'; // Open in new tab
            link.rel = 'noopener noreferrer';
            link.appendChild(img);
            body.appendChild(link);
        } else {
            body.appendChild(img);
        }
    }
    
    function renderError(errorMessage) {
        body.innerHTML = `<div style="color: red; padding: 10px;">Error: ${errorMessage}</div>`;
    }

    function renderDefaultAnnouncement(reason) {
        renderAnnouncement("Updates Widget Active", `Could not load dynamic content (${reason}). Showing default message.`);
    }

    // Add a refresh button to the widget header if your widget framework supports it easily
    // Or, implement a refresh mechanism, e.g., re-fetch every few minutes or on demand.
    // For now, it fetches once on load.
    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (refreshBtn) {
        refreshBtn.title = "Refresh Updates Content";
        refreshBtn.addEventListener('click', fetchAndUpdateWidget);
    }


    fetchAndUpdateWidget();
} 