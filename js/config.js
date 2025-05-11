// js/config.js

// Import individual widget setup functions
// These will be associated with the definitions in main.js
// For now, we define the structure. The actual functions will be in their respective files.

export const ALL_WIDGET_DEFINITIONS_METADATA = {
    weatherWidget: { id: 'weatherWidget', name: 'Enviro-Scan', icon: 'fa-broadcast-tower', defaultOrder: 0, defaultVisible: true, minW: 250, minH: 140, configurableSettings: ['weatherApiKey', 'weatherLocation', 'weatherUnit'] },
    timeWidget: { id: 'timeWidget', name: 'Clock Display', icon: 'fa-clock', defaultOrder: 1, defaultVisible: true, minW: 380, minH: 100 },
    calendarWidget: { id: 'calendarWidget', name: 'Chronometer', icon: 'fa-calendar-alt', defaultOrder: 2, defaultVisible: true, minW: 280, minH: 280 },
    spotifyWidget: { id: 'spotifyWidget', name: 'Audio Relay', icon: 'fab fa-spotify', defaultOrder: 3, defaultVisible: true, minW: 380, minH: 160, configurableSettings: ['lastSpotifyUri'] },
    youtubeWidget: { id: 'youtubeWidget', name: 'Media Stream', icon: 'fa-youtube', defaultOrder: 4, defaultVisible: true, minW: 480, minH: 360, configurableSettings: ['youtubeApiKey'] },
    rssFeedWidget: {id: 'rssFeedWidget', name: 'Newsfeed', icon: 'fa-rss', defaultOrder: 5, defaultVisible: true, minW: 300, minH: 380, configurableSettings: ['rssFeedUrl', 'rssItemCount']},
    quickLinksWidget: { id: 'quickLinksWidget', name: 'Nav Matrix', icon: 'fa-route', defaultOrder: 6, defaultVisible: true, minW: 280, minH: 90 },
    chimeraAIChatWidget: {id: 'chimeraAIChatWidget', name: 'CHIMERA AI Chat', icon: 'fa-robot', defaultOrder: 7, defaultVisible: true, minW: 320, minH: 400, configurableSettings: ['openaiApiKey', 'aiChatTTSEnabled']},
    stocksWidget: { id: 'stocksWidget', name: 'Market Watch', icon: 'fa-chart-line', defaultOrder: 8, defaultVisible: true, minW: 300, minH: 400, configurableSettings: ['stocksTrackList'] },
    
    // Other widgets, defaultVisible: false
    systemWidget: { id: 'systemWidget', name: 'System Core', icon: 'fa-server', defaultOrder: 9, defaultVisible: false, minW: 220, minH: 140 },
    tasksWidget: { id: 'tasksWidget', name: 'Directives', icon: 'fa-clipboard-list', defaultOrder: 10, defaultVisible: false, minW: 260, minH: 220 },
    notesWidget: { id: 'notesWidget', name: 'Captain\'s Log', icon: 'fa-book', defaultOrder: 11, defaultVisible: false, minW: 220, minH: 130 },
    nexusVisualizerWidget: {id: 'nexusVisualizerWidget', name: 'Nexus Visualizer', icon: 'fa-atom', defaultOrder: 12, defaultVisible: false, minW: 260, minH: 300 },
    snakeGameWidget: {id: 'snakeGameWidget', name: 'Retro Snake', icon: 'fa-gamepad', defaultOrder: 13, defaultVisible: false, minW: 280, minH: 300},
    connectionMonitorWidget: {id: 'connectionMonitorWidget', name: 'Connection Monitor', icon: 'fa-network-wired', defaultOrder: 14, defaultVisible: false, minW: 240, minH: 130},
    latinProverbsWidget: { id: 'latinProverbsWidget', name: 'Latin Proverb', icon: 'fa-scroll', defaultOrder: 15, defaultVisible: false, minW: 250, minH: 120 }
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