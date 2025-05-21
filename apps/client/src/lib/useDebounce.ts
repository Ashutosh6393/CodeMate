export const useDebounce = (
  callback: (...args: string[]) => void,
  delay: number,
) => {
  let timeout: NodeJS.Timeout | null = null;
  const debouncedFunction = (...args: string[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFunction;
};
