// Helper types
import * as React from 'react';

/*
  Helper function to manage type discrepancies between React.ReactNode and
  the expected return type of a render funciton.
*/
export const toElement = function(
  node: React.ReactNode
): string|number|false|React.ReactElement<any>|React.ReactElement<any>[]|null {
  if (node === void 0) return null;
  if (node === true) throw new Error('Node should not be true');
  if (typeof node === 'object') return node as React.ReactElement<any>;
  return node;
};
