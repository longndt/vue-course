import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import DataTable from "../DataTable.vue";

describe("DataTable", () => {
  const mockData = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Doe", email: "jane@example.com" },
  ];

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
  ];

  const createWrapper = (props = {}) => {
    return mount(DataTable, {
      props: {
        data: mockData,
        columns,
        ...props,
      },
    });
  };

  it("renders all columns and rows", () => {
    const wrapper = createWrapper();

    // Check headers
    columns.forEach((column) => {
      expect(wrapper.text()).toContain(column.header);
    });

    // Check data
    mockData.forEach((item) => {
      expect(wrapper.text()).toContain(item.name);
      expect(wrapper.text()).toContain(item.email);
    });
  });

  it("handles sorting when clicking column headers", async () => {
    const wrapper = createWrapper();

    const nameHeader = wrapper.find('th').filter((th) =>
      th.text().includes('Name')
    );

    // First click - sort ascending
    await nameHeader.trigger('click');

    // Check if sort indicator is visible
    expect(wrapper.text()).toContain('↑');

    // Second click - sort descending
    await nameHeader.trigger('click');
    expect(wrapper.text()).toContain('↓');
  });

  it("filters data based on input", async () => {
    const wrapper = createWrapper();

    const filterInput = wrapper.find('input[aria-label="Filter table"]');
    await filterInput.setValue('John');

    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).not.toContain("Jane Doe");
  });

  it("renders custom cell content using render function", () => {
    const customColumns = [
      ...columns,
      {
        key: "id",
        header: "Actions",
        render: (value) => `<button>Edit ${value}</button>`,
      },
    ];

    const wrapper = createWrapper({ columns: customColumns });

    expect(wrapper.html()).toContain("Edit 1");
    expect(wrapper.html()).toContain("Edit 2");
  });

  it("shows no data message when filtered data is empty", async () => {
    const wrapper = createWrapper();

    const filterInput = wrapper.find('input[aria-label="Filter table"]');
    await filterInput.setValue('xyz');

    expect(wrapper.text()).toContain("No data available");
  });

  it("disables sorting for specific columns", async () => {
    const columnsWithDisabledSort = [
      { key: "name", header: "Name", sortable: false },
      { key: "email", header: "Email" },
    ];

    const wrapper = createWrapper({ columns: columnsWithDisabledSort });

    const nameHeader = wrapper.find('th').filter((th) =>
      th.text().includes('Name')
    );
    const emailHeader = wrapper.find('th').filter((th) =>
      th.text().includes('Email')
    );

    // Name header should not be sortable
    expect(nameHeader.classes()).not.toContain('sortable');

    // Email header should be sortable
    expect(emailHeader.classes()).toContain('sortable');
  });

  it("disables filtering when filterable is false", () => {
    const wrapper = createWrapper({ filterable: false });

    const filterInput = wrapper.find('input[aria-label="Filter table"]');
    expect(filterInput.exists()).toBe(false);
  });
});
