import { defaultOptions } from "./config.js";
import { dispatchEvent } from "./events.js";

/**
 * Clears the animation from the specified element.
 *
 * @param {HTMLElement} element - The element to clear the animation from.
 */
export const clearAnimation = (element) => {
  element.classList.remove(defaultOptions.animateClassName);
};

/**
 * Animates the target element.
 *
 * @param {IntersectionObserverEntry} entry - The entry object containing information about the target element.
 */
export const animate = (entry) => {
  entry.target.classList.add(defaultOptions.animateClassName);
  dispatchEvent(defaultOptions.enterEventName, entry);
};

/**
 * Reverses the animation by clearing the animation target and dispatching the exit event.
 *
 * @param {Object} entry - The animation entry object.
 */
export const reverse = (entry) => {
  clearAnimation(entry.target);
  dispatchEvent(defaultOptions.exitEventName, entry);
};

/**
 * Checks if an element is animated.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} Returns true if the element is animated, false otherwise.
 */
export const isAnimated = (element) =>
  element.classList.contains(defaultOptions.animateClassName);
