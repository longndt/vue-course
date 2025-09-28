import { render, screen } from '@testing-library/vue';
import App from './App.vue';

test('renders learn vue text', () => {
  render(App);
  const linkElement = screen.getByText(/learn vue/i);
  expect(linkElement).toBeInTheDocument();
});
