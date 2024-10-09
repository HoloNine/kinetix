import { defaultSettings, setSettings } from "./config.js";
import { animate, reverse, isAnimated, clearAnimation } from "./animations.js";

let elements = [];
let intersectionObserver = null;

const enableAnimations = () => {
  document.body.classList.remove(defaultSettings.disabledClassName);
};

export const disableAnimations = () => {
  document.body.classList.add(defaultSettings.disabledClassName);
};

const clearObserver = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
};

const removeHelperClasses = (entry) => {
  entry.target.dataset.state = "";
};

/**
 * Checks if the observer is disabled based on the default options.
 *
 * @returns {boolean} Returns true if the observer is disabled, false otherwise.
 */
export const isDisabled = () =>
  defaultSettings.disabled ||
  (typeof defaultSettings.disabled === "function" &&
    defaultSettings.disabled());

const elementState = new WeakMap();

/**
 * Handles the intersection callback for the Intersection Observer.
 *
 * @param {IntersectionObserverEntry[]} entries - The array of intersection entries.
 * @param {IntersectionObserver} observer - The Intersection Observer instance.
 */
const onIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    const { target } = entry;
    const hasRepeatFlag = target.dataset.animationRepeat !== undefined;
    const hasOnceFlag = target.dataset.animationOnce !== undefined;
    const shouldRepeat =
      hasRepeatFlag || !(hasOnceFlag || defaultSettings.once);

    const currentY = entry.boundingClientRect.y;
    const currentRatio = entry.intersectionRatio;
    const isIntersecting = entry.isIntersecting;

    const { previousY = 0, previousRatio = 0 } = elementState.get(target) || {};

    // Handle when scrolling down (element moves upwards in the viewport)
    if (currentY < previousY) {
      if (isIntersecting && currentRatio > previousRatio) {
        if (target.dataset.state !== "slide-in-top") {
          removeHelperClasses(entry);
          target.dataset.state = "slide-in-top";
        }
      } else if (!isIntersecting || currentRatio < previousRatio) {
        if (target.dataset.state !== "slide-out-top") {
          removeHelperClasses(entry);
          target.dataset.state = "slide-out-top";
        }
      }
    } else if (currentY > previousY) {
      if (currentRatio < previousRatio && !isIntersecting) {
        if (target.dataset.state !== "slide-out-bottom") {
          removeHelperClasses(entry);
          target.dataset.state = "slide-out-bottom";
        }
      } else if (isIntersecting && currentRatio > previousRatio) {
        if (target.dataset.state !== "slide-in-bottom") {
          removeHelperClasses(entry);
          target.dataset.state = "slide-in-bottom";
        }
      }
    }

    // Store current values for the next scroll event
    elementState.set(target, {
      previousY: currentY,
      previousRatio: currentRatio,
    });

    // Apply animation only if the threshold is met or exceeded
    if (currentRatio >= defaultSettings.threshold) {
      requestAnimationFrame(() => animate(entry)); // Use requestAnimationFrame to batch updates
      if (!shouldRepeat) {
        observer.unobserve(target);
      }
    } else if (shouldRepeat) {
      requestAnimationFrame(() => reverse(entry)); // Batch reverse calls as well
    }
  });
};

/**
 * Retrieves the observed elements based on the default options.
 *
 * @returns {Array<HTMLElement>} The collection of observed elements.
 */
export const getObservedElements = () => {
  const collection = [].filter.call(
    document.querySelectorAll(defaultSettings.selector),
    (element) => !isAnimated(element)
  );

  collection.forEach((element) => intersectionObserver.observe(element));

  return collection;
};

export const disable = () => {
  disableAnimations();
  clearObserver();
};

/**
 * Enables the observer functionality.
 */
export const enable = () => {
  enableAnimations();

  intersectionObserver = new IntersectionObserver(onIntersection, {
    root: defaultSettings.root,
    rootMargin: defaultSettings.rootMargin,
    threshold: defaultSettings.threshold,
  });

  elements = getObservedElements();
};

/**
 * Resets the observer and clears any animations.
 *
 * @param {Object} settings - The settings object.
 */
export const reset = (settings = {}) => {
  clearObserver();

  Array.from(document.querySelectorAll(defaultSettings.selector)).forEach(
    clearAnimation
  );

  setSettings(settings);
  enable();
};

/**
 * Updates the observed elements array by adding new elements.
 */
export const update = () => {
  const newElements = getObservedElements();
  elements.push(newElements);
};
