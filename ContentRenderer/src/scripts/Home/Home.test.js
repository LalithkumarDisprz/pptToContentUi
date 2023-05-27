import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

describe('Home', () => {
  test('Template test must be rendered', () => {
    render(<Home />);
    const container = screen.getByText('Disprz Template');
    expect(container).toBeInTheDocument();
  });
});
