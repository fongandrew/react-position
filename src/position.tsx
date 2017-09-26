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
    width: rect.width,

    /*
      Note that the meanings of right / bottom  here are different than
      in getBoundingClientRect -- e.g., here 'right' means distance
      of the element's right edge from its parent, whereas in
      getBoundingClientRect, it means distance of the right edge of
      the element from the left of the viewport. Ditto for bottom.
    */
    right: parentRect.right - rect.right,
    bottom: parentRect.bottom - rect.bottom
  };
};

// Returns position values as percentage of viewport
export const relativeToViewportPct = (elm: Element) => {
  let rect = elm.getBoundingClientRect();
  let { width: viewportWidth, height: viewportHeight } = getViewportWidth();
  return {
    top: rect.top / viewportHeight,
    height: rect.height / viewportHeight,
    left: rect.left / viewportWidth,
    width: rect.width / viewportWidth,

    /*
      Similar to `relativeToParent`, right / bottom refer to distances of the
      right / bottom edges of the element from the right / bottom edges of the
      viewport, *not* what they normally mean in getBoundingClientRect.
    */
    right: (viewportWidth - rect.right) / viewportWidth,
    bottom: (viewportHeight - rect.bottom) / viewportHeight
  };
};

// Get viewport dimensions
export const getViewportWidth = () => {
  let width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  let height = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  return { width, height };
};
