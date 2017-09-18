import * as React from 'react';
import refElm, { RefElmProps } from 'react-append-ref-elm';

interface Props {
  active: boolean;
  onToggle: () => void;
}

const AnchorContent = refElm({
  inline: (p: Props) => <button onClick={p.onToggle}>
    Show anchored content
  </button>,
  append: ({ ownProps, RefDiv }: RefElmProps<Props>) => ownProps.active ?
    <RefDiv>
      <div style={{
        position: 'absolute',
        top: '-1rem',
        left: '-1rem',
        right: '-1rem',
        bottom: '-1rem',
        background: 'rgba(255, 200, 0, 0.5)'
      }}>
        <button onClick={ownProps.onToggle} style={{
          position: 'absolute',
          right: '0.5rem',
          top: '0.5rem'
        }}>
          &times;
        </button>
      </div>
    </RefDiv> : null
});

interface State {
  active: boolean;
}

export default class AnchorContainer extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { active: false };
  }

  render() {
    return <AnchorContent
      active={this.state.active}
      onToggle={() => this.setState({ active: !this.state.active })}
    />;
  }
}