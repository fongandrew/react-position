/*
  HOC to create an appended element that depends on the presence of an
  inline element (e.g. for positioning).
*/

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Append, { Props as AppendProps } from './append';

// Props for RefElm component
export interface Props {
  id?: string;
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
    return this.props.children as any; // TODO: Pending React v16 typing
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
    let { passCount, ...props } = this.props;
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
    let { inline, append } = this.props;
    return [
      <InlineWrapper
        key="inline"
        ref={c => this.refElm = c && ReactDOM.findDOMNode(c)}
        passCount={this.state.passCount}
      >
        { inline }
      </InlineWrapper>,

      this.refElm ? <AppendWrapper
        id={this.props.id} key="append"
        passCount={this.state.passCount}
      >
        { append(this.refElm) }
      </AppendWrapper> : null
    ] as any; // TODO: Typecast pending support for fragments in typing
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
