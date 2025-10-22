import { ref, onMounted, onUnmounted, watch, type Ref } from "vue";

interface UseFetchOptions {
  headers?: HeadersInit;
  dependencies?: Ref<any>[];
}

interface UseFetchResult<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  refetch: () => void;
}

export function useFetch<T>(
  url: string | Ref<string>,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref<boolean>(true);
  const refetchTrigger = ref<number>(0);

  const { headers = {}, dependencies = [] } = options;

  let abortController: AbortController | null = null;

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
    } catch (err: any) {
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

interface UseLocalStorageResult<T> {
  storedValue: Ref<T>;
  setValue: (value: T | ((val: T) => T)) => void;
  removeValue: () => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageResult<T> {
  const getInitialValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  const storedValue = ref<T>(getInitialValue());

  const setValue = (value: T | ((val: T) => T)) => {
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
  watch(storedValue, (newValue: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  }, { deep: true });

  return { storedValue, setValue, removeValue };
}

export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debouncedValue = ref<T>(value.value);

  watch(value, (newValue: T) => {
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
