import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/actions';

export const useStorage = (key) => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        const result = await new Promise((resolve) => {
          chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
          });
        });
        setValue(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  // Listen for changes
  useEffect(() => {
    const handleChange = (changes, namespace) => {
      if (namespace !== 'local') return;
      if (changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, [key]);

  // Update value
  const updateValue = useCallback(async (newValue) => {
    try {
      await new Promise((resolve) => {
        chrome.storage.local.set({ [key]: newValue }, resolve);
      });
      setValue(newValue);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [key]);

  return { value, loading, error, updateValue };
};

// Preset hooks for common storage operations
export const useSettings = () => useStorage(STORAGE_KEYS.SETTINGS);
export const useUser = () => useStorage(STORAGE_KEYS.USER); 