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

  // Reference to inline elm
  refElm: Element;
}

export interface Opts<P> {
  id?: string|((props: P) => string);
  inline: Component<P>;
  append: Component<RefElmProps<P>>;
}

// HOC
export default function<P>(opts: Opts<P>): React.ComponentClass<P> {

  // Typecast to avoid this error
  // (https://github.com/Microsoft/TypeScript/issues/15019)
  // Related: (https://github.com/Microsoft/TypeScript/issues/14107)
  const appendElm = opts.append as React.ComponentClass<RefElmProps<P>>;

  return class RefElm extends React.Component<P, {}> {
    // The wrapped Appender component. Important to maintain reference so
    // that re-renders don't unmount the prior component.
    protected appendComponent: React.ComponentClass<P>;

    // The inline element instance we're referencing
    protected refElm: Element|null;

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

    componentDidMount() {
      this.refElm = ReactDOM.findDOMNode(this);
    }

    componentDidUpdate() {
      this.refElm = ReactDOM.findDOMNode(this);
    }

    // Wrapper around append to set fixed positional element
    renderAppend = (ownProps: P) => {
      // No DOM node. Perhaps not mounted yet.
      if (! this.refElm) return null;

      return React.createElement(appendElm, {
        ownProps,
        refElm: this.refElm
      });
    }
  };
}
