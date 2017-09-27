import test from '../test-helpers/sandbox';
import { relativeToDocument, relativeToViewportPct } from './position';

test('relativeToDocument', (t, s) => {
  let elm = document.createElement('div');
  s.stub(
    elm,
    'getBoundingClientRect'
  ).returns({
    bottom: 1020,
    top: 980,
    height: 40,
    left: 60,
    right: 180,
    width: 120
  });
  document.body.appendChild(elm);

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

  t.deepEqual(
    relativeToDocument(elm),
    {
      top: 1480,
      left: 160,
      height: 40,
      width: 120
    },
    'returns top, left, height, width values correctly'
  );
});

test('relativeToViewportPct', (t, s) => {
  let elm = document.createElement('div');
  s.stub(
    elm,
    'getBoundingClientRect'
  ).returns({
    bottom: 1020,
    top: 980,
    height: 40,
    left: 60,
    right: 180,
    width: 120
  });
  document.body.appendChild(elm);

  Object.defineProperty(document.documentElement, 'clientWidth', {
    value: 1200
  });
  Object.defineProperty(document.documentElement, 'clientHeight', {
    value: 1000
  });

  t.deepEqual(
    relativeToViewportPct(elm),
    {
      top: 0.98,
      bottom: 1.02,
      height: 0.04,
      left: 0.05,
      right: 0.15,
      width: 0.1
    },
    'returns correct percentage values'
  );
});
