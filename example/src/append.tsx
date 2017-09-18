import * as React from 'react';
import append from 'react-append';

interface Props {
  active: boolean;
  onToggle: () => void;
}

const AppendContent = append({
  inline: (p: Props) => <button onClick={p.onToggle}>
    { p.active ? 'Hide appended content' : 'Show appended content '}
  </button>,
  append: (p: Props) => p.active ? <div style={{ margin: '1rem' }}>
    This should append at the end of the body.
  </div> : null
});

interface State {
  active: boolean;
}

export default class AppendContainer extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { active: false }
  }

  render() {
    return <AppendContent
      active={this.state.active}
      onToggle={() => this.setState({ active: !this.state.active })}
    />;
  }
}