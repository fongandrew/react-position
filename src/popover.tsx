/*
  Component for popover elements (div + arrow pointing to another element).

  Popovers are rendered initially in some default position and shifted to fit
  on screen if necessary.
*/

import * as React from 'react';
import {
  Offset,
  documentOffset,
  viewportOffset,
  relativeViewportOffset
} from './position';

// Convenience type
export type Style = React.CSSProperties;

// Position of popover on axis intersecting reference element
export type Position = 'left'|'right'|'top'|'bottom';

// Position of popover on axis parallel to reference element
export type Align = 'left'|'right'|'top'|'bottom'|'center';

// Default popover position
export const DEFAULT_POSITION: Position = 'top';

// Reversed positions
export const FLIPPED: Record<Position, Position> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};

// Helper that returns offset for a given position
export const getPosStyle = function(offset: Offset, pos: Position): Style {
  switch (pos) {
    case 'top':
      return { bottom: offset.bottom + offset.height };
    case 'bottom':
      return { top: offset.top + offset.height };
    case 'left':
      return { right: offset.right + offset.width };
    case 'right':
      return { left: offset.left + offset.width };
  }
};

// Helper that returns style for a given alignment
export const getAlignStyle = function(
  offset: Offset,
  pos: Position,
  align: Align
): Style {
  switch (align) {
    case 'left':
      return { left: offset.left };

    case 'right':
      return { right: offset.right };

    case 'top':
      return { top: offset.top };

    case 'bottom':
      return { bottom: offset.bottom };

    case 'center':
      if (pos === 'top' || pos === 'bottom') {
        // Center horizontally - pick closer left/right edge to avoid squishing
        // content against parent element edge
        if (offset.left <= offset.right) {
          return {
            left: offset.left + (offset.width / 2),
            transform: 'translateX(-50%)'
          };
        } else {
          return {
            right: offset.right + (offset.width / 2),
            transform: 'translateX(50%)'
          };
        }
      }

      else {
        // Center vertically - pick closer top/bottom edge to avoid squishing
        // content against parent element edge
        if (offset.top <= offset.bottom) {
          return {
            top: offset.top + (offset.height / 2),
            transform: 'translateY(-50%)'
          };
        } else {
          return {
            bottom: offset.bottom + (offset.height / 2),
            transform: 'translateY(50%)'
          };
        }
      }
  }
};

// Options frequently used by other components
export interface PopoverOpts {
  // How to render arrow pointing to refElm
  arrow?: (pos: Position) => React.ReactNode;

  // Position and alignment (act as defaults if adjustPos / adjustAlign set)
  position?: Position;
  align?: Align;

  // Automatically adjust popover location?
  adjustPos?: boolean;
  adjustAlign?: boolean;
}

export interface Props extends PopoverOpts {
  // Element being pointed to
  refElm: Element;

  // Main popover content to render
  content: (pos: Position) => React.ReactNode;
}

export interface State {
  position?: Position;      // Current position of popover
  posStyle?: Style;         // Offset from position
  alignStyle?: Style;       // Offset from alignment
}

export class Popover extends React.Component<Props, State> {
  // Refs
  _content: HTMLDivElement|null = null;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps: Props) {
    // Reset state on new props
    this.setState({
      position: undefined,
      posStyle: undefined,
      alignStyle: undefined
    });
  }

  // Position of popover
  getPos() {
    return this.state.position || this.props.position || DEFAULT_POSITION;
  }

  render() {
    const pos = this.getPos();
    const align = this.props.align || 'center';
    const offset = documentOffset(this.props.refElm);

    const baseStyle: Style = {
      position: 'absolute',
      margin: 0
    };
    const posStyle = this.state.posStyle ||
      getPosStyle(offset, pos);
    const alignStyle = this.state.alignStyle ||
      getAlignStyle(offset, pos, align);

    // Popover alignment can vary to fit in screen
    const contentStyle = {
      ...baseStyle,
      ...posStyle,
      ...alignStyle
    };

    // Arrow is always centered
    const arrowStyle: React.CSSProperties = {
      ...baseStyle,
      ...posStyle,
      ...getAlignStyle(offset, pos, 'center')
    };

    return [
      <div key="content" ref={c => this._content = c} style={contentStyle}>
        { this.props.content(pos) }
      </div>,

      this.props.arrow ? <div key="arrow" style={arrowStyle}>
        { this.props.arrow(pos) }
      </div> : null
    ] as any; // Pending fragment type support for React v16
  }

  componentDidMount() {
    this.updateStyles();
  }

  componentDidUpdate() {
    this.updateStyles();
  }

  // Update styling on _content element
  updateStyles() {
    if (!this._content) return;

    const pos = this.getPos();
    const contentOffset = viewportOffset(this._content);

    // Adjust position
    if (this.props.adjustPos && !this.state.posStyle) {
      // If position adjusted, return (don't adjust alignment) because
      // alignment fixes may not be necessary after flipping
      if (contentOffset[pos] < 0 && this.flipPos()) return;
    }

    // Adjust alignment
    const alignOffsets = relativeViewportOffset();
    if (this.props.adjustAlign && !this.state.alignStyle) {
      if (pos === 'top' || pos === 'bottom') {
        if (contentOffset.left < 0) {
          this.setState({ alignStyle: { left: alignOffsets.left } });
        } else if (contentOffset.right < 0) {
          this.setState({ alignStyle: { right: alignOffsets.right } });
        }
      }
      else {
        if (contentOffset.top < 0) {
          this.setState({ alignStyle: { top: alignOffsets.top } });
        } else if (contentOffset.bottom < 0) {
          this.setState({ alignStyle: { bottom: alignOffsets.bottom } });
        }
      }
    }
  }

  // Flips position of popover to a given position -- but only if there's
  // more space than its current position. Return true if flipped.
  flipPos() {
    const currentPos = this.getPos();
    const nextPos = FLIPPED[currentPos];
    const refElmOffset = viewportOffset(this.props.refElm);

    // Only flip if more space on other side
    if (refElmOffset[nextPos] > refElmOffset[currentPos]) {
      this.setState({
        position: nextPos,
        posStyle: getPosStyle(documentOffset(this.props.refElm), nextPos),
        alignStyle: undefined
      });
      return true;
    }

    return false;
  }
}

export default function(props: Props) {
  return <Popover {...props} />;
}