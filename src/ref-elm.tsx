/*
  Component to create an appended element that depends on the presence of an
  inline element (e.g. for positioning).
*/

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Append, { Props as AppendProps } from './append';
import { toElement } from './types';

// Props for RefElm component
export interface Props {
  id?: string;

  /*
    NB: An earlier variant of this tried using component classes rather than
    actual elements and functions. This wasn't a good idea because it's too
    easy to create anonymous functions as stateless components on each
    render loop, which breaks React's reconciliation (and certain event
    handlers, like onMouseOut).
  */
  inline: React.ReactNode;
  append: (refElm: Element) => React.ReactNode;
}

// State for RefElm component -- we track passCount because we need to
// render one set of elements (appended) only after another (inline) is done
export interface State {
  passCount: number;
}


// Wrapper class around inline components to ensure we can set ref -- also
// controls unnecessary updates
export class InlineWrapper extends React.Component<{
  passCount: number;
}, {}> {
  // Only update on first pass
  shouldComponentUpdate(nextProps: { passCount: number }) {
    return nextProps.passCount === 0;
  }

  render() {
    return toElement(this.props.children);
  }
}


// Wrapper class around Append to control unnecessary renders
export class AppendWrapper extends React.Component<AppendProps & {
  passCount: number;
}, {}> {
  // Only update on second pass
  shouldComponentUpdate(nextProps: { passCount: number }) {
    return nextProps.passCount === 1;
  }

  render() {
    const { passCount, ...props } = this.props;
    return <Append {...props}>
      { this.props.children }
    </Append>;
  }
}


// Component to render inline elements first, then append
export class RefElm extends React.Component<Props, State> {
  // The inline component instance we're referencing
  protected refElm: Element|null;

  constructor(props: Props) {
    super(props);
    this.state = { passCount: 0 };
  }

  componentWillReceiveProps() {
    this.setState({ passCount: 0 });
  }

  render() {
    const { inline, append } = this.props;
    let ret = [
      <InlineWrapper
        key="inline"
        ref={c => this.refElm = c && ReactDOM.findDOMNode(c)}
        passCount={this.state.passCount}
      >
        { inline }
      </InlineWrapper>
    ];
    if (this.refElm) {
      ret.push(<AppendWrapper
        id={this.props.id} key="append"
        passCount={this.state.passCount}
      >
        { append(this.refElm) }
      </AppendWrapper>);
    }
    return ret;
  }

  componentDidMount() {
    this.updateSelf();
  }

  componentDidUpdate() {
    this.updateSelf();
  }

  // Trigger a second render with refElm
  updateSelf() {
    if (this.refElm && !this.state.passCount) {
      this.setState({ passCount: 1 });
    }
  }
}

// Functional variant
export default function(props: Props) {
  return <RefElm {...props} />;
}
