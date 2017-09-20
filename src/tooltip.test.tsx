import * as React from 'react';
import { mount } from 'enzyme';
import nextFrame from 'test-helpers/next-frame';
import test from 'test-helpers/sandbox';
import tooltip from './tooltip';

const Tooltip = tooltip<React.HTMLAttributes<HTMLSpanElement>>({
  inline: ({ children, ...props }) => <span {...props}>
    { children }
  </span>,
  append: props => <div id="tooltip">
    { props.title }
  </div>
});

test('Tooltip activation', async t => {
  let wrapper = mount(<Tooltip id="has-tooltip" title="Hello Tooltip">
    <span>Hello Inline</span>
  </Tooltip>);

  // Wait a frame for append to render
  await nextFrame();

  let tipElm = document.getElementById('tooltip');
  t.not(tipElm, 'doesn\'t render tooltip by default');

  wrapper.find('#has-tooltip').simulate('mouseOver');
  wrapper.update();
  await nextFrame();
  t.assert(
    document.getElementById('tooltip'),
    'renders tooltip on mouseover'
  );

  wrapper.find('#has-tooltip').simulate('mouseOut');
  wrapper.update();
  await nextFrame();
  t.not(
    document.getElementById('tooltip'),
    'hides tooltip on mouseout'
  );

  wrapper.find('#has-tooltip').simulate('focus');
  wrapper.update();
  await nextFrame();
  t.assert(
    document.getElementById('tooltip'),
    'renders tooltip on focus'
  );

  wrapper.find('#has-tooltip').simulate('blur');
  wrapper.update();
  await nextFrame();
  t.not(
    document.getElementById('tooltip'),
    'hides tooltip on blur'
  );
});