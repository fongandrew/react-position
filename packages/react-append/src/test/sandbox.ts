/*
  Convenience wrappers around tape that sets up Sinon sandboxing. Integrates
  some assertions between sinon and tape. Handles calling test.end. Usage:

    describe('myFunction', it => {
      it('stores API result', async (assert, sandbox) => {
        let apiSpy = sandbox.stub(Api, 'getThing', 'id')
          .returns(Promise.resolve('result'));
        let storeSpy = sandbox.stub(Store, 'set');
        await myFunction();
        assert.calledWith(apiSpy, 'id');
        assert.calledWith(storeSpy, 'result');
      });
    });
*/

import tape = require('tape');
import { Test, TestCase } from 'tape'; // Types
import * as sinon from 'sinon';

// Get type with actual Sinon asseriotns
const { pass, fail, ...sinonAssertTmp } = sinon.assert;
export const sinonAssert = sinonAssertTmp;
export type SinonAssertions = typeof sinonAssert;

// Combine Tape and Sinon assertions / matches into one object.
export interface Assertions extends Test, SinonAssertions {
  match: typeof sinon.match;
}

export type SandboxTestCase =
  (assert: Assertions, sandbox: sinon.SinonSandbox) => void|Promise<void>;

export interface SandboxTestFn {
  (name: string, tc: SandboxTestCase): void;
}

// Helper to wrap tape and its only / skip variants.
export type TapeWrapper<W extends Function> = W & {
  only: W;
  skip: W;
};

const wrapTestFn = function<W extends Function>(
  wrapper: (tape: (name: string, tc: TestCase) => void) => W
): TapeWrapper<W> {
  let ret = wrapper(tape) as TapeWrapper<W>;
  ret.only = wrapper(tape.only);
  ret.skip = wrapper(tape.skip);
  return ret;
};

const wrapForSandbox = (t: Test) => (tc: SandboxTestCase) => {
  // See https://github.com/substack/tape/issues/386
  if (! tc.name) {
    Object.defineProperty(tc, 'name', {
      value: '<anonymous>'
    });
  }

  const assert: Assertions = {
    ...t,
    ...sinon.assert,
    match: sinon.match
  };

  // Connect Sinon hooks with Tape
  sinon.assert.pass = (assertion) => t.pass(assertion);
  sinon.assert.fail = (message) => {
    let err = new Error(message);
    err.name = sinon.assert.failException;
    t.error(err);
  };

  // Create sinon sandbox -- restore and call appropriate Tape assertion
  // at the end of test.
  const sandbox = sinon.sandbox.create();
  Promise.resolve(tc(assert, sandbox)).then(
    () => {
      sandbox.restore();
      t.end();
    },

    (err) => {
      sandbox.restore();
      console.error(err); // Get proper stack trace
      t.error(err);
    }
  );
};

export const test = wrapTestFn<SandboxTestFn>(
  tape => (name, tc) => tape(name, t => wrapForSandbox(t)(tc))
);

// Group tape tests together
export const describe = function(
  groupName: string,
  fn: (it: TapeWrapper<SandboxTestFn>) => void
) {
  let prefix = groupName + ': ';
  let it = wrapTestFn<SandboxTestFn>(
    tape => (name, tc) => tape(prefix + name, t => wrapForSandbox(t)(tc))
  );
  return fn(it);
};

export default test;