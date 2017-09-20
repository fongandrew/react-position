import * as React from 'react';
import { relativeToDocument } from 'react-append/position';
import refElm, { RefElmProps } from 'react-append/ref-elm';

interface Props {
  active: boolean;
  onToggle: () => void;
}

const RefElmContent = refElm({
  inline: (p: Props) => <button onClick={p.onToggle}>
    Show anchored content
  </button>,
  append: ({ ownProps, refElm }: RefElmProps<Props>) => ownProps.active ?
    <div style={{
      position: 'absolute',
      ...relativeToDocument(refElm)
    }}>
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
    </div> : null
});

interface State {
  active: boolean;
}

export default class RefElmContainer extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { active: false };
  }

  render() {
    return <RefElmContent
      active={this.state.active}
      onToggle={() => this.setState({ active: !this.state.active })}
    />;
  }
}