import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const debounceTimer: number = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay)
    return () => {
      window.clearTimeout(debounceTimer);
    }
  }, [value, delay])
  return debouncedValue;
}
