require('normalize.css');
require('index.css');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Append from './append';
import RefElm from './ref-elm';
import Popover from './popover';
import Tooltip from './tooltip';

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
        <h2>Reference Element</h2>
        <p>
          This button opens a div that is positioned relative to the position
          of the button (but still lives at the end of the body).
        </p>
        <div>
          <RefElm />
        </div>
      </div>

      <div className="demo-container">
        <h2>Popover</h2>
        <p>
          These buttons open popovers positioned around them. These popovers
          auto-adjust their positioning when the popover is near the edge
          of the screen to try to stay in view as much as possible.
        </p>
        <div>
          <Popover position="top" align="left">Top / Left</Popover>
          <Popover position="top" align="center">Top / Center</Popover>
          <Popover position="top" align="right">Top / Right</Popover>
          <Popover position="left" align="top">Left / Top</Popover>
          <Popover position="left" align="center">Left / Center</Popover>
          <Popover position="left" align="bottom">Left / Bottom</Popover>
          <Popover position="right" align="top">Right / Top</Popover>
          <Popover position="right" align="center">Right / Center</Popover>
          <Popover position="right" align="bottom">Right / Bottom</Popover>
          <Popover position="bottom" align="left">Bottom / Left</Popover>
          <Popover position="bottom" align="center">Bottom / Center</Popover>
          <Popover position="bottom" align="right">Bottom / Right</Popover>
        </div>
      </div>

      <div className="demo-container">
        <h2>Tooltip</h2>
        <p>
          Hover over the text below to trigger a tooltip.
        </p>
        <div style={{ textAlign: 'center' }}>
          <span style={{ float: 'left' }}>
            <Tooltip><em>Left Tooltip</em></Tooltip>
          </span>
          <span style={{ float: 'right' }}>
            <Tooltip><em>Right Tooltip</em></Tooltip>
          </span>
          <span>
            <Tooltip><em>Center Tooltip</em></Tooltip>
          </span>
        </div>
      </div>

      {/* So we can scroll demo area around to test auto-adjust */}
      <div style={{ height: '100vh' }} />
    </div>;
  }
}

let mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
ReactDOM.render(<App />, mountPoint);
