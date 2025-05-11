// js/main.js

// Import configurations and utilities
import { ALL_WIDGET_DEFINITIONS_METADATA, OWM_ICON_MAP } from './config.js';
import { escapeHTML as utilEscapeHTML } from './utils.js'; // Renamed to avoid conflict if showToast moves here
import { initBackgroundParticles as utilInitBackgroundParticles } from './particles.js';

// Import widget setup functions
import { setupTimeWidget } from './widgets/timeWidget.js';
import { setupWeatherWidget } from './widgets/weatherWidget.js';
import { setupSystemWidget } from './widgets/systemWidget.js';
import { setupTasksWidget } from './widgets/tasksWidget.js';
import { setupNotesWidget } from './widgets/notesWidget.js';
import { setupQuickLinksWidget } from './widgets/quickLinksWidget.js';
import { setupYouTubeWidget } from './widgets/youtubeWidget.js';
import { setupCalendarWidget } from './widgets/calendarWidget.js';
import { setupSpotifyWidget } from './widgets/spotifyWidget.js';
import { setupNexusVisualizerWidget } from './widgets/nexusVisualizerWidget.js';
import { setupSnakeGameWidget } from './widgets/snakeGameWidget.js';
import { setupConnectionMonitorWidget } from './widgets/connectionMonitorWidget.js';
import { setupChimeraAIChatWidget } from './widgets/chimeraAIChatWidget.js';
import { setupRssFeedWidget } from './widgets/rssFeedWidget.js';
import { setupLatinProverbsWidget } from './widgets/latinProverbsWidget.js';
import { setupStocksWidget } from './widgets/stocksWidget.js';
import { setupUpdatesWidget } from './widgets/updatesWidget.js';

// --- Global Variables ---
const STORAGE_PREFIX = 'chimeraOS_v2.6_'; // Ensure this matches your latest version
let settings = {};
let widgetsConfig = {};
let ALL_WIDGET_DEFINITIONS = {}; // This will be populated after associating initFuncs

// --- DOM Elements ---
const startupOverlay = document.getElementById('startupOverlay');
const startupProgressFill = document.getElementById('startupProgressFill');
const startupStatusText = document.getElementById('startupStatusText');
const dashboardGrid = document.getElementById('dashboardGrid');
const customContextMenu = document.getElementById('customContextMenu');

const openWidgetLibraryBtn = document.getElementById('openWidgetLibraryBtn');
const widgetLibraryModal = document.getElementById('widgetLibraryModal');
const closeWidgetLibraryBtn = document.getElementById('closeWidgetLibraryBtn');
const widgetLibraryContainer = document.getElementById('widgetLibraryContainer');

const settingsResetLayoutBtn = document.getElementById('settingsResetLayoutBtn');
const saveLayoutToFileBtn = document.getElementById('saveLayoutToFileBtn');
const loadLayoutFromFileBtn = document.getElementById('loadLayoutFromFileBtn');
const loadLayoutFileInput = document.getElementById('loadLayoutFileInput');

const settingsModal = document.getElementById('settingsModal');
const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const themeSelector = document.getElementById('themeSelector');
const backgroundParticlesToggle = document.getElementById('backgroundParticlesToggle');
const weatherApiKeyInput = document.getElementById('weatherApiKeyInput');
const weatherLocationInput = document.getElementById('weatherLocationInput');
const youtubeApiKeyInput = document.getElementById('youtubeApiKeyInput');
const openaiApiKeyInput = document.getElementById('openaiApiKeyInput');
const rssFeedUrlInput = document.getElementById('rssFeedUrlInput');
const weatherUnitRadios = document.querySelectorAll('input[name="weatherUnit"]');
const rssItemCountInput = document.getElementById('rssItemCountInput');
const aiChatTTSToggle = document.getElementById('aiChatTTS');
const layoutModeRadios = document.querySelectorAll('input[name="layoutMode"]');
const stocksTrackListInput = document.getElementById('stocksTrackListInput');

const infoButton = document.getElementById('infoButton');
const infoModal = document.getElementById('infoModal');
const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');

// Widget Specific Settings Modal Elements
const widgetSpecificSettingsModal = document.getElementById('widgetSpecificSettingsModal');
const widgetSpecificSettingsTitle = document.getElementById('widgetSpecificSettingsTitle');
const widgetSpecificSettingsBody = document.getElementById('widgetSpecificSettingsBody');
const saveWidgetSpecificSettingsBtn = document.getElementById('saveWidgetSpecificSettingsBtn');
const closeWidgetSpecificSettingsModalBtn = document.getElementById('closeWidgetSpecificSettingsModalBtn');
const cancelWidgetSpecificSettingsBtn = document.getElementById('cancelWidgetSpecificSettingsBtn');
let currentEditingWidgetKey = null; // To store which widget's settings are being edited

// --- Helper Functions (moved from utils.js for direct access to settings if needed) ---
function escapeHTML(str) {
    return utilEscapeHTML(str); // Call the imported utility
}

function showToast(message, duration = 3000) {
    let toast = document.getElementById('chimeraToast');
    if (!toast) {
        toast = document.createElement('div'); toast.id = 'chimeraToast';
        toast.style.cssText = `position: fixed; bottom: -70px; left: 50%; transform: translateX(-50%); background-color: var(--current-accent-primary); color: var(--current-bg-deep); padding: 12px 22px; border-radius: var(--border-radius-main); box-shadow: 0 5px 20px rgba(0,0,0,0.25); z-index: 10001; font-size: 0.9rem; opacity: 0; transition: opacity 0.4s ease, bottom 0.4s ease; text-align: center; min-width: 250px; max-width: 90%;`;
        const currentTheme = settings.theme || 'chimera-dark'; // Use current settings
        if (currentTheme === 'chimera-light') toast.style.color = '#FFFFFF';
        else if (currentTheme === 'cyber-blue') toast.style.color = getComputedStyle(document.documentElement).getPropertyValue('--cyber-blue-bg-deep').trim();
        document.body.appendChild(toast);
    }
    toast.textContent = message; toast.style.opacity = '0'; toast.style.bottom = '-70px';
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.bottom = '20px'; });
    if (toast.dataset.toastTimeout) clearTimeout(parseInt(toast.dataset.toastTimeout));
    toast.dataset.toastTimeout = setTimeout(() => { toast.style.opacity = '0'; toast.style.bottom = '-70px'; }, duration);
}

