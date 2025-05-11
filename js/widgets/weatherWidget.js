// js/widgets/weatherWidget.js
// Note: OWM_ICON_MAP and settings will be passed from main.js or accessed globally if main.js exposes them.
// For this structure, we'll assume they are passed if needed, or main.js handles access.

async function fetchWeatherData(widgetEl, conf, settings, OWM_ICON_MAP, lat, lon) {
    const iconEl = widgetEl.querySelector(`#weatherIcon-${conf.id}`), tempEl = widgetEl.querySelector(`#weatherTemp-${conf.id}`),
          locEl = widgetEl.querySelector(`#weatherLocation-${conf.id}`), descEl = widgetEl.querySelector(`#weatherDescription-${conf.id}`),
          feelsEl = widgetEl.querySelector(`#weatherFeelsLike-${conf.id}`), windEl = widgetEl.querySelector(`#weatherWind-${conf.id}`),
          humEl = widgetEl.querySelector(`#weatherHumidity-${conf.id}`), pressEl = widgetEl.querySelector(`#weatherPressure-${conf.id}`);
    if (!iconEl || !tempEl || !locEl || !descEl || !feelsEl || !windEl || !humEl || !pressEl) return;
    if (!settings.weatherApiKey) {
        locEl.textContent = "API Key Missing"; iconEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i>'; descEl.textContent = "Set key in settings"; tempEl.textContent = '--°';
        [feelsEl, windEl, humEl, pressEl].forEach(el => el.textContent = '--'); return;
    }
    iconEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; locEl.textContent = "Fetching..."; descEl.textContent = '--'; tempEl.textContent = '--°';
    [feelsEl, windEl, humEl, pressEl].forEach(el => el.textContent = '--');

    const units = settings.weatherUnit || 'metric';
    const unitSymbol = units === 'metric' ? 'C' : 'F';

    let apiUrl;
    if (lat && lon) apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${settings.weatherApiKey}&units=${units}`;
    else if (settings.weatherLocation) apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(settings.weatherLocation)}&appid=${settings.weatherApiKey}&units=${units}`;
    else { apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${settings.weatherApiKey}&units=${units}`; locEl.textContent = "Default: London"; }

    try {
        const response = await fetch(apiUrl); if (!response.ok) { const err = await response.json().catch(() => null); throw new Error(`API Error (${response.status}): ${err?.message || response.statusText}`); }
        const data = await response.json();
        iconEl.innerHTML = `<i class="${OWM_ICON_MAP[data.weather[0].icon] || 'fas fa-question-circle'}"></i>`;
        tempEl.textContent = `${Math.round(data.main.temp)}°${unitSymbol}`;
        locEl.textContent = `${data.name}, ${data.sys.country}`; descEl.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        feelsEl.textContent = `${Math.round(data.main.feels_like)}°${unitSymbol}`;
        const windSpeedUnit = units === 'metric' ? 'km/h' : 'mph';
        const windSpeed = units === 'metric' ? (data.wind.speed * 3.6).toFixed(1) : data.wind.speed.toFixed(1);
        windEl.textContent = `${windSpeed} ${windSpeedUnit}`;
        humEl.textContent = `${data.main.humidity}%`; pressEl.textContent = `${data.main.pressure} hPa`;
    } catch (error) {
        locEl.textContent = settings.weatherLocation ? `Error: ${settings.weatherLocation}` : "Error Fetching Location";
        descEl.textContent = error.message.substring(0,27) + "..."; iconEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        tempEl.textContent = `--°${unitSymbol}`;
    }
}

export function setupWeatherWidget(widgetEl, conf, settings, OWM_ICON_MAP_INSTANCE) { // Receive settings and OWM_ICON_MAP
    const body = widgetEl.querySelector('.widget-body');
    if (!body) return; body.style.display = 'block';
    body.innerHTML = `
        <div class="weather-main-display">
            <div class="weather-icon" id="weatherIcon-${conf.id}"><i class="fas fa-spinner fa-spin"></i></div>
            <div class="weather-temp" id="weatherTemp-${conf.id}">--°</div>
        </div>
        <div class="weather-location" id="weatherLocation-${conf.id}">Loading...</div>
        <div class="weather-description" id="weatherDescription-${conf.id}">--</div>
        <div class="weather-details-grid">
            <div><i class="fas fa-temperature-arrow-down"></i> Feels: <span id="weatherFeelsLike-${conf.id}">--°</span></div>
            <div><i class="fas fa-wind"></i> Wind: <span id="weatherWind-${conf.id}">--</span></div>
            <div><i class="fas fa-droplet"></i> Humidity: <span id="weatherHumidity-${conf.id}">--%</span></div>
            <div><i class="fas fa-gauge-high"></i> Pressure: <span id="weatherPressure-${conf.id}">-- hPa</span></div>
        </div>`;
    const refreshWeatherData = () => {
        const locEl = widgetEl.querySelector(`#weatherLocation-${conf.id}`);
        if (settings.weatherLocation) {
            fetchWeatherData(widgetEl, conf, settings, OWM_ICON_MAP_INSTANCE);
        } else if (navigator.geolocation) {
            if (locEl) locEl.textContent = "Detecting...";
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeatherData(widgetEl, conf, settings, OWM_ICON_MAP_INSTANCE, pos.coords.latitude, pos.coords.longitude),
                () => { if (locEl) locEl.textContent = "Detect Failed"; fetchWeatherData(widgetEl, conf, settings, OWM_ICON_MAP_INSTANCE); },
                { timeout: 10000 }
            );
        } else { if (locEl) locEl.textContent = "No Geo"; fetchWeatherData(widgetEl, conf, settings, OWM_ICON_MAP_INSTANCE); }
    };
    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (refreshBtn) refreshBtn.addEventListener('click', refreshWeatherData);
    refreshWeatherData();
}