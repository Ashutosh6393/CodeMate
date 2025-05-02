export const useDebounce = (
  callback: (...args: any[]) => void,
  delay: number
) => {
  let timeout: NodeJS.Timeout | null = null;
  const debouncedFunction = (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFunction;
};
