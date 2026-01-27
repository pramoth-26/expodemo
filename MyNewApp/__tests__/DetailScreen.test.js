import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import DetailScreen from '../src/screens/DetailScreen';

// ✅ Mock Theme Context
jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: { dark: false },
    toggleTheme: jest.fn(),
  }),
  useStyles: () => ({
    container: {},
    header: {},
    heading1: {},
    heading2: {},
    productImage: {},
    productPrice: {},
    body: {},
    primaryButton: {},
  }),
}));

// ✅ Mock Loader Component
jest.mock('../src/components/Loader', () => {
  return () => null;
});

describe('DetailScreen', () => {
  const mockProduct = {
    title: 'iPhone 15',
    price: 80000,
    description: 'Latest Apple iPhone',
    thumbnail: 'https://test.com/image.png',
  };

  const mockRoute = {
    params: {
      product: mockProduct,
    },
  };

  const mockNavigation = {
    navigate: jest.fn(),
  };

  it('renders product details after loading', async () => {
    const { getByText } = render(
      <DetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    // ⏳ Wait for loader timeout (1 second in component)
    await waitFor(() => {
      expect(getByText('Product Detail')).toBeTruthy();
      expect(getByText('iPhone 15')).toBeTruthy();
      expect(getByText('₹ 80000')).toBeTruthy();
      expect(getByText('Latest Apple iPhone')).toBeTruthy();
    });
  });
});
