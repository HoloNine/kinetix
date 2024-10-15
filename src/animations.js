import {defaultSettings} from "./config.js";

/**
 * Clears the animation state of the given element.
 *
 * @param {HTMLElement} element - The DOM element whose animation state is to be cleared.
 */
export const clearAnimation = (element) => {
    element.dataset.animate = false;
};

/**
 * Checks if an element is animated.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} Returns true if the element is animated, false otherwise.
 */
export const isAnimated = (element) => element.dataset.animate === true;

// Helper function to apply inline styles for sliding animations
export const slideAnimation = (entry, direction) => {
    const {target} = entry;

    const delay = target.dataset.delay;
    const transition = 'all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1)';

    if (direction === "in") {
        target.style.transform = "translateY(0)";
        target.style.opacity = "1";
        target.style.blur = "0";
        target.style.transition = delay ? `${transition} ${delay}ms` : transition;
    } else {
        target.style.transform =
            direction === "up" ? "translateY(-100%)" : "translateY(100%)";
        target.style.opacity = "0";
        target.style.blur = "4px";
        target.style.transition = delay ? `${transition} ${delay}ms` : transition;

    }
};

const fadeAnimation = (entry, direction) => {
    const {target} = entry;
    if (direction === "in") {
        target.style.opacity = "1";
    } else {
        target.style.opacity = "0";
    }
};

// Function to handle which animation to apply based on settings
export const applyAnimation = (entry, isEntering) => {
    const animationType = defaultSettings.animation;
    const direction = entry.boundingClientRect.y < 0 ? "up" : "down";

    switch (animationType) {
        case "slide":
            slideAnimation(entry, isEntering ? "in" : direction);
            break;
        case "fade":
            fadeAnimation(entry, isEntering ? "in" : direction);
        default:
            // Fallback if no valid animation type is provided
            break;
    }
};
