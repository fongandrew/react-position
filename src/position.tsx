/*
  Positioning helpers
*/

/*
  This interface is essentially the same as a ClientRect, but its semantic
  meaning is different (see relativeOffset below)
*/
export interface Offset {
  top: number;
  left: number;
  height: number;
  width: number;
  right: number;
  bottom: number;
}

/*
  Returns a child's position as an offset of its parent. Note that while the
  functions takes ClientRect's, the meanings of right / bottom in the returned
  value are different than in a ClientRect -- e.g., here 'right' means distance
  of the element's right edge from its parent, whereas a ClientRect, it means
  distance of the right edge of the element from the left of the viewport.
  Ditto for bottom.
*/
export const relativeOffset = (child: ClientRect, parent: ClientRect) => ({
  top: child.top - parent.top,
  left: child.left - parent.left,
  height: child.height,
  width: child.width,
  right: parent.right - child.right,
  bottom: parent.bottom - child.bottom
});

export const documentRect = () =>
  document.documentElement.getBoundingClientRect();

export const viewportRect = () => {
  const { width, height } = viewportSize();
  return {
    top: 0,
    bottom: height,
    left: 0,
    right: width,
    width,
    height
  };
};

export const documentOffset = (elm: Element) => relativeOffset(
  elm.getBoundingClientRect(),
  documentRect()
);

export const viewportOffset = (elm: Element) => relativeOffset(
  elm.getBoundingClientRect(),
  viewportRect()
);

export const relativeViewportOffset = () => relativeOffset(
  viewportRect(),
  documentRect()
);

// Get viewport dimensions
export const viewportSize = () => {
  const width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  const height = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  return { width, height };
};
