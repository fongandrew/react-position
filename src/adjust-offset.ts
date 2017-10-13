/*
  Helpers for events related to offset adjustment (scroll + resize).
*/

export type Listener = () => void;
const callbacks: Listener[]  = [];

export const addListener = (listener: Listener) => {
  callbacks.push(listener);
};

export const removeListener = (listener: Listener) => {
  const index = callbacks.indexOf(listener);
  if (index >= 0) {
    callbacks.splice(index, 1);
  }
};

// Throttling for frequently called events
let adjustRunning = false;
const adjust = () => {
  if (! adjustRunning) {
    adjustRunning = true;
    window.requestAnimationFrame(adjustActual);
  }
};
const adjustActual = () => {
  adjustRunning = false;
  callbacks.forEach(cb => cb());
};

// Detect passive support for resizing
let supportsPassive = false;
try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener('test', () => null, opts);
} catch (e) {}

window.addEventListener(
  'scroll',
  adjust,
  supportsPassive ? { passive: true } as any : false
);

window.addEventListener('resize', adjust, false);