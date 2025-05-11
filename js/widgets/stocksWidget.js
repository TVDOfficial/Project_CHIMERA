// js/widgets/stocksWidget.js

export function setupStocksWidget(widgetEl, conf, settingsRef, escapeHTMLFunc) {
    const body = widgetEl.querySelector('.widget-body');
    if (!body) return;

    const widgetContainerId = `tradingview_widget_container_${conf.id}`;
    body.innerHTML = `<div id="${widgetContainerId}" class="tradingview-widget-container__widget"></div>`;

    function renderWidget() {
        // Clear previous widget script if any to prevent duplicates
        const oldScripts = document.querySelectorAll(`script[data-widget-id="${conf.id}"]`);
        oldScripts.forEach(s => s.remove());
        
        // Clear container content
        const container = document.getElementById(widgetContainerId);
        if (container) container.innerHTML = '';


        let userSymbols = [];
        const rawSymbolLines = settingsRef.stocksTrackList?.split('\\n') || [];

        rawSymbolLines.forEach(line => {
            const parts = line.split(',');
            if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
                userSymbols.push({ s: parts[0].trim(), d: parts[1].trim() });
            } else if (parts.length === 1 && parts[0].trim()) {
                // If only symbol is provided, use it as description too (or leave description blank if TV handles it)
                userSymbols.push({ s: parts[0].trim(), d: parts[0].trim() });
            }
        });

        if (userSymbols.length === 0) {
            // Add some default popular symbols if the user list is empty
            userSymbols = [
                { "s": "NASDAQ:AAPL", "d": "Apple" },
                { "s": "NASDAQ:MSFT", "d": "Microsoft" },
                { "s": "NASDAQ:GOOGL", "d": "Alphabet" },
                { "s": "NASDAQ:AMZN", "d": "Amazon" },
                { "s": "NASDAQ:TSLA", "d": "Tesla" },
                { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
                { "s": "BINANCE:ETHUSDT", "d": "Ethereum" }
            ];
        }
        
        const currentTheme = settingsRef.theme || 'chimera-dark';
        const tvTheme = (currentTheme === 'chimera-light') ? 'light' : 'dark';


        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
        script.async = true;
        script.dataset.widgetId = conf.id; // Mark script for potential cleanup
        
        script.innerHTML = JSON.stringify({
            "colorTheme": tvTheme,
            "dateRange": "12M",
            "showChart": true,
            "locale": "en",
            "largeChartUrl": "",
            "isTransparent": true, // Make it transparent to fit our UI better
            "showSymbolLogo": true,
            "showFloatingTooltip": false,
            "width": "100%",
            "height": "100%",
            "plotLineColorGrowing": "rgba(41, 98, 255, 1)", // Example blue
            "plotLineColorFalling": "rgba(255, 64, 129, 1)", // Example pink/red
            "gridLineColor": "rgba(94, 94, 94, 0.15)", // Subtle grid
            "scaleFontColor": "rgba(200, 200, 200, 0.9)",
            "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
            "belowLineFillColorFalling": "rgba(255, 64, 129, 0.12)",
            "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
            "belowLineFillColorFallingBottom": "rgba(255, 64, 129, 0)",
            "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
            "tabs": [
                {
                    "title": "Watchlist", // Single tab for the user's selected symbols
                    "symbols": userSymbols,
                    "originalTitle": "Watchlist"
                }
            ]
        });

        if (container) {
            container.appendChild(script);
        } else {
            console.error(`TradingView widget container not found: #${widgetContainerId}`);
        }
    }

    renderWidget();

    // TradingView widgets are self-contained, refresh is typically not needed from our side unless settings change
    // However, if the theme changes, we need to re-render.
    // The main.js handleSaveSettings calls renderDashboardWidgets(), which should re-initialize this widget.
    // So, a direct refresh button on the widget itself might not be necessary here.
    // If a refresh button *is* desired for some reason (e.g. to force re-fetch defaults if list is empty),
    // it would call renderWidget().

    // Ensure we clean up the script tag if the widget is removed/re-rendered.
    // This is partially handled by renderWidget itself and main.js clearing widget intervals/specific data.
    // Here we can add more specific cleanup if needed when widgetEl is about to be destroyed.
    // For now, the script removal at the start of renderWidget should suffice.
} 