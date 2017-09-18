import * as React from 'react';
import anchor, { AnchorProps } from 'react-append-anchor';

interface Props {
  active: boolean;
  onToggle: () => void;
}

const AnchorContent = anchor({
  id: 'anchor-main',
  inline: (p: Props) => <button onClick={p.onToggle}>
    { p.active ? 'Hide anchored content' : 'Show anchored content '}
  </button>,
  append: ({ ownProps, Wrapper }: AnchorProps<Props>) => ownProps.active ?
    <Wrapper>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '5px solid #fc0'
      }} />
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