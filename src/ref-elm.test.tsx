import * as React from 'react';
import { mount } from 'enzyme';
import nextFrame from '../test-helpers/next-frame';
import test from '../test-helpers/sandbox';
import refElm from './ref-elm';

interface TestProps {
  name: string;
  spy: Function;
}

test('appended reference elements', async (t, s) => {
  let spy = s.spy();
  let wrapper = mount(refElm({
    inline: <div id="inline" />,
    append: refElm => {
      spy('refElm', refElm);
      return <div id="appended">
        Hello World
      </div>;
    },
  }));
  let ref = wrapper.find('#inline').getDOMNode();
  await nextFrame(); // Wait for requestAnimationFrame

  let elm = document.getElementById('appended')!;
  t.equals(
    elm.textContent,
    'Hello World',
    'preserves children of referenced elements'
  );
  t.calledWith(spy, 'refElm', ref);
});