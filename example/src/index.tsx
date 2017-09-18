require('normalize.css');
require('index.css');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Append from './append';
import Anchor from './anchor';

class App extends React.Component<{}, {}> {
  render() {
    return <div>
      <h1>React Append Demo</h1>

      <div className="demo-container">
        <h2>Simple append element</h2>
        <p>
          This button lives several layers deep in our element tree, but
          clicking it will append a div to the end of the body.
        </p>
        <div>
          <Append />
        </div>
      </div>

      <div className="demo-container">
        <h2>Anchored Element</h2>
        <p>
          This button opens a div that is positioned relative to the position
          of the button (but still lives at the end of the body).
        </p>
        <div>
          <Anchor />
        </div>
      </div>


    </div>;
  }
}

let mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
ReactDOM.render(<App />, mountPoint);