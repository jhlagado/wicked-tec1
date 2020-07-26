import { Thunk } from '../types';

export const throttle = (thunk: Thunk, limit: number, latest?: boolean) => {
  let wait = false;
  return () => {
    if (!wait) {
      if (!latest) thunk();
      wait = true;
      setTimeout(() => {
        wait = false;
        if (latest) thunk();
      }, limit);
    }
  };
};

export const debounce = (thunk: Thunk, limit: number) => {
  let inDebounce = 0;
  return () => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => thunk(), limit);
  };
};
