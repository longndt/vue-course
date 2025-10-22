<template>
  <div class="container">
    <h1>User Management</h1>

    <button @click="isModalOpen = true" class="button">
      Add User
    </button>

    <DataTable
      :data="users"
      :columns="columns"
    />

    <Modal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      title="Add New User"
    >
      <Form
        :fields="formFields"
        :initial-values="initialFormValues"
        @submit="handleAddUser"
        submit-text="Add User"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from './components/DataTable.vue';
import Form from './components/Form.vue';
import Modal from './components/Modal.vue';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

interface NewUserForm {
  name: string;
  email: string;
  role: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "User",
    status: "inactive",
  },
];

const users = ref<User[]>(mockUsers);
const isModalOpen = ref(false);

const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  {
    key: "status",
    header: "Status",
    render: (value: string) => `<span class="status ${value}">${value}</span>`,
  },
];

const formFields = [
  {
    name: "name",
    label: "Name",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    validate: (value: string) => {
      if (!value.includes("@")) {
        return "Please enter a valid email address";
      }
      return undefined;
    },
  },
  {
    name: "role",
    label: "Role",
    required: true,
  },
];

const initialFormValues = {
  name: "",
  email: "",
  role: "User",
};

const handleAddUser = async (values: NewUserForm) => {
  const newUser: User = {
    id: users.value.length + 1,
    name: values.name,
    email: values.email,
    role: values.role,
    status: "active",
  };

  users.value.push(newUser);
  isModalOpen.value = false;
};
</script>