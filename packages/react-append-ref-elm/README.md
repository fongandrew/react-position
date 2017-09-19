React Append Reference Elements
===============================
Reference component to help absolutely positioning appended elements.

Usage
-----

Default export is an HOC similar to `react-append`'s. It takes an inline
component and a component to append to the end of the body.

This example below displays a popover message absolutely positioned 
a button.

```jsx
import refElm from 'react-append-ref-elm';

const Popover = refElm({
  inline: props => <button onClick={props.togglePopover}>
    Toggle Popover
  </button>,

  append: ({ RefDiv, ownProps }) => ownProps.popoverActive ?
    /* NB: We set height to 'auto' below to override the default height
       set on the RefDiv */
    <RefDiv style={{ transform: 'translateY(-100%)', height: 'auto' }}>
      <div class="popover">
        Hello World
      </div>
    </RefDiv> : 
    null
});
```

Inline component receives the same props that the newly created component
does. However, the appended component receives the following props instead:

* `RefDiv` - A div absolutely positioned exactly above the inline element.
  It has `position`, `top`, `left`, `height`, and `width` style properties set,
  but these can be easily overriden by setting your own style attribute
  on the `RefDiv` object (the style properties will be merged). `RefDiv`
  component also takes `id`, `className`, and any other property that would
  normally be applicable to a div element.

* `ownProps` - The same props passed to the component as a whole and to the
  inline component.

* `rect` - The results of
  [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
  for the inline element.

* `rectPct` - Same as `rect`, but scaled to a 0 - 1 percentage. Useful for
  adjusting element positioning relative to where it is on a screen.


Notes / Limitations
-------------------

The position of `RefDiv` is calculated at the time the `append` element
is rendered. Resizing your browser window or scrolling multiple nested
scrolling elements may result in the `RefDiv` being out of place.


