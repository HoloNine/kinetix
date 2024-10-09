import { defaultSettings, setSettings } from "./config.js";
import { animate, reverse, isAnimated, clearAnimation } from "./animations.js";

let previousY = 0;
let previousRatio = 0;

let elements = [];
let intersectionObserver = null;

const enableAnimations = () => {
  document.body.classList.remove(defaultSettings.disabledClassName);
};

export const disableAnimations = () => {
  document.body.classList.add(defaultSettings.disabledClassName);
};

const clearObserver = () => {
  intersectionObserver.disconnect();
  intersectionObserver = null;
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

    if (currentY < previousY) {
      if (currentRatio > previousRatio && isIntersecting) {
        removeHelperClasses(entry);
        // entry.target.classList.add("enter-bottom");
        entry.target.dataset.state = "enter-bottom";
      } else if (currentRatio < previousRatio || !isIntersecting) {
        removeHelperClasses(entry);
        // entry.target.classList.add("leave-bottom");
        entry.target.dataset.state = "leave-bottom";
      }
    } else if (currentY > previousY) {
      if (currentRatio < previousRatio) {
        removeHelperClasses(entry);
        // entry.target.classList.add("leave-top");
        entry.target.dataset.state = "leave-top";
      } else if (currentRatio > previousRatio || !isIntersecting) {
        removeHelperClasses(entry);
        // entry.target.classList.add("enter-top");
        entry.target.dataset.state = "enter-top";
      }
    }

    previousY = currentY;
    previousRatio = currentRatio;

    if (entry.intersectionRatio >= defaultSettings.threshold) {
      animate(entry);

      if (!shouldRepeat) {
        observer.unobserve(target);
      }
    } else if (shouldRepeat) {
      reverse(entry);
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
