import * as React from 'react';
import anchor, { AnchorProps } from 'react-append-anchor';

interface Props {
  active: boolean;
  onToggle: () => void;
}

const AnchorContent = anchor({
  id: 'anchor-main',
  inline: (p: Props) => <button onClick={p.onToggle}>
    Show anchored content
  </button>,
  append: ({ ownProps, Wrapper }: AnchorProps<Props>) => ownProps.active ?
    <Wrapper id="wrapper">
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
    </Wrapper> : null
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