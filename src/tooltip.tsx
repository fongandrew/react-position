/*
  Component for mouseover / mouseout tooltip centered above content.
  Automatically shifts left / right or below content to avoid going out of
  window bounds.
*/

import * as React from 'react';
import { documentOffset, viewportSize } from './position';
import refElm from './ref-elm';
import popover, { Position, PopoverOpts } from './popover';

// Props for inline content that triggers tooltip
export interface InlineProps {
  onFocus: React.FocusEventHandler<any>;
  onBlur: React.FocusEventHandler<any>;
  onMouseOver: React.MouseEventHandler<any>;
  onMouseOut: React.MouseEventHandler<any>;
}

export interface Props extends PopoverOpts {
  id?: string;

  // Content triggering tooltip
  inline: (props: InlineProps) => React.ReactNode;

  // Main tooltip content to render
  tooltip: (pos: Position) => React.ReactNode;
}

export interface State {
  active: boolean;
}

const DEFAULT_TOOLTIP_ID = 'react-append-tooltip';

export class Tooltip extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: false };

    // Needed for absolute positioning of append element (can be body
    // too, but just check it's consistent with renderAppend)
    document.documentElement.style.position = 'relative';
  }

  render() {
    let { id, inline, tooltip, children, ...popoverProps } = this.props;
    return refElm({
      id: id || DEFAULT_TOOLTIP_ID,

      inline: inline({
        onMouseOver: this.activate,
        onMouseOut: this.deactivate,
        onFocus: this.activate,
        onBlur: this.deactivate
      }),

      append: refElm => this.state.active ? popover({
        refElm,
        content: this.props.tooltip,
        adjustAlign: true,
        adjustPos: true,
        position: 'top',
        align: 'center',
        ...popoverProps
      }) : null
    });
  }

  activate = () => this.setState({ active: true });
  deactivate = () => this.setState({ active: false });
}

export default function(props: Props) {
  return <Tooltip {...props} />;
}