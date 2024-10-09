import { defaultSettings, setSettings } from "./config";
import { disable, enable, reset, update, isDisabled } from "./observer.js";

const kinetix = (settings = defaultSettings) => {
  setSettings(settings);

  const observeElements = Array.from(
    document.querySelectorAll(defaultSettings.selector)
  );

  if (!isDisabled()) {
    enable();
  }

  return {
    disable,
    enable,
    reset,
    update,
  };
};

export default kinetix;
