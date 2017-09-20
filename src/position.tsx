/*
  Positioning helpers
*/

// Returns (absolute) position vals of element relative to documentElement
export const relativeToDocument = (elm: Element) => {
  return relativeToParent(elm, document.documentElement);
};

// Returns (absolute) position vals of element relative to some parent
export const relativeToParent = (elm: Element, parent: Element) => {
  let rect = elm.getBoundingClientRect();
  let parentRect = parent.getBoundingClientRect();
  return {
    top: rect.top - parentRect.top,
    left: rect.left - parentRect.left,
    height: rect.height,
    width: rect.width
  };
};

// Returns position values as percentage of viewport
export const relativeToViewportPct = (elm: Element) => {
  let rect = elm.getBoundingClientRect();
  let viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  let viewportHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  return {
    top: rect.top / viewportHeight,
    bottom: rect.bottom / viewportHeight,
    height: rect.height / viewportHeight,
    left: rect.left / viewportWidth,
    right: rect.right / viewportWidth,
    width: rect.width / viewportWidth
  };
};
