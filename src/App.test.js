import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders home page headline', async () => {
    render(<App />);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Welcome to the Stock Analysis Portal/i,
      })
    ).toBeInTheDocument();
  });
});
