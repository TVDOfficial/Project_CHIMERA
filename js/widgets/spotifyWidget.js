// js/widgets/spotifyWidget.js
// Relies on `widgetsConfig`, `saveAppSettings`, `showToast` from main.js.

export function setupSpotifyWidget(widgetEl, conf, widgetsConfigRef, saveAppSettingsFunc, showToastFunc) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;
    let currentUri = conf.lastSpotifyUri || 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M'; // Default playlist

    body.innerHTML = `
        <div id="spotifyPlayerContainer-${conf.id}" class="spotify-player-container-dynamic"><div class="spotify-placeholder-dynamic"><i class="fab fa-spotify"></i><span>Loading...</span></div></div>
        <div class="spotify-controls"><input type="text" id="spotifyUriInput-${conf.id}" placeholder="Spotify Share URL or URI"><button id="spotifyLoadBtn-${conf.id}" title="Load"><i class="fas fa-play-circle"></i></button></div>`;

    const playerCont = widgetEl.querySelector(`#spotifyPlayerContainer-${conf.id}`);
    const uriInput = widgetEl.querySelector(`#spotifyUriInput-${conf.id}`);
    const loadBtn = widgetEl.querySelector(`#spotifyLoadBtn-${conf.id}`);

    if(uriInput) uriInput.value = currentUri;

    function loadEmbed(uri) {
        if (!uri?.trim()) {
            playerCont.innerHTML = `<div class="spotify-placeholder-dynamic"><i class="fab fa-spotify"></i><span>Enter Spotify URL/URI</span></div>`;
            return;
        }
        let embedUrl;
        const urlRegex = /open\.spotify\.com\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)/;
        const uriRegex = /spotify:(track|album|playlist|artist|episode|show):([a-zA-Z0-9]+)/;
        let match = uri.match(urlRegex) || uri.match(uriRegex);

        if (match) {
            // The compact player is chosen by iframe height (80px or 152px).
            // We control this via CSS/widget config for the parent container.
            embedUrl = `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
        } else {
            showToastFunc("Invalid Spotify URI/URL.", 3000);
            playerCont.innerHTML = `<div class="spotify-placeholder-dynamic"><i class="fab fa-spotify"></i><span>Invalid URI.</span></div>`;
            return;
        }
        currentUri = uri;
        widgetsConfigRef[conf.id].lastSpotifyUri = uri;
        saveAppSettingsFunc();
        playerCont.innerHTML = `<iframe title="Spotify Embed" src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }

    if (loadBtn) loadBtn.addEventListener('click', () => loadEmbed(uriInput.value));
    if (uriInput) uriInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') loadEmbed(uriInput.value); });

    loadEmbed(currentUri); // Initial load

    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (refreshBtn) refreshBtn.addEventListener('click', () => loadEmbed(currentUri));
}