/**
 * Default settings for the Kinetix animation configuration.
 * @typedef {Object} DefaultSettings
 * @property {Element|null} root - The root element for the IntersectionObserver.
 * @property {string} rootMargin - Margin around the root element.
 * @property {number} threshold - Intersection threshold for triggering animations.
 * @property {string} animateClassName - Class name to apply for animations.
 * @property {string} disabledClassName - Class name to apply when animations are disabled.
 * @property {string} enterEventName - Event name for entering animations.
 * @property {string} exitEventName - Event name for exiting animations.
 * @property {string} selector - CSS selector for elements to animate.
 * @property {boolean} once - Whether the animation should only run once.
 * @property {boolean} disabled - Whether animations are disabled.
 * @property {string} animation - The animation to apply.
 */
export let defaultSettings = {
    root: null,
    rootMargin: "0% 10%",
    threshold: 0.5,
    animateClassName: "kinetix-animate",
    disabledClassName: "kinetix-disabled",
    enterEventName: "animation:in",
    exitEventName: "animation:out",
    selector: ".kinetix",
    once: false,
    disabled: false,
    animation: "slide",
};

/**
 * Updates the default settings with the provided settings.
 *
 * @param {Object} settings - An object containing the settings to be updated.
 */
export const setSettings = (settings) => {
    if (settings) {
        defaultSettings = {
            ...defaultSettings,
            ...settings,
        };
    }
};
