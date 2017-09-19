/*
  Extension of react-append where the appended element is positioned relative
  to the location of the inline element.
*/

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import append, { Component } from './append';

// Additional props provided to append component with anchor
export interface RefElmProps<P> {
  ownProps: P;

  // Wrapper element to absolutely position children
  RefDiv: Component<React.HTMLAttributes<HTMLDivElement>>;

  // Bounding rectange of reference element
  rect: ClientRect;

  // Same, but with percentages
  rectPct: ClientRect;
}

export interface Opts<P> {
  id?: string|((props: P) => string);
  inline: Component<P>;
  append: Component<RefElmProps<P>>;
}

// HOC
export default function<P>(opts: Opts<P>): Component<P> {

  // Typecast to avoid this error
  // (https://github.com/Microsoft/TypeScript/issues/15019)
  // Related: (https://github.com/Microsoft/TypeScript/issues/14107)
  const appendElm = opts.append as React.ComponentClass<RefElmProps<P>>;

  // Needed for absolute positioning of append element (can be body
  // too, but just check it's consistent with renderAppend)
  document.documentElement.style.position = 'relative';

  return class RefElm extends React.Component<P, {}> {
    // The wrapped Appender component. Important to maintain reference so
    // that re-renders don't unmount the prior component.
    protected appendComponent: React.ComponentClass<P>;

    constructor(props: P) {
      super(props);

      // Attach name for debugging purposes
      Object.defineProperty(this.renderAppend, 'name', {
        value: 'RefElmAppend'
      });

      this.appendComponent = append({
        ...opts,
        append: this.renderAppend
      });
    }

    render() {
      return React.createElement(this.appendComponent, this.props);
    }

    // Wrapper around append to set fixed positional element
    renderAppend = (ownProps: P) => {

      // Get inline DOM node
      let refElm: Element;
      try {
        refElm = ReactDOM.findDOMNode(this);
      } catch {
        return null; // Unable fo find DOM node. Perhaps not mounted
      }

      let rect = refElm.getBoundingClientRect();
      let parent = document.documentElement;
      let parentRect = parent.getBoundingClientRect();
      let wrapperStyle: React.CSSProperties = {
        position: 'absolute',
        top: rect.top - parentRect.top,
        left: rect.left - parentRect.left,
        height: rect.height,
        width: rect.width
      };

      let viewportWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      let viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      let rectPct = {
        top: rect.top / viewportHeight,
        bottom: rect.bottom / viewportHeight,
        height: rect.height / viewportHeight,
        left: rect.left / viewportWidth,
        right: rect.right / viewportWidth,
        width: rect.width / viewportWidth
      };

      let anchorProps: RefElmProps<P> = {
        ownProps,
        RefDiv: props => <div
          { ...props }
          style={{
            ...wrapperStyle,
            ...(props.style || {})
          }}
        />,
        rect,
        rectPct
      };

      return React.createElement(appendElm, anchorProps);
    }
  };
}
