import "./index.css";

import { setOptions, defaultOptions } from "./config.js";
import { disable, enable, reset, update, isDisabled } from "./observer.js";

const init = (settings = defaultOptions) => {
  setOptions(settings);

  const elements = Array.from(
    document.querySelectorAll(defaultOptions.selector)
  );

  elements.forEach((element) => {
    const duration =
      element.dataset.animationDuration || defaultOptions.animationDuration;
    const delay =
      element.dataset.animationDelay || defaultOptions.animationDelay;

    element.style.transitionDuration = `${duration}ms`;
    element.style.transitionDelay = `${delay}ms`;
  });

  if (typeof window === "undefined") {
    return {
      disable,
      enable,
      reset,
      update,
    };
  }

  if (!window.IntersectionObserver) {
    disableAnimations();
  }

  if (!isDisabled()) {
    enable();
  } else {
    disableAnimations();
  }

  return {
    disable,
    enable,
    reset,
    update,
  };
};

export default init;
