import { ref, computed } from 'vue';

/**
 * Composable to handle sorting functionality in DataTable
 */
export function useDataTableSort(data, sortable = true) {
  const sortConfig = ref(null);

  const requestSort = (key) => {
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
      const aVal = a[sortConfig.value.key];
      const bVal = b[sortConfig.value.key];

      if (aVal < bVal) {
        return sortConfig.value.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.value.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  });

  return { sortConfig, requestSort, sortedData };
}

/**
 * Composable to handle filtering functionality in DataTable
 */
export function useDataTableFilter(data) {
  const filterText = ref("");

  const filteredData = computed(() => {
    if (!filterText.value) return data.value;

    const searchTerm = filterText.value.toLowerCase();
    return data.value.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      )
    );
  });

  return {
    filterText,
    setFilterText: (text) => {
      filterText.value = text;
    },
    filteredData,
  };
}
