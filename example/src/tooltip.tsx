require('./tooltip.css');
import * as React from 'react';
import tooltip from 'react-append/lib/tooltip';

export default function(p: React.HTMLAttributes<HTMLSpanElement>) {
  let { children, ...props } = p;
  return tooltip({
    inline: props => <span {...props}>{ children }</span>,

    tooltip: pos => <div className={`tooltip ${pos}`}>
      Hello world. I am a tooltip.
    </div>,

    arrow: pos => <div className={`tooltip-arrow ${pos}`}>{' '}</div>
  });
}
