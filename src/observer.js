import { defaultSettings, setSettings } from "./config.js";
import { isAnimated, clearAnimation, applyAnimation } from "./animations.js";

let elements = [];
let intersectionObserver = null;
const elementState = new WeakMap();

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

const isIntersecting = (entry, target) => {
  const currentY = entry.boundingClientRect.y;
  const currentRatio = entry.intersectionRatio;

  const isIntersecting = entry.isIntersecting;
  const { previousY = 0, previousRatio = 0 } = elementState.get(target) || {};

  if (currentY < previousY) {
    if (isIntersecting && currentRatio > previousRatio) {
      if (target.dataset.state !== "in") {
        removeHelperClasses(entry);
        target.dataset.state = "in";
      }
    } else if (!isIntersecting || currentRatio < previousRatio) {
      if (target.dataset.state !== "out") {
        removeHelperClasses(entry);
        target.dataset.state = "out";
      }
    }
  } else if (currentY > previousY) {
    if (currentRatio < previousRatio && !isIntersecting) {
      if (target.dataset.state !== "out") {
        removeHelperClasses(entry);
        target.dataset.state = "out";
      }
    } else if (isIntersecting && currentRatio > previousRatio) {
      if (target.dataset.state !== "in") {
        removeHelperClasses(entry);
        target.dataset.state = "in";
      }
    }
  }

  return { currentY, currentRatio };
};

const onIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    const { target } = entry;
    const hasRepeatFlag = target.dataset.animationRepeat !== undefined;
    const hasOnceFlag = target.dataset.animationOnce !== undefined;
    const shouldRepeat =
      hasRepeatFlag || !(hasOnceFlag || defaultSettings.once);

    const { currentY, currentRatio } = isIntersecting(entry, target);

    // Store current values for the next scroll event
    elementState.set(target, {
      previousY: currentY,
      previousRatio: currentRatio,
    });

    if (currentRatio >= defaultSettings.threshold) {
      requestAnimationFrame(() => applyAnimation(entry, true));
      if (!shouldRepeat) {
        observer.unobserve(target);
      }
    } else if (shouldRepeat) {
      requestAnimationFrame(() => applyAnimation(entry, false));
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

  // Apply initial hidden styles to all elements outside the viewport
  collection.forEach((element) => {
    // Observe the element using the IntersectionObserver
    intersectionObserver.observe(element);
  });

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
