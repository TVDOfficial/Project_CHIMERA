// js/widgets/nexusVisualizerWidget.js
// Relies on `widgetsConfig`, `saveAppSettings` from main.js.
// And `tsParticles` global instance.

export function setupNexusVisualizerWidget(widgetEl, conf, widgetsConfigRef, saveAppSettingsFunc, tsParticlesInstance) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;
    body.innerHTML = `<div id="particle-container-${conf.id}" class="particle-container"></div>`;
    const particleContainerId = `particle-container-${conf.id}`;

    const presets = [
        { presetName: "Nexus Lines", config: { fpsLimit: 60, particles: { number: { value: 80, density: { enable: true, value_area: 800 } }, color: { value: "var(--current-accent-primary)" }, shape: { type: "circle" }, opacity: { value: 0.5 }, size: { value: 2, random: true }, links: { enable: true, distance: 130, color: "var(--current-accent-secondary)", opacity: 0.3, width: 1 }, move: { enable: true, speed: 1.5, direction: "none", out_mode: "out" } }, interactivity: { events: { onhover: { enable: true, mode: "repel" }, onclick: { enable: true, mode: "push" }, resize: true }, modes: { repel: { distance: 80 }, push: { particles_nb: 3 } } }, detectRetina: true, background: { color: "transparent" } } },
        { presetName: "Starfield", config: { fpsLimit: 60, particles: { number: { value: 150 }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: {min: 0.1, max: 0.6}, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false } }, size: { value: {min:0.5, max:2}, random: true }, links: { enable: false }, move: { enable: true, speed: 0.3, direction: "none", random: true, straight: false, out_mode: "out" } }, detectRetina: true, background: { color: "transparent" } } },
        { presetName: "Flying Embers", config: { fpsLimit: 60, particles: { number: { value: 50 }, color: { value: ["#FF5733", "#FFC300", "#DAF7A6"] }, shape: { type: "circle" }, opacity: { value: {min:0.4, max:0.8}, random: true }, size: { value: {min:1, max:4}, random: true }, links: { enable: false }, move: { enable: true, speed: {min:1, max:3}, direction: "top-right", random: true, straight: false, out_mode: "out", bounce: false, trail: { enable: true, fill: { color: "rgba(0,0,0,0)" }, length:5} } }, detectRetina: true, background: { color: "transparent" } } },
        { presetName: "Sea Waves", config: {fpsLimit: 60, particles: {number: {value: 100, density: {enable: true, value_area: 1000,},}, color: {value: "var(--current-accent-primary)",}, shape: {type: "circle",}, opacity: {value: 0.7, random: true,}, size: {value: 5, random: {enable: true, minimumValue: 2,},}, links: {enable: false,}, move: {enable: true, speed: 1, direction: "bottom", random: false, straight: false, out_mode: "out", bounce: false, attract: {enable: false, rotateX: 600, rotateY: 1200,},},}, interactivity: {detect_on: "canvas", events: {onhover: {enable: true, mode: "bubble",}, onclick: {enable: false,}, resize: true,}, modes: {bubble: {distance: 100, size: 10, duration: 2, opacity: 0.8, speed: 3,},},}, detectRetina: true, background: { color: "transparent",}, },},
    ];
    let currentPresetIndex = conf.nexusPreset || 0;

    function loadParticles() {
        if (widgetEl.particleInstance) {
            widgetEl.particleInstance.destroy();
            widgetEl.particleInstance = null;
        }
        const activePreset = JSON.parse(JSON.stringify(presets[currentPresetIndex].config));
        // Dynamically update colors based on CSS variables
        const rootStyle = getComputedStyle(document.documentElement);
        const themeColors = {
            primary: rootStyle.getPropertyValue('--current-accent-primary').trim(),
            secondary: rootStyle.getPropertyValue('--current-accent-secondary').trim(),
            tertiary: rootStyle.getPropertyValue('--current-accent-tertiary').trim()
        };

        if(activePreset.particles.color?.value) {
            if (typeof activePreset.particles.color.value === 'string' && activePreset.particles.color.value.startsWith('var(')) {
                const varName = activePreset.particles.color.value.match(/--current-accent-(primary|secondary|tertiary)/);
                if (varName && varName[1]) activePreset.particles.color.value = themeColors[varName[1]];
            }
        }
        if(activePreset.particles.links?.color && typeof activePreset.particles.links.color === 'string' && activePreset.particles.links.color.startsWith('var(')) {
            const varName = activePreset.particles.links.color.match(/--current-accent-(primary|secondary|tertiary)/);
            if (varName && varName[1]) activePreset.particles.links.color = themeColors[varName[1]];
        }

        tsParticlesInstance.load(particleContainerId, activePreset)
            .then(container => { widgetEl.particleInstance = container; })
            .catch(err => console.error("tsParticles widget load error:", err));
    }

    loadParticles();
    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (refreshBtn) {
        refreshBtn.title = "Cycle Effect";
        refreshBtn.addEventListener('click', () => {
            currentPresetIndex = (currentPresetIndex + 1) % presets.length;
            widgetsConfigRef[conf.id].nexusPreset = currentPresetIndex;
            saveAppSettingsFunc();
            loadParticles();
        });
    }
    widgetEl.onWidgetResize = () => { if (widgetEl.particleInstance) widgetEl.particleInstance.refresh(); };
}