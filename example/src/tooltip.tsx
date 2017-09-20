require('./tooltip.css');
import * as React from 'react';
import tooltip from 'react-append/tooltip';

export default tooltip<React.HTMLAttributes<HTMLSpanElement>>({
  inline: ({ children, ...props }) => <span {...props}>
    { children }
  </span>,
  append: props => <div className="tooltip">
    Hello world. I am a tooltip.
  </div>
});