// Associate imported setup functions with their definitions
function mapWidgetSetupFunctions() {
    ALL_WIDGET_DEFINITIONS = JSON.parse(JSON.stringify(ALL_WIDGET_DEFINITIONS_METADATA)); // Deep copy metadata

    // Manually map imported functions to the initFunc property
    if (ALL_WIDGET_DEFINITIONS.timeWidget) ALL_WIDGET_DEFINITIONS.timeWidget.initFunc = setupTimeWidget;
    if (ALL_WIDGET_DEFINITIONS.weatherWidget) ALL_WIDGET_DEFINITIONS.weatherWidget.initFunc = setupWeatherWidget;
    if (ALL_WIDGET_DEFINITIONS.systemWidget) ALL_WIDGET_DEFINITIONS.systemWidget.initFunc = setupSystemWidget;
    if (ALL_WIDGET_DEFINITIONS.tasksWidget) ALL_WIDGET_DEFINITIONS.tasksWidget.initFunc = setupTasksWidget;
    if (ALL_WIDGET_DEFINITIONS.notesWidget) ALL_WIDGET_DEFINITIONS.notesWidget.initFunc = setupNotesWidget;
    if (ALL_WIDGET_DEFINITIONS.quickLinksWidget) ALL_WIDGET_DEFINITIONS.quickLinksWidget.initFunc = setupQuickLinksWidget;
    if (ALL_WIDGET_DEFINITIONS.youtubeWidget) ALL_WIDGET_DEFINITIONS.youtubeWidget.initFunc = setupYouTubeWidget;
    if (ALL_WIDGET_DEFINITIONS.calendarWidget) ALL_WIDGET_DEFINITIONS.calendarWidget.initFunc = setupCalendarWidget;
    if (ALL_WIDGET_DEFINITIONS.spotifyWidget) ALL_WIDGET_DEFINITIONS.spotifyWidget.initFunc = setupSpotifyWidget;
    if (ALL_WIDGET_DEFINITIONS.nexusVisualizerWidget) ALL_WIDGET_DEFINITIONS.nexusVisualizerWidget.initFunc = setupNexusVisualizerWidget;
    if (ALL_WIDGET_DEFINITIONS.snakeGameWidget) ALL_WIDGET_DEFINITIONS.snakeGameWidget.initFunc = setupSnakeGameWidget;
    if (ALL_WIDGET_DEFINITIONS.connectionMonitorWidget) ALL_WIDGET_DEFINITIONS.connectionMonitorWidget.initFunc = setupConnectionMonitorWidget;
    if (ALL_WIDGET_DEFINITIONS.chimeraAIChatWidget) ALL_WIDGET_DEFINITIONS.chimeraAIChatWidget.initFunc = setupChimeraAIChatWidget;
    if (ALL_WIDGET_DEFINITIONS.rssFeedWidget) ALL_WIDGET_DEFINITIONS.rssFeedWidget.initFunc = setupRssFeedWidget;
    if (ALL_WIDGET_DEFINITIONS.latinProverbsWidget) ALL_WIDGET_DEFINITIONS.latinProverbsWidget.initFunc = setupLatinProverbsWidget;
    if (ALL_WIDGET_DEFINITIONS.stocksWidget) ALL_WIDGET_DEFINITIONS.stocksWidget.initFunc = setupStocksWidget;
    if (ALL_WIDGET_DEFINITIONS.updatesWidget) ALL_WIDGET_DEFINITIONS.updatesWidget.initFunc = setupUpdatesWidget;
}


// --- Core Application Logic ---
function init() {
    mapWidgetSetupFunctions(); // Populate ALL_WIDGET_DEFINITIONS with actual functions
    loadSettingsAndWidgetsConfig();
    applyTheme(settings.theme); // This will also call initBackgroundParticles
    runStartupAnimation(() => {
        renderDashboardWidgets();
        setupGlobalEventListeners();
    });
}

function runStartupAnimation(callback) {
    if (!startupOverlay || !startupProgressFill || !startupStatusText) {
        if (dashboardGrid) {
            dashboardGrid.style.display = 'grid';
            dashboardGrid.style.opacity = '1';
            dashboardGrid.classList.add('visible');
        }
        if (callback) callback();
        return;
    }
    startupOverlay.classList.add('active');
    let progress = 0;
    const messages = [
        "DECRYPTING CORE KERNEL...", "LOADING HEURISTIC MODULES...", "CALIBRATING SENSOR ARRAY...",
        "ESTABLISHING NEXUS DATALINK...", "OPTIMIZING COGNITIVE MATRIX...", "SYSTEM ONLINE"
    ];
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 2;
        if (progress >= 100) {
            progress = 100;
            if (startupProgressFill) startupProgressFill.style.width = `${progress}%`;
            if (startupStatusText) startupStatusText.textContent = messages[messages.length - 1];
            clearInterval(interval);
            setTimeout(() => {
                if (startupOverlay) startupOverlay.classList.remove('active');
                if (callback) callback();
            }, 800);
        } else {
            if (startupProgressFill) startupProgressFill.style.width = `${progress}%`;
            if (startupStatusText) startupStatusText.textContent = messages[Math.min(Math.floor(progress / (100 / (messages.length - 1))), messages.length - 2)];
        }
    }, 180);
}

function setupGlobalEventListeners() {
    document.querySelectorAll('[data-action="open-settings"]').forEach(btn => {
        btn.addEventListener('click', openSettingsModal);
    });

    if (closeSettingsModalBtn) closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', handleSaveSettings);

    if (openWidgetLibraryBtn) openWidgetLibraryBtn.addEventListener('click', openWidgetLibrary);
    if (closeWidgetLibraryBtn) closeWidgetLibraryBtn.addEventListener('click', closeWidgetLibrary);

    if (settingsResetLayoutBtn) settingsResetLayoutBtn.addEventListener('click', handleFactoryResetSettings);
    if (saveLayoutToFileBtn) saveLayoutToFileBtn.addEventListener('click', handleSaveLayoutToFile);
    if (loadLayoutFromFileBtn) loadLayoutFromFileBtn.addEventListener('click', () => loadLayoutFileInput && loadLayoutFileInput.click());
    if (loadLayoutFileInput) loadLayoutFileInput.addEventListener('change', handleLoadLayoutFromFile);

    if (infoButton) infoButton.addEventListener('click', openInfoModal);
    if (closeInfoModalBtn) closeInfoModalBtn.addEventListener('click', closeInfoModal);

    const tabButtons = settingsModal?.querySelectorAll('.settings-tab-btn');
    const tabContents = settingsModal?.querySelectorAll('.settings-tab-content');
    tabButtons?.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents?.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const tabName = button.dataset.tab;
            settingsModal?.querySelector(`.settings-tab-content[data-tab-content="${tabName}"]`)?.classList.add('active');
        });
    });

    layoutModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => { /* Value is read on save */ });
    });
    setupContextMenu();
    window.addEventListener('resize', debounce(handleWindowResize, 250)); // Added resize listener

    if (closeWidgetSpecificSettingsModalBtn) closeWidgetSpecificSettingsModalBtn.addEventListener('click', closeWidgetSpecificSettingsModal);
    if (cancelWidgetSpecificSettingsBtn) cancelWidgetSpecificSettingsBtn.addEventListener('click', closeWidgetSpecificSettingsModal);
    if (saveWidgetSpecificSettingsBtn) saveWidgetSpecificSettingsBtn.addEventListener('click', handleSaveWidgetSpecificSettings);
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleWindowResize() {
    if (settings.layoutMode !== 'freeform' || !dashboardGrid) return;

    const dashboardRect = dashboardGrid.getBoundingClientRect();
    const widgets = dashboardGrid.querySelectorAll('.widget.freeform-layout');
    let settingsChanged = false;

    widgets.forEach(widgetEl => {
        const widgetKey = widgetEl.dataset.widgetKey;
        if (!widgetKey || !widgetsConfig[widgetKey] || !widgetsConfig[widgetKey].visible) {
            return;
        }

        let currentLeft = parseFloat(widgetEl.style.left);
        let currentTop = parseFloat(widgetEl.style.top);
        const widgetWidth = widgetEl.offsetWidth;
        const widgetHeight = widgetEl.offsetHeight;
        const padding = 5; // Small padding from edges

        let needsUpdate = false;

        // Check right boundary
        if (currentLeft + widgetWidth > dashboardRect.width - padding) {
            currentLeft = dashboardRect.width - widgetWidth - padding;
            needsUpdate = true;
        }
        // Check left boundary
        if (currentLeft < padding) {
            currentLeft = padding;
            needsUpdate = true;
        }
        // Check bottom boundary
        if (currentTop + widgetHeight > dashboardRect.height - padding) {
            currentTop = dashboardRect.height - widgetHeight - padding;
            needsUpdate = true;
        }
        // Check top boundary
        if (currentTop < padding) {
            currentTop = padding;
            needsUpdate = true;
        }

        if (needsUpdate) {
            widgetEl.style.left = `${currentLeft}px`;
            widgetEl.style.top = `${currentTop}px`;
            widgetsConfig[widgetKey].x = widgetEl.style.left;
            widgetsConfig[widgetKey].y = widgetEl.style.top;
            settingsChanged = true;
        }
    });

    if (settingsChanged) {
        saveAppSettings();
    }
}

