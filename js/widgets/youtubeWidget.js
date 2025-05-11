// js/widgets/youtubeWidget.js
// Relies on `settings`, `widgetsConfig`, `saveAppSettings`, `showToast`, `escapeHTML` from main.js.

export function setupYouTubeWidget(widgetEl, conf, settingsRef, widgetsConfigRef, saveAppSettingsFunc, showToastFunc, escapeHTMLFunc) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;
    body.innerHTML = `
        <div id="youtubePlayerContainer-${conf.id}" class="youtube-player-container-dynamic"><div class="youtube-placeholder-dynamic"><i class="fab fa-youtube"></i><span>Loading...</span></div></div>
        <div class="youtube-controls"><input type="text" id="youtubeSearchInput-${conf.id}" placeholder="YouTube Video URL or ID / Search"><button id="youtubeSearchBtn-${conf.id}" title="Load"><i class="fas fa-play-circle"></i></button></div>`;
    const playerContainer = widgetEl.querySelector(`#youtubePlayerContainer-${conf.id}`),
          searchInput = widgetEl.querySelector(`#youtubeSearchInput-${conf.id}`),
          searchBtn = widgetEl.querySelector(`#youtubeSearchBtn-${conf.id}`);

    let currentVideoId = conf.lastVideoId || 'jfKfPfyJRdk';

    function loadVideo(videoId) {
        if (!videoId) {
            playerContainer.innerHTML = `<div class="youtube-placeholder-dynamic"><i class="fab fa-youtube"></i><span>Enter URL/ID</span></div>`;
            return;
        }
        currentVideoId = videoId;
        widgetsConfigRef[conf.id].lastVideoId = videoId; // Update the specific widget's config
        saveAppSettingsFunc(); // Save all settings/configs
        playerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    async function handleSearchOrUrl() {
        const query = searchInput.value.trim();
        if (!query) {
            loadVideo(currentVideoId); // Reload current if input is empty
            return;
        }
        let videoIdToPlay = null;
        const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = query.match(ytRegex);

        if (match && match[1]) {
            videoIdToPlay = match[1];
        }

        if (videoIdToPlay) {
            loadVideo(videoIdToPlay);
        } else {
            if (settingsRef.youtubeApiKey) {
                showToastFunc(`Searching: "${escapeHTMLFunc(query.substring(0,30))}"...`, 2000);
                try {
                    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${settingsRef.youtubeApiKey}`);
                    const data = await res.json();
                    if (data.items?.length > 0) {
                        loadVideo(data.items[0].id.videoId);
                    } else {
                        showToastFunc(`No video: "${escapeHTMLFunc(query.substring(0,30))}".`, 3000);
                        playerContainer.innerHTML = `<div class="youtube-placeholder-dynamic"><i class="fab fa-youtube"></i><span>No results.</span></div>`;
                    }
                } catch (err) {
                    showToastFunc("Error searching.", 3000);
                    playerContainer.innerHTML = `<div class="youtube-placeholder-dynamic"><i class="fab fa-youtube"></i><span>Search error.</span></div>`;
                }
            } else {
                showToastFunc("API Key needed for search.", 4000);
                playerContainer.innerHTML = `<div class="youtube-placeholder-dynamic"><i class="fab fa-youtube"></i><span>API Key needed.</span></div>`;
            }
        }
    }

    if (searchBtn) searchBtn.addEventListener('click', handleSearchOrUrl);
    if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearchOrUrl(); });

    loadVideo(currentVideoId); // Initial load

    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (refreshBtn) refreshBtn.addEventListener('click', () => loadVideo(currentVideoId));
}