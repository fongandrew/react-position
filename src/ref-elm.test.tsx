import * as React from 'react';
import { mount } from 'enzyme';
import nextFrame from 'test-helpers/next-frame';
import test from 'test-helpers/sandbox';
import appendRefElm from './ref-elm';

interface TestProps {
  name: string;
  spy: Function;
}

const AppendRef = appendRefElm<TestProps>({
  inline: p => <div id={'ref-inline-' + p.name }>{ p.name }</div>,
  append: ({ refElm, ownProps }) => {
    ownProps.spy('refElm', refElm);
    return <div id={'ref-div-' + ownProps.name}>
      Hello World
    </div>;
  },
});

test('appended reference elements', async (t, s) => {
  let spy = s.spy();
  let wrapper = mount(<AppendRef name="ABC" spy={spy} />);
  let refElm = wrapper.find('#ref-inline-ABC').getDOMNode();
  await nextFrame(); // Wait for requestAnimationFrame

  let elm = document.getElementById('ref-div-ABC')!;
  t.equals(
    elm.textContent,
    'Hello World',
    'preserves children of referenced elements'
  );
  t.calledWith(spy, 'refElm', refElm);
});