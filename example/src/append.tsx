import * as React from 'react';
import Append from 'react-append';

interface State {
  active: boolean;
}

export default class AppendContainer extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { active: false };
  }

  render() {
    return <div>
      <button onClick={this.toggle}>
        { this.state.active ?
          'Hide appended content' :
          'Show appended content '}
      </button>

      { this.state.active ?
        <Append>
          <div style={{ margin: '1rem' }}>
            This should append at the end of the body.
          </div>
        </Append> : null }
    </div>;
  }

  toggle = () => this.setState({ active: !this.state.active });
}