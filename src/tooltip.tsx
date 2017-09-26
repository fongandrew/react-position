/*
  HOC for mouseover / mouseout tooltip centered above content. Automatically
  shifts left / right or below content to avoid going out of window bounds.
*/

import * as React from 'react';
import { Component } from './append';
import { relativeToDocument, getViewportWidth } from './position';
import refElm, { RefElmProps } from './ref-elm';

export interface InlineProps {
  onFocus: React.FocusEventHandler<any>;
  onBlur: React.FocusEventHandler<any>;
  onMouseOver: React.MouseEventHandler<any>;
  onMouseOut: React.MouseEventHandler<any>;
}

// Classnames for tooltip parts, to allow more styling customization
export interface Classnames {

  // Container wraps the entire tooltip.
  container: string;

  // Div around actual tooltip content. Gets shifted based on screen
  // position.
  content: string;

  // Div around the arrow on our tooltip
  arrow: string;

  // Applied to tooltip container depending on whether tooltip is above
  // or below the reference element
  top: string;
  bottom: string;
}

export interface Opts<P> {
  id?: string|((props: P) => string);
  classNames?: Partial<Classnames>;
  inline: Component<P & InlineProps>;
  append: Component<P>;
}

export interface State {
  active: boolean;
}


/*
  Tip component for actual floating tooltip - responsible for repositioning
  to avoid going out of bounds. Renders one div around content and another
  just for the tooltip arrow. Both are wrapped in a container div.

  Approach: Render initial component in default position (centered above
  reference element). If too far left or right, shift content left or right
  appropriately. Arrow always remains centered on container element though.
  If top clips viewport, move tooltip below element.
*/
export interface TipProps {
  classNames: Classnames;
  refElm: Element;
  children: React.ReactNode;
}

export class Tip extends React.Component<TipProps, {}> {
  // _container: HTMLDivElement|null;

  render() {
    let { left, right, top, width } = relativeToDocument(this.props.refElm);
    let { width: viewportWidth } = getViewportWidth();

    // Use distance from right if less than right for positioning.
    let hStyle: React.CSSProperties = { left: left + (width / 2) };
    let transformX = '-50%';
    if (right < left) {
      hStyle = { right: right + (width / 2) };
      transformX = '50%';
    }
    return <div
      style={{
        ...hStyle,
        position: 'absolute',
        top,
        transform: `translate(${transformX}, -100%)`,
      }}
    >
      { this.props.children }
    </div>;
  }

  // componentDidMount() {
  //   this.updatePos();
  // }

  // componentDidUpdate() {
  //   this.updatePos();
  // }

  // updatePos() {
  //   if (this._container) {
  //     // let rect = this._container.getBoundingClientRect();
  //     // if (rect.left < 0) {
  //     //   //
  //     // }
  //   }
  // }
}


// Default classnames
const DEFAULT_CLASSNAMES: Classnames = {
  container: 'tooltip-container',
  content: 'tooltip-content',
  arrow: 'tooltip-arrow',
  top: 'top',
  bottom: 'bottom'
};

// HOC
export default function<P>(opts: Opts<P>): React.ComponentClass<P> {

  // Needed for absolute positioning of append element (can be body
  // too, but just check it's consistent with renderAppend)
  document.documentElement.style.position = 'relative';

  // Typecast to avoid this error
  // (https://github.com/Microsoft/TypeScript/issues/15019)
  // Related: (https://github.com/Microsoft/TypeScript/issues/14107)
  const inlineElm = opts.inline as React.ComponentClass<P & InlineProps>;
  const appendElm = opts.append as React.ComponentClass<P>;
  const tooltipClassnames = {
    ...DEFAULT_CLASSNAMES,
    ...(opts.classNames || {})
  };

  return class Tooltip extends React.Component<P, State> {
    // The wrapped RefElm component. Important to maintain reference so
    // that re-renders don't unmount the prior component.
    protected refElmComponent: React.ComponentClass<P>;

    constructor(props: P) {
      super(props);
      this.state = { active: false };
      this.refElmComponent = refElm({
        id: opts.id,
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
      return this.state.active ?
        <Tip refElm={refElm} classNames={tooltipClassnames}>
          { React.createElement(appendElm, ownProps) }
        </Tip> : null;
    }

    activate = () => this.setState({ active: true });
    deactivate = () => this.setState({ active: false });
  };
}