import { ref, computed } from 'vue';

/**
 * Vue composable to handle sorting functionality in DataTable
 */
export function useDataTableSort(data, sortable = true) {
  const sortConfig = ref(null);

  const requestSort = (key) => {
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
      const config = sortConfig.value;
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
export function useDataTableFilter(data) {
  const filterText = ref("");

  const filteredData = computed(() => {
    if (!filterText.value) return data.value;

    return data.value.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(filterText.value.toLowerCase())
      )
    );
  });

  const setFilterText = (value) => {
    filterText.value = value;
  };

  return {
    filterText,
    setFilterText,
    filteredData,
  };
}
