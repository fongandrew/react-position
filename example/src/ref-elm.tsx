import * as React from 'react';
import { relativeToDocument } from 'react-append/lib/position';
import refElm from 'react-append/lib/ref-elm';


interface State {
  active: boolean;
}

export default class RefElmContainer extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { active: false };
  }

  render() {
    return refElm({
      inline: <button onClick={this.toggle}>
        Show anchored content
      </button>,

      append: elm => this.state.active ?
        <div style={{
          position: 'absolute',
          ...relativeToDocument(elm)
        }}>
          <div style={{
            position: 'absolute',
            top: '-1rem',
            left: '-1rem',
            right: '-1rem',
            bottom: '-1rem',
            background: 'rgba(255, 200, 0, 0.5)'
          }}>
            <button onClick={this.toggle} style={{
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem'
            }}>
              &times;
            </button>
          </div>
        </div> : null
    });
  }

  toggle = () => this.setState({ active: !this.state.active });
}