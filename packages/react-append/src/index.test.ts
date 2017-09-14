import test from './test';
import { add } from './index';

test('Adds up', (assert) => {
  assert.equals(add(1, 2), 3);
});
