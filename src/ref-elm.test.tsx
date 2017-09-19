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
  append: ({ RefDiv, ownProps, rect, rectPct }) => {
    ownProps.spy('rect', rect);
    ownProps.spy('rectPct', rectPct);
    return <RefDiv id={'ref-div-' + ownProps.name}>
      Hello World
    </RefDiv>;
  },
});

test('appended reference elements', async (t, s) => {
  let spy = s.spy();
  let wrapper = mount(<AppendRef name="ABC" spy={spy} />);
  s.stub(
    wrapper.find('#ref-inline-ABC').getDOMNode()!,
    'getBoundingClientRect'
  ).returns({
    bottom: 1020,
    top: 980,
    height: 40,
    left: 60,
    right: 180,
    width: 120
  });
  s.stub(
    document.documentElement,
    'getBoundingClientRect'
  ).returns({
    bottom: 1000,
    top: -500,
    height: 1500,
    left: -100,
    right: 900,
    width: 1000
  });
  Object.defineProperty(document.documentElement, 'clientWidth', {
    value: 1200
  });
  Object.defineProperty(document.documentElement, 'clientHeight', {
    value: 1000
  });

  await nextFrame(); // Wait for requestAnimationFrame

  let elm = document.getElementById('ref-div-ABC')!;
  t.equals(
    elm.textContent,
    'Hello World',
    'preserves children of referenced elements'
  );
  t.equals(elm.style.position, 'absolute');
  t.equals(elm.style.top, '1480px');
  t.equals(elm.style.left, '160px');
  t.equals(elm.style.height, '40px');
  t.equals(elm.style.width, '120px');

  t.calledWith(spy, 'rect', {
    bottom: 1020,
    height: 40,
    left: 60,
    right: 180,
    top: 980,
    width: 120
  });

  t.calledWith(spy, 'rectPct', {
    top: 0.98,
    bottom: 1.02,
    height: 0.04,
    left: 0.05,
    right: 0.15,
    width: 0.1
  });
});