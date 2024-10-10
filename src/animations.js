import { defaultSettings } from "./config.js";

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
  const { target } = entry;
  if (direction === "in") {
    target.style.transform = "translateY(0)";
    target.style.opacity = "1";
  } else {
    target.style.transform =
      direction === "up" ? "translateY(-200%)" : "translateY(200%)";
    target.style.opacity = "0";
  }
};

// Helper function to apply inline styles for fading animations
export const fadeAnimation = (entry, direction) => {
  const { target } = entry;
  if (direction === "in") {
    target.style.opacity = "1";
  } else {
    target.style.opacity = "0";
  }
};

// Function to handle which animation to apply based on settings
export const applyAnimation = (entry, isEntering) => {
  const animationType = defaultSettings.animation;

  switch (animationType) {
    case "slide":
      const direction = entry.boundingClientRect.y < 0 ? "up" : "down";
      slideAnimation(entry, isEntering ? "in" : direction);
      break;
    case "fade":
      fadeAnimation(entry, isEntering ? "in" : "out");
      break;
    default:
      // Fallback if no valid animation type is provided
      break;
  }
};
