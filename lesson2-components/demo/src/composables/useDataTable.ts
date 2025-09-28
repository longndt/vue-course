import { ref, computed, type Ref } from 'vue';
import type { SortConfig } from '../types/DataTable.types';

/**
 * Composable to handle sorting functionality in DataTable
 */
export function useDataTableSort<T extends Record<string, any>>(
  data: Ref<T[]>,
  sortable: boolean = true
) {
  const sortConfig = ref<SortConfig<T> | null>(null);

  const requestSort = (key: keyof T) => {
    if (!sortable) return;

    if (!sortConfig.value || sortConfig.value.key !== key) {
      sortConfig.value = { key, direction: "asc" };
    } else if (sortConfig.value.direction === "asc") {
      sortConfig.value = { key, direction: "desc" };
    } else {
      sortConfig.value = null;
    }
  };

  const sortedData = computed(() => {
    if (!sortConfig.value) return data.value;

    return [...data.value].sort((a, b) => {
      const aVal = a[sortConfig.value!.key];
      const bVal = b[sortConfig.value!.key];

      if (aVal < bVal) {
        return sortConfig.value!.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.value!.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  });

  return { sortConfig, requestSort, sortedData };
}

/**
 * Composable to handle filtering functionality in DataTable
 */
export function useDataTableFilter<T extends Record<string, any>>(
  data: Ref<T[]>
) {
  const filterText = ref<string>("");

  const filteredData = computed(() => {
    if (!filterText.value) return data.value;

    const searchTerm = filterText.value.toLowerCase();
    return data.value.filter((item: T) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      )
    );
  });

  return {
    filterText,
    setFilterText: (text: string) => {
      filterText.value = text;
    },
    filteredData,
  };
}