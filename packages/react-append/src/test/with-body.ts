/*
  Reset body in between tests
*/

const setup = (content: string) => {
  document.body.innerHTML = content;
}

const teardown = () => {
  document.body.innerHTML = '';
}


function withBody<T>(content: string, cb: () => T): T;
function withBody<T>(cb: () => T): T;
function withBody<T>(firstArg: string|(() => T), secondArg?: () => T) {
  let content = secondArg ? firstArg as string : '';
  let cb = secondArg || firstArg as () => T;

  setup(content);
  let ret = cb();

  // Teardown only when test is done (use promise for async)
  if (ret instanceof Promise) {
    return ret.then(
      (result) => {
        teardown();
        return result;
      },
      (err) => {
        teardown();
        throw err;
      }
    );
  }

  else {
    teardown();
    return ret;
  }
}

export default withBody;