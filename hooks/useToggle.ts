/**
 * Custom Hook: useToggle
 * Provides toggle functionality with multiple control methods
 */

import { useState, useCallback } from 'react';

interface UseToggleReturn {
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export const useToggle = (
  initialValue = false
): [boolean, UseToggleReturn] => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, setTrue, setFalse }];
};