function getDefaultWidgetConfig() {
    const defaultConfig = {};
    Object.entries(ALL_WIDGET_DEFINITIONS).forEach(([key, def]) => {
        defaultConfig[key] = {
            id: def.id, name: def.name, icon: def.icon,
            visible: def.defaultVisible,
            order: def.defaultOrder,
            col: def.defaultCol || 0,
            rowSpan: def.defaultRowSpan || 1,
            x: '10px', y: '10px',
            width: (def.minW) + 'px', height: (def.minH) + 'px',
            minW: def.minW, minH: def.minH,
            lastVideoId: 'jfKfPfyJRdk',
            lastSpotifyUri: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M',
            nexusPreset: 0,
            rssFeedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
            chatHistory: [],
            aiChatTTSEnabled: true
        };
    });

    // Default positions and sizes for freeform layout
    // Top Row
    if (defaultConfig.weatherWidget) Object.assign(defaultConfig.weatherWidget, { x: '20px', y: '20px', width: '320px', height: '240px' });
    if (defaultConfig.timeWidget) Object.assign(defaultConfig.timeWidget, { x: 'calc(50% - 220px)', y: '20px', width: '440px', height: '140px' }); // Clock Display (Top-Center, Bigger height, slightly wider)
    // Dynamic Updates: Positioned between Time and Calendar roughly
    // Time ends around calc(50% - 220px + 440px) = calc(50% + 220px)
    // Calendar starts at calc(100% - 280px - 20px)
    // Let's place Updates starting after Time, e.g., calc(50% + 220px + 20px) = calc(50% + 240px)
    // Moving it further right: Change 240px to 270px
    if (defaultConfig.updatesWidget) Object.assign(defaultConfig.updatesWidget, { x: 'calc(50% + 15%)', y: '20px', width: '380px', height: '220px' }); // Dynamic Updates (Shifted right, Taller)

    // Second Row
    if (defaultConfig.chimeraAIChatWidget) Object.assign(defaultConfig.chimeraAIChatWidget, { x: '20px', y: 'calc(50% - 200px)', width: '300px', height: '250px' }); // AI Chat (minH is now 200 from config)
    if (defaultConfig.spotifyWidget) Object.assign(defaultConfig.spotifyWidget, { x: 'calc(50% - 200px)', y: '170px', width: '400px', height: '190px' }); // Audio Relay (Adjusted y slightly)
    if (defaultConfig.calendarWidget) Object.assign(defaultConfig.calendarWidget, { x: 'calc(100% - 280px - 20px)', y: '20px', width: '280px', height: '280px' }); // Chronometer (Top-Right, y=20px to align with updates and time if possible)

    // Third Row / Main Content Area
    if (defaultConfig.youtubeWidget) Object.assign(defaultConfig.youtubeWidget, { x: 'calc(50% - 400px)', y: '470px', width: '800px', height: '550px' }); // Media Stream (Adjusted y)
    if (defaultConfig.rssFeedWidget) Object.assign(defaultConfig.rssFeedWidget, { x: 'calc(100% - 300px - 20px)', y: '320px', width: '300px', height: '380px' }); // Newsfeed position adjusted based on new Updates/Calendar y

    // Bottom Row / Anchored
    if (defaultConfig.quickLinksWidget) Object.assign(defaultConfig.quickLinksWidget, { x: '20px', y: 'calc(100% - 140px - 20px)', width: '300px', height: '140px' }); // Nav Matrix (Bottom-Left, Taller)
    // Stocks widget position needs to consider the new Calendar y and Newsfeed y
    // Calendar ends at 20px + 280px = 300px. Newsfeed starts at 320px, ends at 320px + 380px = 700px
    if (defaultConfig.stocksWidget) Object.assign(defaultConfig.stocksWidget, { x: 'calc(100% - 300px - 20px)', y: 'calc(320px + 380px + 20px)', width: '300px', height: 'calc(100% - (320px + 380px + 20px) - 20px)' }); // Market Watch (Fill remaining space at bottom right)

    return defaultConfig;
}

function loadSettingsAndWidgetsConfig() {
    const defaultSettings = {
        theme: 'chimera-dark',
        backgroundParticles: true,
        weatherApiKey: '', weatherLocation: '', youtubeApiKey: '',
        openaiApiKey: '', rssFeedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
        stocksTrackList: 'NASDAQ:AAPL,Apple Inc.\nBINANCE:BTCUSDT,Bitcoin',
        weatherUnit: 'metric', rssItemCount: 5,
        notes: '', tasks: [], layoutMode: 'freeform',
        aiChatTTSEnabled: true
    };
    try {
        const storedSettings = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'appSettings'));
        settings = { ...defaultSettings, ...storedSettings };
    } catch (e) { settings = { ...defaultSettings }; }

    try {
        const storedWidgetsConfig = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'widgetsConfig'));
        const freshDefaults = getDefaultWidgetConfig();
        widgetsConfig = {};
        for (const key in ALL_WIDGET_DEFINITIONS) { // Use mapped ALL_WIDGET_DEFINITIONS
            const def = ALL_WIDGET_DEFINITIONS[key];
            widgetsConfig[key] = {
                ...(freshDefaults[key] || {}),
                ...(storedWidgetsConfig ? storedWidgetsConfig[key] : {})
            };
            if (typeof widgetsConfig[key].visible !== 'boolean') widgetsConfig[key].visible = def.defaultVisible;
            if (!widgetsConfig[key].id) widgetsConfig[key].id = def.id;
            if (!widgetsConfig[key].minW) widgetsConfig[key].minW = def.minW;
            if (!widgetsConfig[key].minH) widgetsConfig[key].minH = def.minH;

            if (key === 'nexusVisualizerWidget' && typeof widgetsConfig[key].nexusPreset === 'undefined') widgetsConfig[key].nexusPreset = 0;
            if (key === 'rssFeedWidget' && typeof widgetsConfig[key].rssFeedUrl === 'undefined') widgetsConfig[key].rssFeedUrl = freshDefaults[key]?.rssFeedUrl || 'https://feeds.bbci.co.uk/news/world/rss.xml';

            if (key === 'chimeraAIChatWidget') {
                if (typeof widgetsConfig[key].chatHistory === 'undefined') widgetsConfig[key].chatHistory = [];
                if (typeof widgetsConfig[key].aiChatTTSEnabled === 'undefined') {
                    widgetsConfig[key].aiChatTTSEnabled = settings.aiChatTTSEnabled;
                }
            }
        }
    } catch (e) { widgetsConfig = getDefaultWidgetConfig(); }

    if (themeSelector) themeSelector.value = settings.theme;
    if (backgroundParticlesToggle) backgroundParticlesToggle.checked = settings.backgroundParticles;
    if (weatherApiKeyInput) weatherApiKeyInput.value = settings.weatherApiKey;
    if (weatherLocationInput) weatherLocationInput.value = settings.weatherLocation;
    if (youtubeApiKeyInput) youtubeApiKeyInput.value = settings.youtubeApiKey;
    if (openaiApiKeyInput) openaiApiKeyInput.value = settings.openaiApiKey;
    if (rssFeedUrlInput) rssFeedUrlInput.value = settings.rssFeedUrl;
    weatherUnitRadios.forEach(radio => { if (radio.value === settings.weatherUnit) radio.checked = true; });
    if (rssItemCountInput) rssItemCountInput.value = settings.rssItemCount;
    if (aiChatTTSToggle) aiChatTTSToggle.checked = settings.aiChatTTSEnabled;
    layoutModeRadios.forEach(radio => { if (radio.value === settings.layoutMode) radio.checked = true; });
    if (stocksTrackListInput) stocksTrackListInput.value = settings.stocksTrackList;
}

function saveAppSettings() {
    localStorage.setItem(STORAGE_PREFIX + 'appSettings', JSON.stringify(settings));
    localStorage.setItem(STORAGE_PREFIX + 'widgetsConfig', JSON.stringify(widgetsConfig));
}

async function initBackgroundParticles() {
    // Pass settings and tsParticles global to the utility function
    await utilInitBackgroundParticles(settings, tsParticles);
}


