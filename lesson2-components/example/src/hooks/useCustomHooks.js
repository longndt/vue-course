import { ref, onMounted, onUnmounted, watch } from "vue";

export function useFetch(url, options = {}) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);
  const refetchTrigger = ref(0);

  const { headers = {}, dependencies = [] } = options;

  let abortController = null;

  const fetchData = async () => {
    abortController?.abort();
    abortController = new AbortController();

    try {
      loading.value = true;
      error.value = null;

      const urlValue = typeof url === 'string' ? url : url.value;
      const response = await fetch(urlValue, {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      data.value = json;
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
  };

  const refetch = () => {
    refetchTrigger.value += 1;
  };

  // Watch for URL changes
  if (typeof url !== 'string') {
    watch(url, fetchData, { immediate: true });
  } else {
    onMounted(fetchData);
  }

  // Watch dependencies
  if (dependencies.length > 0) {
    watch([refetchTrigger, ...dependencies], fetchData);
  } else {
    watch(refetchTrigger, fetchData);
  }

  onUnmounted(() => {
    abortController?.abort();
  });

  return { data, error, loading, refetch };
}

export function useLocalStorage(key, initialValue) {
  const getInitialValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  const storedValue = ref(getInitialValue());

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue.value) : value;
      storedValue.value = valueToStore;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      storedValue.value = initialValue;
    } catch (error) {
      console.error(error);
    }
  };

  // Watch for changes to sync with localStorage
  watch(storedValue, (newValue) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  }, { deep: true });

  return { storedValue, setValue, removeValue };
}

export function useDebounce(value, delay) {
  const debouncedValue = ref(value.value);

  watch(value, (newValue) => {
    const handler = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);

    // Clear timeout on next change
    return () => {
      clearTimeout(handler);
    };
  });

  return debouncedValue;
}
