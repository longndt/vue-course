# Vue 3 Components Demo

This demo project showcases various reusable Vue 3 components built with TypeScript. It demonstrates important Vue 3 patterns and best practices using the Composition API.

## Components Showcased

### 1. DataTable

A flexible and reusable table component that supports:

- Sorting
- Filtering
- Custom cell rendering
- TypeScript integration
- Accessibility features

### 2. Form

A reusable form component with:

- Validation
- Error handling
- TypeScript support
- Accessibility features

### 3. Modal

A modal component featuring:

- Teleport for proper DOM placement
- Focus management
- Keyboard navigation
- TypeScript integration

## Features Demonstrated

- **Vue 3 Composition API**: Modern Vue 3 patterns
- **TypeScript**: Full type safety
- **Composables**: Reusable logic with `useDataTable`
- **Provide/Inject**: Theme management
- **Teleport**: Modal rendering
- **Error Boundaries**: Error handling with `onErrorCaptured`
- **Testing**: Unit tests with Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Project Structure

```
src/
├── components/          # Vue components
│   ├── DataTable.vue   # Reusable table component
│   ├── Form.vue        # Form component
│   └── Modal.vue       # Modal component
├── composables/        # Reusable composables
│   └── useDataTable.ts # Data table logic
├── hooks/             # Custom hooks
├── types/             # TypeScript type definitions
└── main.ts            # Application entry point
```

## Key Learning Points

### 1. Component Composition

Learn how to build complex components by composing smaller, reusable pieces.

### 2. TypeScript Integration

See how TypeScript enhances Vue 3 development with better IDE support and type safety.

### 3. Composables Pattern

Understand how to extract and reuse component logic using Vue 3's composables.

### 4. Advanced Vue 3 Features

Explore Teleport, Provide/Inject, and error handling patterns.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint

### Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking
- **Vitest** for testing

## Next Steps

After exploring this demo:

1. Try modifying the components
2. Add new features
3. Experiment with different patterns
4. Check out the lab exercises in `../lab/`

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)