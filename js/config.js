// js/config.js

// Import individual widget setup functions
// These will be associated with the definitions in main.js
// For now, we define the structure. The actual functions will be in their respective files.

export const ALL_WIDGET_DEFINITIONS_METADATA = {
    weatherWidget: { id: 'weatherWidget', name: 'Enviro-Scan', icon: 'fa-broadcast-tower', defaultOrder: 0, defaultVisible: true, minW: 250, minH: 140, defaultCol: 0, configurableSettings: ['weatherApiKey', 'weatherLocation', 'weatherUnit'] },
    timeWidget: { id: 'timeWidget', name: 'Clock Display', icon: 'fa-clock', defaultOrder: 1, defaultVisible: true, minW: 380, minH: 100, defaultCol: 1 },
    updatesWidget: { id: 'updatesWidget', name: 'Dynamic Updates', icon: 'fa-bullhorn', defaultOrder: 2, defaultVisible: true, minW: 280, minH: 150, defaultCol: 2 },
    calendarWidget: { id: 'calendarWidget', name: 'Chronometer', icon: 'fa-calendar-alt', defaultOrder: 3, defaultVisible: true, minW: 280, minH: 280, defaultCol: 3 },
    spotifyWidget: { id: 'spotifyWidget', name: 'Audio Relay', icon: 'fab fa-spotify', defaultOrder: 5, defaultVisible: true, minW: 380, minH: 160, defaultCol: 1, configurableSettings: ['lastSpotifyUri'] },
    youtubeWidget: { id: 'youtubeWidget', name: 'Media Stream', icon: 'fa-youtube', defaultOrder: 9, defaultVisible: true, minW: 480, minH: 360, defaultCol: 1, configurableSettings: ['youtubeApiKey'] },
    rssFeedWidget: {id: 'rssFeedWidget', name: 'Newsfeed', icon: 'fa-rss', defaultOrder: 6, defaultVisible: true, minW: 300, minH: 380, defaultCol: 2, configurableSettings: ['rssFeedUrl', 'rssItemCount']},
    quickLinksWidget: { id: 'quickLinksWidget', name: 'Nav Matrix', icon: 'fa-route', defaultOrder: 8, defaultVisible: true, minW: 280, minH: 90, defaultCol: 0 },
    chimeraAIChatWidget: {id: 'chimeraAIChatWidget', name: 'CHIMERA AI Chat', icon: 'fa-robot', defaultOrder: 4, defaultVisible: true, minW: 320, minH: 200, defaultCol: 0, configurableSettings: ['openaiApiKey', 'aiChatTTSEnabled']},
    stocksWidget: { id: 'stocksWidget', name: 'Market Watch', icon: 'fa-chart-line', defaultOrder: 7, defaultVisible: true, minW: 300, minH: 400, defaultCol: 3, configurableSettings: ['stocksTrackList'] },
    notesWidget: { id: 'notesWidget', name: 'Captain\'s Log', icon: 'fa-book', defaultOrder: 12, defaultVisible: false, minW: 220, minH: 130, defaultCol: 0 },
    nexusVisualizerWidget: {id: 'nexusVisualizerWidget', name: 'Nexus Visualizer', icon: 'fa-atom', defaultOrder: 13, defaultVisible: false, minW: 260, minH: 300, defaultCol: 1 },
    snakeGameWidget: {id: 'snakeGameWidget', name: 'Retro Snake', icon: 'fa-gamepad', defaultOrder: 14, defaultVisible: false, minW: 280, minH: 300, defaultCol: 2},
    connectionMonitorWidget: {id: 'connectionMonitorWidget', name: 'Connection Monitor', icon: 'fa-network-wired', defaultOrder: 15, defaultVisible: false, minW: 240, minH: 130, defaultCol: 3},
    latinProverbsWidget: { id: 'latinProverbsWidget', name: 'Latin Proverb', icon: 'fa-scroll', defaultOrder: 16, defaultVisible: false, minW: 250, minH: 120, defaultCol: 2 }
};

export const OWM_ICON_MAP = {
    '01d': 'fas fa-sun', '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun', '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud', '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud-meatball', '04n': 'fas fa-cloud-meatball',
    '09d': 'fas fa-cloud-showers-heavy', '09n': 'fas fa-cloud-showers-heavy',
    '10d': 'fas fa-cloud-sun-rain', '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt', '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake', '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog', '50n': 'fas fa-smog'
};