require('./dropdown.css');
import * as React from 'react';
import dropdown from 'react-append/lib/dropdown';

export default function(p: React.HTMLAttributes<HTMLSpanElement>) {
  let { children, ...props } = p;
  return dropdown({
    inline: props => <button {...props}>{ children }</button>,

    menu: ({ position, style }) =>
      <nav key="nav" style={style} className={`dropdown-menu ${position}`}>
        <div>
          Hello world. This is a dropdown menu.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </nav>,

    overlay: ({ style, close }) =>
      <div className="backdrop" style={style} onClick={close} />
  });
}
