require('./tooltip.css');
import * as React from 'react';
import refElm from 'react-append/lib/ref-elm';
import popover, { Position, Align } from 'react-append/lib/popover';

interface Props {
  position: Position;
  align: Align;
  children: React.ReactNode;
}

interface State {
  active: boolean;
}

export default class PopoverBtn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: false };
  }

  render() {
    return <span style={{ display: 'inline-block', margin: '0.25rem' }}>
      { this.renderBtn() }
    </span>;
  }

  renderBtn() {
    let { children, ...props } = this.props;
    return refElm({
      inline:  <button onClick={this.toggle}>{ children }</button>,
      append: refElm => this.state.active ? popover({
        adjustPos: true,
        adjustAlign: true,
        refElm,
        content: pos => <div className={`tooltip ${pos}`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>,
        arrow: pos => <div className={`tooltip-arrow ${pos}`}>{' '}</div>,
        ...props
      }) : null
    });
  }

  toggle = () => this.setState({ active: !this.state.active });
}
