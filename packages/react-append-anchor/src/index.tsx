/*
  Extension of react-append where the appended element is positioned relative
  to the location of the inline element.
*/

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import append, { Component } from 'react-append';

// Additional props provided to append component with anchor
export interface AnchorProps<P> {
  ownProps: P;

  // Wrapper element to absolutely position children
  Wrapper: Component<React.HTMLAttributes<HTMLDivElement>>;

  // Bounding rectange of anchor element
  anchorRect: ClientRect;

  // Same, but with percentages
  anchorRectPct: ClientRect;
}

export interface Opts<P> {
  id: string|((props: P) => string);
  inline: Component<P>;
  append: Component<AnchorProps<P>>;
}

// HOC
export default function<P>(opts: Opts<P>): Component<P> {

  // Typecast to avoid this error
  // (https://github.com/Microsoft/TypeScript/issues/15019)
  // Related: (https://github.com/Microsoft/TypeScript/issues/14107)
  const appendElm = opts.append as React.ComponentClass<AnchorProps<P>>;

  // Needed for absolute positioning of append element (can be body
  // too, but just check it's consistent with renderAppend)
  document.documentElement.style.position = 'relative';

  return class Anchor extends React.Component<P, {}> {
    // The wrapped Appender component. Important to maintain reference so
    // that re-renders don't unmount the prior component.
    protected appendComponent: React.ComponentClass<P>;

    constructor(props: P) {
      super(props);
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
      let anchor: Element;
      try {
        anchor = ReactDOM.findDOMNode(this);
      } catch {
        return null; // Unable fo find DOM node. Perhaps not mounted
      }

      let anchorRect = anchor.getBoundingClientRect();
      let parent = document.documentElement;
      let parentRect = parent.getBoundingClientRect();
      let wrapperStyle: React.CSSProperties = {
        position: 'absolute',
        top: anchorRect.top - parentRect.top,
        left: anchorRect.left - parentRect.left,
        height: anchorRect.height,
        width: anchorRect.width
      };

      let viewportWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      let viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      let anchorRectPct = {
        top: anchorRect.top / viewportHeight,
        bottom: anchorRect.bottom / viewportHeight,
        height: anchorRect.height / viewportHeight,
        left: anchorRect.left / viewportWidth,
        right: anchorRect.right / viewportWidth,
        width: anchorRect.width / viewportWidth
      };

      let anchorProps: AnchorProps<P> = {
        ownProps,
        Wrapper: props => <div 
          { ...props }
          style={{
            ...wrapperStyle,
            ...(props.style || {})
          }}
        />,
        anchorRect,
        anchorRectPct
      };

      return React.createElement(appendElm, anchorProps);
    }
  };
}
