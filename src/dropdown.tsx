/*
  Component for mouseover / mouseout tooltip centered above content.
  Automatically shifts left / right or below content to avoid going out of
  window bounds.
*/

import * as React from 'react';
import { viewportOffset } from './position';
import refElm from './ref-elm';
import popover, { Position, Align, PopoverOpts } from './popover';
import { toElement, Fragment } from './types';

// Props for inline content that triggers tooltip
export interface InlineProps {
  onClick: React.MouseEventHandler<any>;
}

export interface MenuProps {
  position: Position;
  style: React.CSSProperties;
  close: () => void;
}

export interface OverlayProps {
  style: React.CSSProperties;
  close: () => void;
}

export interface Props extends PopoverOpts {
  id?: string;

  // Content triggering dropdown
  inline: (props: InlineProps) => React.ReactNode;

  // Dropdown menu to render
  menu: (props: MenuProps) => React.ReactNode;

  // Overlay (closes dropdown) to render
  overlay?: (props: OverlayProps) => React.ReactNode;
}

export interface State {
  active: boolean;
}

const DEFAULT_DROPDOWN_ID = 'react-append-dropdown';

export class Dropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: false };

    // Needed for absolute positioning of append element (can be body
    // too, but just check it's consistent with renderAppend)
    document.documentElement.style.position = 'relative';
  }

  render() {
    let { id, inline, menu, overlay, children, ...popoverProps } = this.props;
    return refElm({
      id: id || DEFAULT_DROPDOWN_ID,

      inline: inline({
        onClick: this.toggle
      }),

      append: refElm => this.state.active ? <Fragment>
        { overlay ? overlay({
          close: this.deactivate,
          style: {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        }) : null }
        { popover({
          refElm,
          content: this.renderMenu,
          adjustAlign: true,
          adjustPos: true,
          ...this.guessPosAlign(refElm),
          ...popoverProps
        }) }
      </Fragment> : null
    });
  }

  // Guess initial positions based on alignment
  guessPosAlign(element: Element) {
    const offset = viewportOffset(element);
    const position: Position = offset.top > offset.bottom ? 'bottom' : 'top';
    const align: Align = offset.left > offset.right ? 'right' : 'left';
    return { position, align };
  }

  renderMenu = (props: { position: Position, style: React.CSSProperties }) =>
    this.props.menu({ ...props, close: this.deactivate })

  activate = () => this.setState({ active: true });
  deactivate = () => this.setState({ active: false });
  toggle = () => this.setState({ active: !this.state.active });
}

export default function(props: Props) {
  return <Dropdown {...props} />;
}