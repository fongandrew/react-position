React Append
==============
[![Build Status](https://travis-ci.org/esperco/react-append.svg?branch=master)](https://travis-ci.org/esperco/react-append)

Sometimes it's helpful to have React components live in one part of an
element tree but render to a part of the DOM that normally doesn't correspond
to the DOM to get around z-indexing issues, etc. For instance, suppose we
have  a single dropdown component that contains both the toggle and menu.
We want the toggle to render inline with other content but the menu to render
at the very end of our content to get around z-indexing weirdness and the like.

[`react-append`](packages/react-append) is a higher-order-component that
renders (and update) a component that lives at the end of the body, rather
than in a more nested spot in your DOM.

Work in progress: Sub-packages for dropdowns, tooltips, etc. that use
`react-append`
