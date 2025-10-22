<template>
  <div class="data-table-container">
    <div v-if="filterable" class="data-table-filter">
      <input
        v-model="filterText"
        type="text"
        placeholder="Filter items..."
        class="filter-input"
        aria-label="Filter table"
      />
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="String(column.key)"
            :class="{ sortable: sortable && column.sortable !== false }"
            :role="sortable && column.sortable !== false ? 'button' : undefined"
            :aria-sort="getSortAriaValue(column.key)"
            @click="handleSort(column)"
          >
            {{ column.header }}
            <span
              v-if="sortConfig?.key === column.key"
              class="sort-indicator"
              aria-hidden="true"
            >
              {{ sortConfig.direction === "asc" ? " ↑" : " ↓" }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredData.length === 0">
          <td :colspan="columns.length" class="no-data">
            No data available
          </td>
        </tr>
        <tr v-else v-for="(item, index) in filteredData" :key="index">
          <td v-for="column in columns" :key="String(column.key)">
            <span
              v-if="column.render"
              v-html="column.render(item[column.key])"
            />
            <span v-else>{{ String(item[column.key]) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch } from 'vue';
import type { DataTableColumn } from '../types/DataTable.types';
import './DataTable.css';

/**
 * A reusable data table component with sorting and filtering capabilities.
 * Supports:
 * - Sortable columns
 * - Global text filtering
 * - Custom cell rendering
 * - TypeScript integration
 *
 * @example
 * ```vue
 * <DataTable
 *   :data="users"
 *   :columns="[
 *     { key: 'name', header: 'Name' },
 *     { key: 'email', header: 'Email' },
 *     {
 *       key: 'status',
 *       header: 'Status',
 *       render: (value) => `<span class='status ${value}'>${value}</span>`
 *     }
 *   ]"
 * />
 * ```
 */

interface Props {
  data: T[];
  columns: DataTableColumn<T>[];
  sortable?: boolean;
  filterable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sortable: true,
  filterable: true,
});

// Reactive state
const filterText = ref('');
const sortConfig = ref<{
  key: keyof T;
  direction: 'asc' | 'desc';
} | null>(null);

// Computed values
const sortedData = computed(() => {
  if (!props.sortable || !sortConfig.value) {
    return props.data;
  }

  const { key, direction } = sortConfig.value;

  return [...props.data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
});

const filteredData = computed(() => {
  if (!props.filterable || !filterText.value) {
    return sortedData.value;
  }

  const searchTerm = filterText.value.toLowerCase();

  return sortedData.value.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm)
    )
  );
});

// Methods
const handleSort = (column: DataTableColumn<T>) => {
  if (!props.sortable || column.sortable === false) return;

  if (sortConfig.value?.key === column.key) {
    sortConfig.value.direction =
      sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortConfig.value = {
      key: column.key,
      direction: 'asc'
    };
  }
};

const getSortAriaValue = (columnKey: keyof T) => {
  if (sortConfig.value?.key === columnKey) {
    return sortConfig.value.direction === 'asc' ? 'ascending' : 'descending';
  }
  return undefined;
};
</script>