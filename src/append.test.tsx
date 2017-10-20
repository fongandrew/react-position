import * as React from 'react';
import { mount } from 'enzyme';
import test from '../test-helpers/sandbox';
import Append from './append';

test('Append', async t => {
  let wrapper1 = mount(<Append>
    <span id="test-a">Test A</span>
  </Append>);
  mount(<Append>
    <span id="test-b">Test B</span>
  </Append>);

  t.equals(
    document.getElementById('test-a')!.textContent,
    'Test A',
    'creates new ID for each instance of wrapper'
  );

  t.equals(
    document.getElementById('test-b')!.textContent,
    'Test B',
    'creates new ID for each instance of wrapper'
  );

  wrapper1.setProps({ children: <span id="test-c">Test C</span> });

  t.is(
    document.getElementById('test-a'),
    null,
    'removes old content for component instance'
  );
  t.is(
    document.getElementById('test-c')!.textContent,
    'Test C',
    'renders new content for container'
  );

  wrapper1.unmount();
  t.is(
    document.getElementById('test-c'),
    null,
    'cleans up on unmount'
  );
});