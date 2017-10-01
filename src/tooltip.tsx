/*
  HOC for mouseover / mouseout tooltip centered above content. Automatically
  shifts left / right or below content to avoid going out of window bounds.
*/

import * as React from 'react';
import { relativeToDocument, getViewportSize } from './position';
import refElm from './ref-elm';

export type RenderFn<P> = (props: P) => React.ReactNode;

// Props for inline content that triggers tooltip
export interface InlineProps {
  onFocus: React.FocusEventHandler<any>;
  onBlur: React.FocusEventHandler<any>;
  onMouseOver: React.MouseEventHandler<any>;
  onMouseOut: React.MouseEventHandler<any>;
}

// Is tooltip above or below inline content?
export type VPos = 'top'|'bottom';

/*
  Tip component for actual floating tooltip - responsible for repositioning
  to avoid going out of bounds. Renders one div around content and another
  just for the tooltip arrow. Both are wrapped in a container div.

  Approach: Render initial component in default position (centered above
  reference element). If too far left or right, shift content left or right
  appropriately. Arrow always remains centered on container element though.
  If top clips viewport, move tooltip below element.
*/
export interface WrapperProps {
  refElm: Element;
  tip: RenderFn<VPos>;
  arrow?: RenderFn<VPos>;
}

/*
  TooltipWrapper may be rendered twice (inital + offset fix). Track passCount
  so we know if we're in the second stage and track any offsets from previous
  nudges to get tooltip in the right place.
*/
export interface WrapperState {
  passCount: number;

  // Set after render if correction needed
  vPos?: VPos;
  hOffset?: { left: number; }|{ right: number; };
}

export class TooltipWrapper extends React.Component<
  WrapperProps,
  WrapperState
> {
  _tip: HTMLDivElement|null = null;

  constructor(props: WrapperProps) {
    super(props);
    this.state = { passCount: 0 };
  }

  componentWillReceiveProps() {
    this.setState({ passCount: 0 });
  }

  render() {
    let {
      left, right, top,
      width, height
    } = relativeToDocument(this.props.refElm);

    // Render above or below content?
    let vPos = this.state.vPos || 'top';
    let translateY = vPos === 'top' ? '-100%' : (height + 'px');

    // Center above element. Use distance from right if less than
    // left for positioning.
    let hOffset: { left: number; }|{ right: number; };
    let translateX: string;
    if (left <= right) {
      hOffset = { left: left + (width / 2 ) };
      translateX = '-50%';
    }
    else {
      hOffset = { right: right + (width / 2 ) };
      translateX = '50%';
    }

    // Arrow is always horizontally centered on inline element
    let arrowStyle: React.CSSProperties = {
      ...hOffset,
      position: 'absolute',
      top,
      transform: `translate(${translateX}, ${translateY})`,
      margin: 0
    };

    // Actual tip content can be adjusted based on state
    let tipStyle = this.state.hOffset ? {
      ...arrowStyle,
      ...this.state.hOffset,
      transform: `translate(0, ${translateY})`
    } : { ...arrowStyle };

    return [
      <div key="tip" ref={c => this._tip = c} style={tipStyle}>
        { this.props.tip(vPos) }
      </div>,

      this.props.arrow ? <div key="arrow" style={arrowStyle}>
        { this.props.arrow(vPos) }
      </div> : null
    ] as any; // Pending fragment type support for React v16
  }

  componentDidMount() {
    this.updatePos();
  }

  componentDidUpdate() {
    this.updatePos();
  }

  updatePos() {
    if (this._tip && !this.state.passCount) {
      let { width: vw, height: vh } = getViewportSize();
      let { left, right, top, bottom } = this._tip.getBoundingClientRect();

      // Horizontal
      let hOffset: WrapperState['hOffset'];
      if (left < 0) {
        hOffset = { left: 0 };
      } else if (right > vw) {
        hOffset = { right: 0 };
      }

      // Vertical
      let vPos: WrapperState['vPos'];
      if (top < 0) {
        vPos = 'bottom';
      } else if (bottom > vh) {
        vPos = 'top';
      }

      // Update only if applicable
      if (hOffset || vPos) {
        this.setState({
          passCount: 1,
          ...(hOffset && { hOffset }),
          ...(vPos && { vPos })
        });
      }
    }
  }
}

// Props + state for the overall tooltip component
export interface Props {
  id?: string;
  inline: RenderFn<InlineProps>;
  tip: RenderFn<VPos>;
  arrow?: RenderFn<VPos>;
}

export interface State {
  active: boolean;
}

export class Tooltip extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: false };

    // Needed for absolute positioning of append element (can be body
    // too, but just check it's consistent with renderAppend)
    document.documentElement.style.position = 'relative';
  }

  render() {
    return refElm({
      id: this.props.id,

      inline: this.props.inline({
        onMouseOver: this.activate,
        onMouseOut: this.deactivate,
        onFocus: this.activate,
        onBlur: this.deactivate
      }),

      append: refElm => this.state.active ? <TooltipWrapper
        refElm={refElm}
        tip={this.props.tip}
        arrow={this.props.arrow}
      /> : null
    });
  }

  activate = () => this.setState({ active: true });
  deactivate = () => this.setState({ active: false });
}

export default function(props: Props) {
  return <Tooltip {...props} />;
}