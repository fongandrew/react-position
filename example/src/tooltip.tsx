require('./tooltip.css');
import * as React from 'react';
import tooltip from 'react-append/lib/tooltip';

export default function(p: React.HTMLAttributes<HTMLSpanElement>) {
  let { children, ...props } = p;
  return tooltip({
    inline: props => <span {...props}>{ children }</span>,

    tip: ({ position, style }) =>
      <div style={style} className={`tooltip ${position}`}>
        Hello world. I am a tooltip.
      </div>,

    arrow: ({ position, style }) =>
      <div style={style} className="tooltip-arrow-container">
        <div className={`tooltip-arrow ${position}`}>{' '}</div>
      </div>
  });
}