function applyTheme(themeName) {
    document.documentElement.className = '';
    if (themeName && themeName !== 'chimera-dark') {
        document.documentElement.classList.add(`theme-${themeName}`);
    }
    settings.theme = themeName;
    initBackgroundParticles();
}

function openSettingsModal() { loadSettingsAndWidgetsConfig(); if (settingsModal) settingsModal.classList.add('visible'); }
function closeSettingsModal() { if (settingsModal) settingsModal.classList.remove('visible'); }
function openInfoModal() { if (infoModal) infoModal.classList.add('visible'); }
function closeInfoModal() { if (infoModal) infoModal.classList.remove('visible'); }

function handleSaveSettings() {
    settings.theme = themeSelector?.value || 'chimera-dark';
    if (backgroundParticlesToggle) settings.backgroundParticles = backgroundParticlesToggle.checked;
    if (aiChatTTSToggle) settings.aiChatTTSEnabled = aiChatTTSToggle.checked;

    settings.weatherApiKey = weatherApiKeyInput?.value.trim() || '';
    settings.weatherLocation = weatherLocationInput?.value.trim() || '';
    settings.youtubeApiKey = youtubeApiKeyInput?.value.trim() || '';
    settings.openaiApiKey = openaiApiKeyInput?.value.trim() || '';
    settings.rssFeedUrl = rssFeedUrlInput?.value.trim() || 'https://feeds.bbci.co.uk/news/world/rss.xml';
    const selectedWeatherUnit = document.querySelector('input[name="weatherUnit"]:checked');
    if (selectedWeatherUnit) settings.weatherUnit = selectedWeatherUnit.value;
    settings.rssItemCount = parseInt(rssItemCountInput?.value) || 5;
    if (stocksTrackListInput) settings.stocksTrackList = stocksTrackListInput.value;

    const selectedLayoutMode = document.querySelector('input[name="layoutMode"]:checked');
    if (selectedLayoutMode) settings.layoutMode = selectedLayoutMode.value;

    applyTheme(settings.theme);
    saveAppSettings();
    closeSettingsModal();
    showToast('Settings saved. Applying changes...');

    if (widgetsConfig.chimeraAIChatWidget) {
        widgetsConfig.chimeraAIChatWidget.aiChatTTSEnabled = settings.aiChatTTSEnabled;
    }
    renderDashboardWidgets();
}

function handleFactoryResetSettings() {
    if (confirm("Are you sure you want to reset ALL settings and the dashboard layout to defaults? This includes clearing API keys and other configurations. This cannot be undone.")) {
        widgetsConfig = getDefaultWidgetConfig();

        // Reset all relevant settings to their factory defaults
        settings.theme = 'chimera-dark';
        settings.backgroundParticles = true;
        settings.layoutMode = 'freeform';
        settings.aiChatTTSEnabled = true;

        settings.weatherApiKey = '';
        settings.weatherLocation = '';
        settings.weatherUnit = 'metric';
        settings.youtubeApiKey = '';
        settings.openaiApiKey = '';
        settings.rssFeedUrl = 'https://feeds.bbci.co.uk/news/world/rss.xml';
        settings.rssItemCount = 5;
        settings.stocksTrackList = 'NASDAQ:AAPL,Apple Inc.\nBINANCE:BTCUSDT,Bitcoin';

        // Update UI elements in the settings modal
        if (themeSelector) themeSelector.value = settings.theme;
        if (backgroundParticlesToggle) backgroundParticlesToggle.checked = settings.backgroundParticles;
        layoutModeRadios.forEach(radio => radio.checked = (radio.value === settings.layoutMode));
        if (aiChatTTSToggle) aiChatTTSToggle.checked = settings.aiChatTTSEnabled;
        if (weatherApiKeyInput) weatherApiKeyInput.value = settings.weatherApiKey;
        if (weatherLocationInput) weatherLocationInput.value = settings.weatherLocation;
        weatherUnitRadios.forEach(radio => radio.checked = (radio.value === settings.weatherUnit));
        if (youtubeApiKeyInput) youtubeApiKeyInput.value = settings.youtubeApiKey;
        if (openaiApiKeyInput) openaiApiKeyInput.value = settings.openaiApiKey;
        if (rssFeedUrlInput) rssFeedUrlInput.value = settings.rssFeedUrl;
        if (rssItemCountInput) rssItemCountInput.value = settings.rssItemCount;
        if (stocksTrackListInput) stocksTrackListInput.value = settings.stocksTrackList;

        saveAppSettings();
        applyTheme(settings.theme);
        renderDashboardWidgets();
        showToast('All settings and layout reset to default.');
    }
}

