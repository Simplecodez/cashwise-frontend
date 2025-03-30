import { useState, useEffect, useRef } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Store the initial state
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  // Store a ref of the current value to avoid unnecessary writes
  const prevValueRef = useRef(storedValue);

  useEffect(() => {
    // Prevent unnecessary updates if the value hasn't changed
    if (prevValueRef.current !== storedValue) {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue));
        prevValueRef.current = storedValue; // Update ref to latest value
      } catch (error) {
        console.error('Error saving to localStorage key:', key, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;
