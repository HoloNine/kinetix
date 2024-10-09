export let defaultOptions = {
  root: null,
  rootMargin: "0% 30%",
  threshold: 0.5,
  animateClassName: "data-animate",
  disabledClassName: "data-disabled",
  enterEventName: "animation:in",
  exitEventName: "animation:out",
  selector: "[data-animation]",
  once: false,
  disabled: false,
  animationDuration: 300,
  animationDelay: 30,
};

export const setOptions = (settings) => {
  if (settings) {
    defaultOptions = {
      ...defaultOptions,
      ...settings,
    };
  }
};