function renderDashboardWidgets() {
    Object.values(widgetsConfig).forEach(conf => {
        const widgetEl = document.getElementById(conf.id);
        if (widgetEl) {
            if (widgetEl.dataset.snakeGameInterval) { clearInterval(parseInt(widgetEl.dataset.snakeGameInterval)); if(widgetEl.snakeKeydownHandler) document.removeEventListener('keydown', widgetEl.snakeKeydownHandler); delete widgetEl.snakeKeydownHandler; }
            if (widgetEl.particleInstance) widgetEl.particleInstance.destroy();
            if (widgetEl.connectionMonitorInterval) clearInterval(widgetEl.connectionMonitorInterval);
            if (widgetEl.rssFeedInterval) clearInterval(widgetEl.rssFeedInterval);
            if (widgetEl.dataset.timeWidgetInterval) clearInterval(parseInt(widgetEl.dataset.timeWidgetInterval));
            if (widgetEl.dataset.systemWidgetInterval) clearInterval(parseInt(widgetEl.dataset.systemWidgetInterval));
            if (widgetEl.chimeraAIChatRecognition && widgetEl.chimeraAIChatRecognition.abort) {
                 widgetEl.chimeraAIChatRecognition.abort();
            }
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        }
    });
    dashboardGrid.innerHTML = ''; dashboardGrid.className = 'dashboard-grid';

    if (settings.layoutMode === 'grid') {
        dashboardGrid.classList.remove('freeform');
        const columns = [ document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div') ];
        columns.forEach((col, i) => col.className = `dashboard-column col-${i}`);
        columns.forEach(col => dashboardGrid.appendChild(col));
        const widgetsByColumn = [[], [], [], []];
        Object.values(widgetsConfig).filter(c => c.visible)
              .forEach(c => {
                  const colIndex = (c.col >= 0 && c.col <= 3) ? c.col : 0;
                  widgetsByColumn[colIndex].push(c);
              });
        widgetsByColumn.forEach((colWidgets, colIndex) => {
            colWidgets.sort((a, b) => (a.order || 0) - (b.order || 0)).forEach(conf => {
                const el = createWidgetElement(conf);
                if (el) {
                    columns[colIndex].appendChild(el);
                    const def = ALL_WIDGET_DEFINITIONS[conf.id];
                    if (def?.initFunc) {
                         try {
                            // Pass necessary dependencies to widget setup functions
                            if (conf.id === 'weatherWidget') def.initFunc(el, conf, settings, OWM_ICON_MAP);
                            else if (conf.id === 'tasksWidget') def.initFunc(el, conf, settings, saveAppSettings, escapeHTML);
                            else if (conf.id === 'notesWidget') def.initFunc(el, conf, settings, saveAppSettings, showToast);
                            else if (conf.id === 'quickLinksWidget') def.initFunc(el, conf, openSettingsModal);
                            else if (conf.id === 'youtubeWidget') def.initFunc(el, conf, settings, widgetsConfig, saveAppSettings, showToast, escapeHTML);
                            else if (conf.id === 'spotifyWidget') def.initFunc(el, conf, widgetsConfig, saveAppSettings, showToast);
                            else if (conf.id === 'nexusVisualizerWidget') def.initFunc(el, conf, widgetsConfig, saveAppSettings, tsParticles);
                            else if (conf.id === 'chimeraAIChatWidget') def.initFunc(el, conf, settings, widgetsConfig, saveAppSettings, showToast, escapeHTML, openSettingsModal);
                            else if (conf.id === 'rssFeedWidget') def.initFunc(el, conf, settings, escapeHTML);
                            else if (conf.id === 'latinProverbsWidget') def.initFunc(el, conf, settings, escapeHTML);
                            else if (conf.id === 'stocksWidget') def.initFunc(el, conf, settings, escapeHTML);
                            else if (conf.id === 'updatesWidget') def.initFunc(el, conf, settings, escapeHTML);
                            else def.initFunc(el, conf, settings); // Default pass settings
                        } catch (e) { console.error(`Init error ${conf.id}:`, e); }
                    }
                }
            });
            // Add drop zone event listeners to the column div
            columns[colIndex].addEventListener('dragover', (event) => {
                event.preventDefault(); // Allow drop
                event.dataTransfer.dropEffect = 'move';
                // Optional: Add styling for drop target indication
                // columns[colIndex].classList.add('drag-over-column'); 
            });
            // Optional: Remove styling on dragleave
            // columns[colIndex].addEventListener('dragleave', () => {
            //     columns[colIndex].classList.remove('drag-over-column');
            // });
            columns[colIndex].addEventListener('drop', (event) => {
                event.preventDefault();
                // columns[colIndex].classList.remove('drag-over-column');
                const widgetId = event.dataTransfer.getData('text/plain');
                const targetColumnIndex = colIndex; 
                handleWidgetDropInColumn(widgetId, targetColumnIndex, event); // Pass event for potential y-position check for ordering
            });
        });
    } else {
        dashboardGrid.classList.add('freeform');
        Object.values(widgetsConfig).filter(c => c.visible).sort((a,b) => (a.order||0)-(b.order||0)).forEach(conf => {
            const el = createWidgetElement(conf);
            if (el) {
                dashboardGrid.appendChild(el);
                const def = ALL_WIDGET_DEFINITIONS[conf.id];
                if (def?.initFunc) {
                    try {
                        // Pass necessary dependencies to widget setup functions
                        if (conf.id === 'weatherWidget') def.initFunc(el, conf, settings, OWM_ICON_MAP);
                        else if (conf.id === 'tasksWidget') def.initFunc(el, conf, settings, saveAppSettings, escapeHTML);
                        else if (conf.id === 'notesWidget') def.initFunc(el, conf, settings, saveAppSettings, showToast);
                        else if (conf.id === 'quickLinksWidget') def.initFunc(el, conf, openSettingsModal);
                        else if (conf.id === 'youtubeWidget') def.initFunc(el, conf, settings, widgetsConfig, saveAppSettings, showToast, escapeHTML);
                        else if (conf.id === 'spotifyWidget') def.initFunc(el, conf, widgetsConfig, saveAppSettings, showToast);
                        else if (conf.id === 'nexusVisualizerWidget') def.initFunc(el, conf, widgetsConfig, saveAppSettings, tsParticles);
                        else if (conf.id === 'chimeraAIChatWidget') def.initFunc(el, conf, settings, widgetsConfig, saveAppSettings, showToast, escapeHTML, openSettingsModal);
                        else if (conf.id === 'rssFeedWidget') def.initFunc(el, conf, settings, escapeHTML);
                        else if (conf.id === 'latinProverbsWidget') def.initFunc(el, conf, settings, escapeHTML);
                        else if (conf.id === 'stocksWidget') def.initFunc(el, conf, settings, escapeHTML);
                        else if (conf.id === 'updatesWidget') def.initFunc(el, conf, settings, escapeHTML);
                        else def.initFunc(el, conf, settings); // Default pass settings
                    } catch (e) { console.error(`Init error ${conf.id}:`, e); }
                }
                makeWidgetDraggableAndResizable(el, conf);
            }
        });
    }
    if (!dashboardGrid.classList.contains('visible')) {
         dashboardGrid.classList.add('visible');
    }
}

function createWidgetElement(widgetConfig) {
    const def = ALL_WIDGET_DEFINITIONS[widgetConfig.id]; if (!def) return null;
    const el = document.createElement('article'); el.className = `widget ${def.id}-chimera`; el.id = def.id; el.dataset.widgetKey = def.id;

    // Make widget draggable in grid mode
    if (settings.layoutMode === 'grid') {
        el.draggable = true;
        el.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', def.id);
            event.dataTransfer.effectAllowed = 'move';
            // Optional: Add a class for styling the dragged element
            // event.target.classList.add('dragging-widget'); 
        });
        // Optional: Clear dragging style on dragend
        // el.addEventListener('dragend', (event) => {
        //     event.target.classList.remove('dragging-widget');
        // });
    }

    let showRefresh = !['timeWidget', 'quickLinksWidget', 'calendarWidget'].includes(def.id);
    if (['nexusVisualizerWidget', 'snakeGameWidget', 'connectionMonitorWidget', 'rssFeedWidget', 'weatherWidget', 'systemWidget', 'spotifyWidget', 'youtubeWidget', 'chimeraAIChatWidget', 'latinProverbsWidget', 'stocksWidget', 'updatesWidget'].includes(def.id)) showRefresh = true; // latinProverbsWidget can be refreshed, stocksWidget uses TradingView (less need for manual refresh)

    const hasSpecificSettings = def.configurableSettings && def.configurableSettings.length > 0;
    const specificSettingsBtnHtml = hasSpecificSettings ? `<button class="widget-btn widget-specific-settings-btn" data-widget-key="${def.id}" title="Widget Settings"><i class="fas fa-cog"></i></button>` : '';

    el.innerHTML = `<header class="widget-header"><h2 class="widget-title"><i class="fas ${def.icon}"></i> ${def.name}</h2><div class="widget-controls">${specificSettingsBtnHtml}${showRefresh ? `<button class="widget-btn" data-action="refresh-${def.id}" title="Refresh"><i class="fas fa-sync-alt"></i></button>` : ''}<button class="widget-btn" data-action="remove-${def.id}" title="Hide"><i class="fas fa-times-circle"></i></button></div></header><section class="widget-body"></section>`;
    
    if (hasSpecificSettings) {
        const specificSettingsBtn = el.querySelector('.widget-specific-settings-btn');
        if (specificSettingsBtn) {
            specificSettingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openWidgetSpecificSettingsModal(def.id);
            });
        }
    }

    const removeBtn = el.querySelector(`[data-action="remove-${def.id}"]`);
    if(removeBtn) removeBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        if (confirm(`Hide "${def.name}"? You can re-enable it from settings.`)) {
            if (el.dataset.snakeGameInterval) { clearInterval(parseInt(el.dataset.snakeGameInterval)); if(el.snakeKeydownHandler) document.removeEventListener('keydown', el.snakeKeydownHandler); delete el.snakeKeydownHandler; }
            if (el.particleInstance) el.particleInstance.destroy();
            if (el.connectionMonitorInterval) clearInterval(el.connectionMonitorInterval);
            if (el.rssFeedInterval) clearInterval(el.rssFeedInterval);
            if (el.dataset.timeWidgetInterval) clearInterval(parseInt(el.dataset.timeWidgetInterval));
            if (el.dataset.systemWidgetInterval) clearInterval(parseInt(el.dataset.systemWidgetInterval));
            if (el.chimeraAIChatRecognition && el.chimeraAIChatRecognition.abort) { el.chimeraAIChatRecognition.abort(); }
            if (window.speechSynthesis && window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); }

            widgetsConfig[def.id].visible = false; saveAppSettings(); renderDashboardWidgets();
            const cardStatus = widgetLibraryContainer?.querySelector(`.widget-card[data-widget-id="${def.id}"] .widget-card-status`);
            if (cardStatus) { cardStatus.textContent = 'INACTIVE'; cardStatus.className = 'widget-card-status inactive';}
        }
    });
    if (settings.layoutMode === 'freeform') {
        el.classList.add('freeform-layout');
        Object.assign(el.style, {
            position: 'absolute',
            left: widgetConfig.x || '10px',
            top: widgetConfig.y || '10px',
            width: widgetConfig.width || (def.minW * 1.1) + 'px',
            height: widgetConfig.height || (def.minH * 1.1) + 'px',
            minWidth: def.minW + 'px',
            minHeight: def.minH + 'px'
        });
        ['se', 'sw', 'ne', 'nw'].forEach(dir => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-handle-${dir}`; el.appendChild(handle);
        });
    } else {
        if (widgetConfig.rowSpan > 1) el.style.gridRow = `span ${widgetConfig.rowSpan}`;
        el.style.minHeight = `${def.minH}px`;

        if (def.id === 'spotifyWidget') el.style.height = widgetConfig.height || '190px';
        else if (['nexusVisualizerWidget', 'snakeGameWidget', 'chimeraAIChatWidget', 'rssFeedWidget', 'updatesWidget'].includes(def.id)) {
             el.style.height = widgetConfig.height || `${def.minH + 60}px`;
        } else {
            el.style.height = 'auto';
        }
    }
    return el;
}

function openWidgetLibrary() {
    if (!widgetLibraryModal || !widgetLibraryContainer) return;
    widgetLibraryContainer.innerHTML = '';
    Object.values(ALL_WIDGET_DEFINITIONS).sort((a,b) => (a.defaultOrder || 0) - (b.defaultOrder || 0)) // Use mapped ALL_WIDGET_DEFINITIONS
        .forEach(def => {
        const conf = widgetsConfig[def.id] || getDefaultWidgetConfig()[def.id];
        const card = document.createElement('div'); card.className = 'widget-card'; card.dataset.widgetId = def.id;
        card.innerHTML = `
            <div class="widget-card-header"><i class="fas ${def.icon}"></i><span>${def.name}</span></div>
            <p class="widget-card-description">Min Size: ${def.minW}x${def.minH}. Default Column: ${def.defaultCol || 'N/A'}.</p>
            <div class="widget-card-status ${conf.visible ? 'active' : 'inactive'}">${conf.visible ? 'ACTIVE' : 'INACTIVE'}</div>
        `;
        card.addEventListener('click', () => toggleWidgetVisibilityInLibrary(def.id, card));
        widgetLibraryContainer.appendChild(card);
    });
    widgetLibraryModal.classList.add('visible');
}

function closeWidgetLibrary() { if (widgetLibraryModal) widgetLibraryModal.classList.remove('visible'); }

function toggleWidgetVisibilityInLibrary(widgetKey, cardElement) {
    if (!widgetsConfig[widgetKey]) return;
    widgetsConfig[widgetKey].visible = !widgetsConfig[widgetKey].visible; saveAppSettings(); renderDashboardWidgets();
    if (cardElement) {
        const statusDiv = cardElement.querySelector('.widget-card-status');
        if (statusDiv) { statusDiv.textContent = widgetsConfig[widgetKey].visible ? 'ACTIVE' : 'INACTIVE'; statusDiv.className = `widget-card-status ${widgetsConfig[widgetKey].visible ? 'active' : 'inactive'}`; }
    }
    showToast(`${ALL_WIDGET_DEFINITIONS[widgetKey].name} is now ${widgetsConfig[widgetKey].visible ? 'visible' : 'hidden'}.`);
}

function makeWidgetDraggableAndResizable(widgetEl, conf) {
    if (!widgetEl || !conf) return;
    let isDragging = false, isResizing = false;
    let startX, startY, startLeft, startTop, startWidth, startHeight;
    let currentResizeHandle = null;
    const header = widgetEl.querySelector('.widget-header');

    if (header) {
        header.style.cursor = 'grab';
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.widget-btn') || e.target.closest('.resize-handle')) return;
            isDragging = true; widgetEl.classList.add('dragging');
            document.querySelectorAll('.widget.freeform-layout').forEach(w => w.style.zIndex = '900');
            widgetEl.style.zIndex = '901';
            startX = e.clientX; startY = e.clientY;
            startLeft = widgetEl.offsetLeft; startTop = widgetEl.offsetTop;
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', onDragEnd);
            e.preventDefault();
        });
    }
    widgetEl.querySelectorAll('.resize-handle').forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation(); isResizing = true; currentResizeHandle = handle;
            widgetEl.classList.add('resizing');
            document.querySelectorAll('.widget.freeform-layout').forEach(w => w.style.zIndex = '900');
            widgetEl.style.zIndex = '901';
            startX = e.clientX; startY = e.clientY;
            startWidth = widgetEl.offsetWidth; startHeight = widgetEl.offsetHeight;
            startLeft = widgetEl.offsetLeft; startTop = widgetEl.offsetTop;
            document.addEventListener('mousemove', onResize);
            document.addEventListener('mouseup', onResizeEnd);
            e.preventDefault();
        });
    });
    function onDrag(e) {
        if (!isDragging) return;
        let newLeft = startLeft + (e.clientX - startX); let newTop = startTop + (e.clientY - startY);
        const padding = 5;
        newLeft = Math.max(padding, Math.min(newLeft, dashboardGrid.clientWidth - widgetEl.offsetWidth - padding));
        newTop = Math.max(padding, Math.min(newTop, dashboardGrid.clientHeight - widgetEl.offsetHeight - padding));
        widgetEl.style.left = `${newLeft}px`; widgetEl.style.top = `${newTop}px`;
    }
    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false; widgetEl.classList.remove('dragging');
        conf.x = widgetEl.style.left; conf.y = widgetEl.style.top;
        saveAppSettings(); document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', onDragEnd);
    }
    function onResize(e) {
        if (!isResizing || !currentResizeHandle) return;
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        let newWidth = startWidth; let newHeight = startHeight;
        let newLeft = startLeft; let newTop = startTop;

        const minW = parseInt(widgetEl.style.minWidth) || conf.minW || 150;
        const minH = parseInt(widgetEl.style.minHeight) || conf.minH || 100;
        const padding = 5;

        if (currentResizeHandle.classList.contains('resize-handle-se')) {
            newWidth = Math.max(minW, startWidth + dx);
            newHeight = Math.max(minH, startHeight + dy);
        } else if (currentResizeHandle.classList.contains('resize-handle-sw')) {
            newWidth = Math.max(minW, startWidth - dx);
            newHeight = Math.max(minH, startHeight + dy);
            newLeft = startLeft + (startWidth - newWidth);
        } else if (currentResizeHandle.classList.contains('resize-handle-ne')) {
            newWidth = Math.max(minW, startWidth + dx);
            newHeight = Math.max(minH, startHeight - dy);
            newTop = startTop + (startHeight - newHeight);
        } else if (currentResizeHandle.classList.contains('resize-handle-nw')) {
            newWidth = Math.max(minW, startWidth - dx);
            newHeight = Math.max(minH, startHeight - dy);
            newLeft = startLeft + (startWidth - newWidth);
            newTop = startTop + (startHeight - newHeight);
        }

        if (newLeft < padding) { newWidth -= (padding - newLeft); newLeft = padding; }
        if (newTop < padding) { newHeight -= (padding - newTop); newTop = padding; }
        if (newLeft + newWidth > dashboardGrid.clientWidth - padding) { newWidth = dashboardGrid.clientWidth - padding - newLeft; }
        if (newTop + newHeight > dashboardGrid.clientHeight - padding) { newHeight = dashboardGrid.clientHeight - padding - newTop; }

        if (newWidth >= minW) {
            widgetEl.style.width = `${newWidth}px`;
            widgetEl.style.left = `${newLeft}px`;
        }
        if (newHeight >= minH) {
            widgetEl.style.height = `${newHeight}px`;
            widgetEl.style.top = `${newTop}px`;
        }

        if (widgetEl.onWidgetResize) widgetEl.onWidgetResize(widgetEl.offsetWidth, widgetEl.offsetHeight);
    }
    function onResizeEnd() {
        if (!isResizing) return;
        isResizing = false; widgetEl.classList.remove('resizing');
        conf.x = widgetEl.style.left; conf.y = widgetEl.style.top;
        conf.width = widgetEl.style.width; conf.height = widgetEl.style.height;
        saveAppSettings(); currentResizeHandle = null;
        document.removeEventListener('mousemove', onResize); document.removeEventListener('mouseup', onResizeEnd);
    }
}

function setupContextMenu() {
    if (!customContextMenu || !dashboardGrid) return;
    dashboardGrid.addEventListener('contextmenu', (e) => {
        e.preventDefault(); const { clientX: mouseX, clientY: mouseY } = e; customContextMenu.style.display = 'block';
        const menuWidth = customContextMenu.offsetWidth, menuHeight = customContextMenu.offsetHeight;
        let top = mouseY, left = mouseX; const vpW = window.innerWidth, vpH = window.innerHeight;
        if (mouseY + menuHeight > vpH) top = vpH - menuHeight - 5; if (mouseX + menuWidth > vpW) left = vpW - menuWidth - 5;
        customContextMenu.style.top = `${Math.max(0, top)}px`; customContextMenu.style.left = `${Math.max(0, left)}px`;
    });
    document.addEventListener('click', (e) => { if (customContextMenu?.style.display === 'block' && !customContextMenu.contains(e.target)) customContextMenu.style.display = 'none'; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && customContextMenu?.style.display === 'block') customContextMenu.style.display = 'none'; });
    customContextMenu.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            switch (action) {
                case 'open-settings-context': openSettingsModal(); break;
                case 'open-widget-library-context': openWidgetLibrary(); break;
                case 'toggle-layout-mode-context': handleToggleLayoutMode(); break;
                case 'reset-layout-context': handleContextMenuResetLayout(); break;
                case 'open-info-context': openInfoModal(); break;
            }
            customContextMenu.style.display = 'none';
        });
    });
}
function handleToggleLayoutMode() {
    settings.layoutMode = (settings.layoutMode === 'grid') ? 'freeform' : 'grid';
    layoutModeRadios.forEach(radio => radio.checked = (radio.value === settings.layoutMode));
    saveAppSettings(); renderDashboardWidgets(); showToast(`Layout mode: ${settings.layoutMode}.`);
}

function openWidgetSpecificSettingsModal(widgetKey) {
    currentEditingWidgetKey = widgetKey;
    const widgetDef = ALL_WIDGET_DEFINITIONS[widgetKey];
    if (!widgetDef || !widgetSpecificSettingsModal || !widgetSpecificSettingsTitle || !widgetSpecificSettingsBody) {
        console.error("Cannot open widget specific settings: Definitions or modal elements missing.");
        return;
    }

    widgetSpecificSettingsTitle.innerHTML = `<i class="fas ${widgetDef.icon}"></i> ${widgetDef.name} Settings`;
    widgetSpecificSettingsBody.innerHTML = ''; // Clear previous content

    if (!widgetDef.configurableSettings || widgetDef.configurableSettings.length === 0) {
        widgetSpecificSettingsBody.innerHTML = '<p>This widget has no specific settings.</p>';
    } else {
        widgetDef.configurableSettings.forEach(settingKey => {
            const settingItem = document.createElement('div');
            settingItem.className = 'setting-item';

            const label = document.createElement('label');
            label.htmlFor = `wss-${settingKey}`;
            // Generate a more human-readable label (e.g., 'weatherApiKey' -> 'Weather API Key')
            label.textContent = settingKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ':';
            
            let inputElement;
            const currentValue = settings[settingKey]; // Assuming all these settings are stored directly in the main 'settings' object

            // Determine input type based on settingKey or a predefined map
            if (settingKey === 'stocksTrackList') {
                inputElement = document.createElement('textarea');
                inputElement.rows = 4;
                inputElement.placeholder = ALL_WIDGET_DEFINITIONS_METADATA.stocksWidget.trackListPlaceholder || 'Enter symbols...'; // Placeholder if needed
            } else if (settingKey === 'weatherUnit') {
                inputElement = document.createElement('select');
                const units = [{value: 'metric', text: 'Celsius'}, {value: 'imperial', text: 'Fahrenheit'}];
                units.forEach(unit => {
                    const option = document.createElement('option');
                    option.value = unit.value;
                    option.textContent = unit.text;
                    if (currentValue === unit.value) option.selected = true;
                    inputElement.appendChild(option);
                });
            } else if (settingKey === 'aiChatTTSEnabled') {
                inputElement = document.createElement('input');
                inputElement.type = 'checkbox';
                inputElement.checked = currentValue;
                // For checkboxes, the label structure is often different (label wraps input or is sibling)
                // For simplicity, we'll adjust label association if needed, or rely on main settings modal structure
                label.className = 'checkbox-label'; // Use existing class if helpful
                const labelTextNode = document.createTextNode(label.textContent); // Keep original label text
                label.textContent = ''; // Clear label text before appending input
                label.appendChild(inputElement);
                label.appendChild(labelTextNode); // Add text after checkbox
            } else if (settingKey.toLowerCase().includes('apikey')) {
                inputElement = document.createElement('input');
                inputElement.type = 'password'; // Mask API keys
            } else if (settingKey === 'rssItemCount') {
                 inputElement = document.createElement('input');
                 inputElement.type = 'number';
                 inputElement.min = '1';
                 inputElement.max = '15';
            } else {
                inputElement = document.createElement('input');
                inputElement.type = 'text';
            }

            inputElement.id = `wss-${settingKey}`;
            inputElement.name = settingKey;
            if (typeof currentValue !== 'boolean') {
                 inputElement.value = currentValue || '';
            }
             // If it's not the checkbox (which has label structure modified), append label then input
            if (settingKey !== 'aiChatTTSEnabled') {
                settingItem.appendChild(label);
            }
            settingItem.appendChild(inputElement);

            // Add notes for API keys like in the main settings
            if (settingKey === 'openaiApiKey') {
                const note = document.createElement('p');
                note.className = 'api-key-note';
                note.textContent = 'Key stored locally. Usage billed to your OpenAI account.';
                settingItem.appendChild(note);
            }
            if (settingKey.toLowerCase().includes('apikey') || settingKey === 'rssFeedUrl' || settingKey === 'stocksTrackList') {
                 if (settingKey !== 'openaiApiKey') { // Avoid duplicate global note if already handled by specific key note
                    const globalNote = document.createElement('p');
                    globalNote.className = 'api-key-note';
                    if(settingKey === 'stocksTrackList') {
                        globalNote.innerHTML = 'Format: <code>SYMBOL,DisplayName</code>. One per line.';
                    } else if (settingKey === 'rssFeedUrl') {
                        globalNote.textContent = 'Ensure feed server allows cross-origin requests or use a proxy.';
                    } else {
                        globalNote.textContent = 'API keys are stored locally in your browser.';
                    }
                    settingItem.appendChild(globalNote);
                 }
            }


            widgetSpecificSettingsBody.appendChild(settingItem);
        });
    }
    if (widgetSpecificSettingsModal) widgetSpecificSettingsModal.classList.add('visible');
}

function closeWidgetSpecificSettingsModal() {
    if (widgetSpecificSettingsModal) widgetSpecificSettingsModal.classList.remove('visible');
    currentEditingWidgetKey = null;
}

function handleSaveWidgetSpecificSettings() {
    if (!currentEditingWidgetKey || !widgetSpecificSettingsBody) return;

    const widgetDef = ALL_WIDGET_DEFINITIONS[currentEditingWidgetKey];
    if (!widgetDef || !widgetDef.configurableSettings) return;

    widgetDef.configurableSettings.forEach(settingKey => {
        const inputElement = widgetSpecificSettingsBody.querySelector(`#wss-${settingKey}`);
        if (inputElement) {
            if (inputElement.type === 'checkbox') {
                settings[settingKey] = inputElement.checked;
            } else if (inputElement.type === 'number') {
                settings[settingKey] = parseInt(inputElement.value) || ALL_WIDGET_DEFINITIONS_METADATA[currentEditingWidgetKey]?.defaultRssItemCount || 5; // Fallback logic for numbers
            } else {
                settings[settingKey] = inputElement.value;
            }
        }
    });

    saveAppSettings();
    // Update the main settings modal inputs if it were open and visible (for sync)
    // This part can be complex, for now, we rely on reopening main settings to see changes.
    // Or, more simply, update the main settings form fields directly if they exist.
    if (settings.theme) themeSelector.value = settings.theme; // Example of updating main settings
    if (openaiApiKeyInput && typeof settings.openaiApiKey !== 'undefined') openaiApiKeyInput.value = settings.openaiApiKey;
    // ... update other relevant fields in the main settings form ...
    if (weatherApiKeyInput && typeof settings.weatherApiKey !== 'undefined') weatherApiKeyInput.value = settings.weatherApiKey;
    if (weatherLocationInput && typeof settings.weatherLocation !== 'undefined') weatherLocationInput.value = settings.weatherLocation;
    if (document.querySelector(`input[name="weatherUnit"][value="${settings.weatherUnit}"]`)) {
        document.querySelector(`input[name="weatherUnit"][value="${settings.weatherUnit}"]`).checked = true;
    }
    if (rssFeedUrlInput && typeof settings.rssFeedUrl !== 'undefined') rssFeedUrlInput.value = settings.rssFeedUrl;
    if (rssItemCountInput && typeof settings.rssItemCount !== 'undefined') rssItemCountInput.value = settings.rssItemCount;
    if (aiChatTTSToggle && typeof settings.aiChatTTSEnabled !== 'undefined') aiChatTTSToggle.checked = settings.aiChatTTSEnabled;
    if (stocksTrackListInput && typeof settings.stocksTrackList !== 'undefined') stocksTrackListInput.value = settings.stocksTrackList;
    if (youtubeApiKeyInput && typeof settings.youtubeApiKey !== 'undefined') youtubeApiKeyInput.value = settings.youtubeApiKey;
    // End sync with main settings form fields


    closeWidgetSpecificSettingsModal();
    showToast(`${widgetDef.name} settings updated. Applying changes...`);
    
    // Re-render all widgets to apply changes. 
    // A more optimized approach would be to re-render only the specific widget (currentEditingWidgetKey)
    // but that requires more intricate handling of widget re-initialization.
    renderDashboardWidgets(); 
}

