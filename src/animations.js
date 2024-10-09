import { defaultSettings } from "./config.js";
import { dispatchEvent } from "./events.js";

/**
 * Clears the animation state of the given element.
 *
 * @param {HTMLElement} element - The DOM element whose animation state is to be cleared.
 */
export const clearAnimation = (element) => {
  element.dataset.animate = false;
};

/**
 * Animates the target element.
 *
 * @param {IntersectionObserverEntry} entry - The entry object containing information about the target element.
 */
export const animate = (entry) => {
  entry.target.dataset.animate = true;
  dispatchEvent(defaultSettings.enterEventName, entry);
};

/**
 * Reverses the animation by clearing the animation target and dispatching the exit event.
 *
 * @param {Object} entry - The animation entry object.
 */
export const reverse = (entry) => {
  clearAnimation(entry.target);
  dispatchEvent(defaultSettings.exitEventName, entry);
};

/**
 * Checks if an element is animated.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} Returns true if the element is animated, false otherwise.
 */
export const isAnimated = (element) => element.dataset.animate === true;
