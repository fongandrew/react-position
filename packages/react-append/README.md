React Append
==============
[![Build Status](https://travis-ci.org/esperco/react-append.svg?branch=master)](https://travis-ci.org/esperco/react-append)

Sometimes it's helpful to have React components live in one part of an
element tree but render to a part of the DOM that normally doesn't correspond
to the DOM to get around z-indexing issues, etc. For instance, suppose we
have  a single dropdown component that contains both the toggle and menu.
We want the toggle to render inline with other content but the menu to render
at the very end of our content to get around z-indexing weirdness and the like.

`react-append` is a higher-order-component that renders (and update) a
component that lives at the end of the body, rather than in a more nested
spot in your DOM.

Usage
-----

Suppose our HTML page looks like this.

```html
<html>
<body>
  <div id="container"></div>
</body>
</html>
```

We then create this component and mount it.

```jsx
import append from 'react-append';
import ReactDOM from 'react-dom';

const EvilTwin = append({

  // Can specify an ID to ensure that appended component replaces
  // prior appended component with same ID
  id: props => props.name,

  // Component that appears where React component is mounted
  inline: props => <div className="inline">
    Hello, I am { props.name }. I appear inline.
  </div>,

  // Component that appears at end of body
  append: props => <div className="at-the-end">
    Hello, I am { props.name }'s evil twin.
    I get appended to the very end of the body.
  </div>
});

const MyApp = () => <div className="my-app">
  <EvilTwin name="Bob">
</div>

ReactDOM.render(
  <MyApp />, 
  document.getElementById('container')
);
```

This result in our DOM looking like this:

```html
<html>
<body>
  <div id="container">
    <div className="my-app">
      <div className="inline">
        Hello, I am Bob. I appear inline.
      </div>
    </div>
  </div>
  <div id="bob">
    <div className="at-the-end">
      Hello, I am Bob's evil twin.
      I get appended to the very end of the body.
    </div>
  </div>
</body>
</html>
```

The component creacted with `append` will update both its inline and appended
components when its own props change.