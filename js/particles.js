// js/particles.js

export async function initBackgroundParticles(currentSettings, tsParticlesInstance) {
    const containerId = 'dynamic-background-container';
    // tsParticles.dom() returns an array of all loaded instances.
    // We need to find the one associated with our containerId if it exists.
    const existingInstance = tsParticlesInstance.dom().find(p => p.id === containerId && p.canvas && p.canvas.element);


    if (existingInstance) {
        try {
            existingInstance.destroy();
        } catch (e) {
            console.warn("Could not destroy previous particle instance:", e);
            // If destroy fails, try to remove the canvas directly
            const oldCanvas = document.querySelector(`#${containerId} > canvas`);
            if (oldCanvas) oldCanvas.remove();
        }
    }


    if (!currentSettings.backgroundParticles) {
        return;
    }

    const particleConfig = {
        fpsLimit: 60,
        particles: {
            number: { value: 70, density: { enable: true, value_area: 900 } },
            color: { value: ["#FFFFFF", "#FFFFAA", "#FFD700", "var(--current-accent-primary)"] },
            shape: { type: "circle" },
            opacity: { value: { min: 0.1, max: 0.6 }, animation: { enable: true, speed: 0.7, minimumValue: 0.1, sync: false } },
            size: { value: { min: 0.5, max: 2.0 } },
            links: { enable: false },
            move: {
                enable: true, speed: 0.5, direction: "none", random: true,
                straight: false, outModes: { default: "out" }
            }
        },
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false }, resize: true } },
        detectRetina: true,
        background: { color: "transparent" }
    };

    const theme = currentSettings.theme || 'chimera-dark';
    if (theme === 'chimera-light') {
        particleConfig.particles.color.value = ["#333333", "#555555", "var(--current-accent-primary)"];
    } else if (theme === 'cyber-blue') {
         particleConfig.particles.color.value = ["var(--cyber-blue-text-primary)", "var(--cyber-blue-accent-secondary)", "#FFFFFF"];
    }

    try {
        // Ensure the container element exists before loading particles
        const containerElement = document.getElementById(containerId);
        if (containerElement) {
            await tsParticlesInstance.load(containerId, particleConfig);
        } else {
            console.error(`Particle container #${containerId} not found.`);
        }
    } catch (error) {
        console.error("Error loading background particles:", error);
    }
}