// New Function: Save Layout to File
function handleSaveLayoutToFile() {
    try {
        const layoutToSave = JSON.stringify(widgetsConfig, null, 2);
        const blob = new Blob([layoutToSave], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
        a.download = `chimera_layout_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Layout saved to file successfully!');
    } catch (error) {
        console.error("Error saving layout to file:", error);
        showToast('Error saving layout. Check console.', 5000);
    }
}

// New Function: Load Layout from File
function handleLoadLayoutFromFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const loadedConfig = JSON.parse(e.target.result);
            // Basic validation - check if it's an object
            if (typeof loadedConfig !== 'object' || loadedConfig === null) {
                throw new Error("Invalid file format. Expected a JSON object.");
            }

            // More robust merging: ensure all defined widgets are present, update existing, keep defaults for new
            const currentWidgetKeys = Object.keys(ALL_WIDGET_DEFINITIONS);
            const newWidgetsConfig = { ...widgetsConfig }; // Start with a copy of current or default config

            for (const key of currentWidgetKeys) {
                if (loadedConfig[key]) {
                    // If widget exists in loaded config, update it, but ensure core properties are not lost
                    newWidgetsConfig[key] = {
                        ...(ALL_WIDGET_DEFINITIONS[key] ? getDefaultWidgetConfig()[key] : {}), // Base defaults for this widget type
                        ...newWidgetsConfig[key], // Values from current running config
                        ...loadedConfig[key] // Override with loaded values
                    };
                    // Ensure essential fields like id and visibility are correctly typed or defaulted
                    newWidgetsConfig[key].id = ALL_WIDGET_DEFINITIONS[key]?.id || key;
                    if (typeof newWidgetsConfig[key].visible !== 'boolean') {
                        newWidgetsConfig[key].visible = ALL_WIDGET_DEFINITIONS[key]?.defaultVisible || false;
                    }
                } else if (!newWidgetsConfig[key] && ALL_WIDGET_DEFINITIONS[key]) {
                    // Widget defined in app but not in loaded file, ensure it gets its default config
                    newWidgetsConfig[key] = getDefaultWidgetConfig()[key];
                }
            }
             // Prune any widgets from loadedConfig that are no longer in ALL_WIDGET_DEFINITIONS
            for (const key in newWidgetsConfig) {
                if (!ALL_WIDGET_DEFINITIONS[key]) {
                    delete newWidgetsConfig[key];
                }
            }

            widgetsConfig = newWidgetsConfig;
            saveAppSettings();
            renderDashboardWidgets();
            showToast('Layout loaded successfully!');
        } catch (error) {
            console.error("Error loading layout from file:", error);
            showToast(`Error loading layout: ${error.message}`, 5000);
        } finally {
            loadLayoutFileInput.value = ''; // Reset file input
        }
    };
    reader.onerror = function() {
        showToast('Error reading file.', 5000);
        loadLayoutFileInput.value = ''; // Reset file input
    };
    reader.readAsText(file);
}

// New function for Context Menu Reset (Layout Only)
function handleContextMenuResetLayout() {
    if (confirm("Are you sure you want to reset the dashboard layout to its default widget positions, sizes, and visibility? Your API keys and other configurations will NOT be changed.")) {
        widgetsConfig = getDefaultWidgetConfig(); // Only reset widget configurations
        // Note: We are NOT resetting the main 'settings' object here.

        saveAppSettings();
        renderDashboardWidgets();
        showToast('Dashboard layout reset to default.');
    }
}

// New function to handle widget drop in grid mode
function handleWidgetDropInColumn(widgetId, targetColumnIndex, dropEvent) {
    if (!widgetsConfig[widgetId]) return;

    const oldColumnIndex = widgetsConfig[widgetId].col;
    const oldOrder = widgetsConfig[widgetId].order;

    // Update column
    widgetsConfig[widgetId].col = targetColumnIndex;

    // Reorder widgets: Simple append to new column, then re-evaluate order for all in that column
    // Remove from old position (conceptually, re-render will do this)
    // Add to new position and determine order

    // A simple re-ordering strategy: place it at an order value that ensures it's last in the new column for now.
    // More sophisticated logic would involve checking dropEvent.clientY relative to other widgets in the column.
    const widgetsInTargetColumn = Object.values(widgetsConfig).filter(w => w.visible && w.col === targetColumnIndex && w.id !== widgetId);
    widgetsConfig[widgetId].order = widgetsInTargetColumn.length; // Assign as last item

    // Normalize order for all widgets in the target column after the move
    let orderCounter = 0;
    Object.values(widgetsConfig)
        .filter(w => w.visible && w.col === targetColumnIndex)
        .sort((a, b) => (a.id === widgetId ? Infinity : a.order) - (b.id === widgetId ? Infinity : b.order)) // Tentatively place dropped item last
        .forEach(w => {
            if (w.id === widgetId) { // Assign its final order based on this re-sort
                widgetsConfig[widgetId].order = orderCounter++;
            } else if (w.order !== orderCounter) { // If other widgets order changed due to a shift
                 widgetsConfig[w.id].order = orderCounter++;
            }
            // If its the dropped widget and it's been placed, or its order is already correct.
        });
     // Normalize order for the source column if the widget moved from a different column
    if (oldColumnIndex !== targetColumnIndex) {
        orderCounter = 0;
        Object.values(widgetsConfig)
            .filter(w => w.visible && w.col === oldColumnIndex)
            .sort((a,b) => a.order - b.order)
            .forEach(w => {
                widgetsConfig[w.id].order = orderCounter++;
            });
    }


    showToast(`${ALL_WIDGET_DEFINITIONS[widgetId].name} moved to column ${targetColumnIndex + 1}`);
    saveAppSettings();
    renderDashboardWidgets(); 
}

// Initialize the application
init();