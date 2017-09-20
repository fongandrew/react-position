/*
  HOC for mouseover / mouseout tooltip centered above content. Automatically
  shifts left / right or below content to avoid going out of window bounds.
*/

import * as React from 'react';
import { Component } from './append';
import { relativeToDocument } from './position';
import refElm, { RefElmProps } from './ref-elm';

export interface TooltipProps {
  onFocus: React.FocusEventHandler<any>;
  onBlur: React.FocusEventHandler<any>;
  onMouseOver: React.MouseEventHandler<any>;
  onMouseOut: React.MouseEventHandler<any>;
}

export interface Opts<P> {
  id?: string|((props: P) => string);
  inline: Component<P & TooltipProps>;
  append: Component<P>;
}

export interface State {
  active: boolean;
}

// HOC
export default function<P>(opts: Opts<P>): React.ComponentClass<P> {

  // Needed for absolute positioning of append element (can be body
  // too, but just check it's consistent with renderAppend)
  document.documentElement.style.position = 'relative';

  // Typecast to avoid this error
  // (https://github.com/Microsoft/TypeScript/issues/15019)
  // Related: (https://github.com/Microsoft/TypeScript/issues/14107)
  const inlineElm = opts.inline as React.ComponentClass<P & TooltipProps>;
  const appendElm = opts.append as React.ComponentClass<P>;

  return class Tooltip extends React.Component<P, State> {
    // The wrapped RefElm component. Important to maintain reference so
    // that re-renders don't unmount the prior component.
    protected refElmComponent: React.ComponentClass<P>;

    constructor(props: P) {
      super(props);
      this.state = { active: false };
      this.refElmComponent = refElm({
        ...opts,
        inline: this.renderInline,
        append: this.renderTooltip
      });
    }

    render() {
      return React.createElement(this.refElmComponent, this.props);
    }

    renderInline = (props: P) => {
      return React.createElement(inlineElm, {
        // Type as any to get around 
        // https://github.com/Microsoft/TypeScript/issues/10727
        ...(props as any),
        onMouseOver: this.activate,
        onMouseOut: this.deactivate,
        onFocus: this.activate,
        onBlur: this.deactivate,
      });
    }

    renderTooltip = ({ refElm, ownProps }: RefElmProps<P>) => {
      let { left, top, width } = relativeToDocument(refElm);
      return this.state.active ? <div style={{
        position: 'absolute',
        top,
        left: left + (width / 2),
        transform: 'translate(-50%, -100%)',
      }}>
        { React.createElement(appendElm, ownProps) }
      </div> : null;
    }

    activate = () => this.setState({ active: true });
    deactivate = () => this.setState({ active: false });
  };
}