import * as React from 'react';
import { mount } from 'enzyme';
import test from '../../../lib/sandbox';
import append from './index';

interface TestProps {
  name: string;
  children?: React.ReactNode;
}

const Appended = append<TestProps>({
  id: p => p.name,
  inline: p => <p id={'inline-' + p.name}>
    { p.children }
  </p>,
  append: p => <div id={'append-' + p.name}>
    { p.children }
  </div>
});

const Wrapper = (p: { name: string; childContent: string }) =>
  <Appended name={p.name}>
    <span>{ p.childContent }</span>
  </Appended>;

// Helper function that returns a promise on next animation tick
const nextFrame = () => new Promise(r => window.requestAnimationFrame(r));

test('initial render', async t => {
  // Pre-fill DOM with some stuff so we can check appended content is at
  // the *end* of the body
  document.body.innerHTML = '<header></header><main></main><footer></footer>';

  let name = 'MyName';
  let childContent = 'Hello child.';
  let wrapper = mount(<Wrapper name={name} childContent={childContent} />);

  let inline = wrapper.find('#inline-' + name);
  t.equals(
    inline.text(),
    childContent,
    'renders inline element with children'
  );

  // Wait a moment for requestAnimationFrame to kick in.
  await nextFrame();

  let appendContainer = document.getElementById(name)!;
  t.equals(
    appendContainer.previousElementSibling!.tagName.toLowerCase(),
    'footer',
    'renders append container at end of body'
  );

  t.equals(
    appendContainer.children.length, 1,
    'renders only one element inside mount point'
  );

  let append = appendContainer.children.item(0);
  t.equals(
    append.id, 'append-' + name,
    'renders appended attrs and props'
  );
  t.equals(
    append.textContent, childContent,
    'renders appended children'
  );
});


test('updates and unmount', async t => {
  let name = 'MyName';
  let childContent = 'Hello child.';
  let wrapper = mount(<Wrapper name={name} childContent={childContent} />);

  // Wait a moment for requestAnimationFrame to kick in.
  await nextFrame();

  childContent = 'I said, hello child.';
  wrapper.setProps({ childContent });
  await nextFrame();

  let inline = wrapper.find('#inline-' + name);
  t.equals(
    inline.text(),
    childContent,
    'updates inline element content'
  );

  let append = document.getElementById('append-' + name)!;
  t.equals(
    append.textContent, childContent,
    'updates appended children'
  );

  wrapper.unmount();
  await nextFrame();

  t.assert(
    !document.getElementById('append-' + name),
    'removes container on unmount'
  );
});


test('multiple appends', async t => {
  let name1 = 'name-1';
  let name2 = 'name-2';
  let wrapper1 = mount(<Wrapper name={name1} childContent={''} />);
  mount(<Wrapper name={name2} childContent={''} />);

  // Wait a moment for requestAnimationFrame to kick in.
  await nextFrame();

  t.assert(document.getElementById(name1), 'renders element with first ID');
  t.assert(document.getElementById(name2), 'renders element with second ID');

  // ID change
  let name3 = 'name-3';
  wrapper1.setProps({ name: name3 });
  await nextFrame();

  t.not(document.getElementById(name1), 'unmounts element at old ID' );
  t.assert(document.getElementById(name3), 'renders element with new ID');
  t.assert(document.getElementById(name2), 'other ID is untouched');
});
