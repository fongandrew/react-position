require('./tooltip.css');
import * as React from 'react';
import tooltip from 'react-append/lib/tooltip';

export default function(p: React.HTMLAttributes<HTMLSpanElement>) {
  let { children, ...props } = p;
  return tooltip({
    inline: props => <span {...props}>{ children }</span>,

    tip: vPos => <div className={`tooltip ${vPos}`}>
      Hello world. I am a tooltip.
    </div>,

    arrow: vPos => <div className={`tooltip-arrow ${vPos}`}>{' '}</div>
  });
}
