/*
  Simple wrapper component around ReactDOM's createPortal that auto-creates
  an element at end of body to mount children in.
*/

import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Automatic asisgnment of ID if none provided
let idCount = 0;
const idPrefix = 'react-append-';
const getAutoId = () => idPrefix + (idCount++);

export interface Props {
  id?: string;
}

export interface State {
  id: string;
}

export default class Append extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Auto-assign ID if none available
    this.state = { id: props.id || getAutoId() };
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children || null,
      getElement(this.state.id),
      this.state.id
    );
  }

  /*
    Clear old container if ID changes -- this may cause a flicker during
    rendering, so changing ID is generally not advised.
  */
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.id && this.state.id !== nextProps.id) {
      clearElement(this.state.id);
      this.setState({ id: nextProps.id });
    }
  }

  // Clear appended component on unmount
  componentWillUnmount() {
    let id = this.state.id;
    window.requestAnimationFrame(() => clearElement(id));
  }
}

// Get or create element by ID
const getElement = (id: string) => {
  let elm = document.getElementById(id);
  if (! elm) {
    elm = document.createElement('div');
    elm.id = id;
    document.body.appendChild(elm);
  }
  return elm;
};

// Ensure element with old ID is removed from DOM
const clearElement = (id: string) => {
  let elm = document.getElementById(id);
  if (elm) {
    ReactDOM.unmountComponentAtNode(elm);
    if (elm.parentNode) {
      elm.parentNode.removeChild(elm);
    }
  }
};
