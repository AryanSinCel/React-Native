/**
 * Custom Hook: usePrevious
 * Returns the previous value of a state or prop
 */

import { useRef, useEffect } from 'react';

export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};


