/*
  It's sometimes helpful to have React components that get rendered as part
  of a normal React flow, but that we want to show in the DOM outside of
  how it shows up in React to get around z-indexing issues, etc.
  For instance, dropdown toggles should show up in the DOM flow in one place
  but the actual dropdown menu may need to sit outside of where the toggle is.
*/

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export type Component<P> =
  React.ComponentClass<P> | React.StatelessComponent<P>;

export interface Opts<P> {
  // A unique identifier for where this component should insert its appended
  // component. Appends with the same id will replace any existing overlay
  // with that id.
  id: string|((props: P) => string);

  // This gets rendered inline if provided
  inline: Component<P>;

  // This is what gets appended to the end of the <body />. Leave out to hide
  // or remove overlay.
  append: Component<P>;
}

// HOC
export default function<P>(opts: Opts<P>) {

  // Typecast to avoid this error
  // (https://github.com/Microsoft/TypeScript/issues/15019)
  // Related: (https://github.com/Microsoft/TypeScript/issues/14107)
  const inline = opts.inline as React.ComponentClass<P>;
  const append = opts.append as React.ComponentClass<P>;

  const { id } = opts;
  const idFn = typeof id === 'string' ? () => id : id;

  return class Appender extends React.Component<P, {}> {
    // Render inline component
    render() {
      // Type as any to get around
      // https://github.com/Microsoft/TypeScript/issues/10727
      let { children, ...props } = this.props as any;
      return React.createElement(inline, props, children);
    }

    /*
      Clear old container if ID changes -- this may cause a flicker during
      rendering, so changing ID is generally not advised.
    */
    componentWillReceiveProps(nextProps: P) {
      let thisId = idFn(this.props);
      let nextId = idFn(nextProps);
      if (thisId !== nextId) {
        clear(thisId);
      }
    }

    // Create or update appended components
    componentDidMount() {
      this.update();
    }

    componentDidUpdate() {
      this.update();
    }

    // Clear appended component on unmount
    componentWillUnmount() {
      this.close();
    }

    /*
      requestAnimationFrame to avoid accessing DOM node from inside
      render function. Not ideal, but should be OK so long as we
      only update the overlay children and not the wrapper itself.
    */
    update() {
      window.requestAnimationFrame(this.renderAppend);
    }

    /*
      Create container for id (if it doesn't exist) and render overlay content
      inside it.
    */
    renderAppend = () => {
      let thisId = idFn(this.props);
      let mountPoint = mount(thisId);

      // See comment in render method
      let { children, ...props } = this.props as any;
      let appendElm = React.createElement(append, props, children);

      ReactDOM.render(appendElm, mountPoint);
    }

    /*
      requestAnimationFrame because any React events that triggered the
      dropdown menu closing may need to fully propogate before we remove
      the menu from the DOM.
    */
    close() {
      window.setTimeout(this.clearAppend);
    }

    clearAppend = () => clear(idFn(this.props));
  };
}

// Get or create element by ID
const mount = (id: string) => {
  let elm = document.getElementById(id);
  if (! elm) {
    elm = document.createElement('div');
    elm.id = id;
    document.body.appendChild(elm);
  }
  return elm;
};

// Ensure element with ID is removed from DOM
const clear = (id: string) => {
  let elm = document.getElementById(id);
  if (elm && elm.parentNode) {
    elm.parentNode.removeChild(elm);
  }
};
