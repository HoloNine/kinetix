/**
 * Dispatches a custom event with the specified name and entry.
 *
 * @param {string} name - The name of the custom event.
 * @param {any} entry - The entry to be passed as the event detail.
 */
export const dispatchEvent = (name, entry) => {
  const event = new CustomEvent(name, {
    bubbles: true,
    detail: entry,
  });

  entry.target.dispatchEvent(event);
};
