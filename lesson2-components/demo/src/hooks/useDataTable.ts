import { ref, computed, type Ref } from 'vue';
import type {
  UseDataTableSortResult,
  UseDataTableFilterResult,
  SortConfig,
} from "../types/DataTable.types";

/**
 * Vue composable to handle sorting functionality in DataTable
 */
export function useDataTableSort<T extends Record<string, any>>(
  data: Ref<T[]>,
  sortable: boolean = true
): UseDataTableSortResult<T> {
  const sortConfig = ref<SortConfig<T> | null>(null);

  const requestSort = (key: keyof T) => {
    if (!sortable) return;

    const current = sortConfig.value;
    if (!current || current.key !== key) {
      sortConfig.value = { key, direction: "asc" };
    } else if (current.direction === "asc") {
      sortConfig.value = { key, direction: "desc" };
    } else {
      sortConfig.value = null;
    }
  };

  const sortedData = computed(() => {
    if (!sortConfig.value) return data.value;

    return [...data.value].sort((a, b) => {
      const config = sortConfig.value!;
      if (a[config.key] < b[config.key]) {
        return config.direction === "asc" ? -1 : 1;
      }
      if (a[config.key] > b[config.key]) {
        return config.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  });

  return { sortConfig, requestSort, sortedData };
}

/**
 * Vue composable to handle filtering functionality in DataTable
 */
export function useDataTableFilter<T extends Record<string, any>>(
  data: Ref<T[]>
): UseDataTableFilterResult<T> {
  const filterText = ref<string>("");

  const filteredData = computed(() => {
    if (!filterText.value) return data.value;

    return data.value.filter((item: T) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(filterText.value.toLowerCase())
      )
    );
  });

  const setFilterText = (value: string) => {
    filterText.value = value;
  };

  return {
    filterText,
    setFilterText,
    filteredData,
  };
}
