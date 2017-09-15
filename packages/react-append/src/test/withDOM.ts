/*
  Set up a (new) JSDOM for testing
*/
import { JSDOM } from 'jsdom';

/*
  TypeScript is treating this as browser code, but we're running our unit
  tests in Node, so need to declare global object.
*/
declare var global: any;

const setupDOM = () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = { userAgent: 'node.js' };
  global.location = dom.window.location;
  global.Event = (dom.window as any).Event;
  global.requestAnimationFrame =
    (dom.window.requestAnimationFrame as any) =
    (fn: () => void) => setTimeout(fn, 1000 / 60);
};

const withDOM = (cb: () => void) => {
  setupDOM();
  cb();
};

export default withDOM;