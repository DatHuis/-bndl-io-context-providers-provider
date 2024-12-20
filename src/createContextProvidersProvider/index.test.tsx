import React from 'react';
import { render, screen } from '@testing-library/react';
import createContextProvidersProvider from './';
import type { ContextProvidersProviderProps } from '../ContextProvidersProvider';

describe('createContextProvidersProvider', () => {
  const createMockProvider = (name: string, dependencies: string[] = []) => ({
    name,
    dependencies,
    C: (children: React.ReactNode) => (
      <div data-testid={`provider-${name}`}>{children}</div>
    ),
  });

  test('renders ContextProvidersProvider with children and nested providers', () => {
    const providers = [
      createMockProvider('Auth', ['Theme']),
      createMockProvider('Theme', []),
    ];

    const ContextWrapper = createContextProvidersProvider({ providers });

    render(
      <ContextWrapper>
        <div data-testid="child">Hello, World!</div>
      </ContextWrapper>,
    );

    // Ensure the providers are rendered in the correct order
    const themeProvider = screen.getByTestId('provider-Theme');
    const authProvider = screen.getByTestId('provider-Auth');
    const child = screen.getByTestId('child');

    expect(themeProvider).toContainElement(authProvider);
    expect(authProvider).toContainElement(child);
  });

  test('renders correctly with no providers', () => {
    const providers: ContextProvidersProviderProps['providers'] = [];

    const ContextWrapper = createContextProvidersProvider({ providers });

    render(
      <ContextWrapper>
        <div data-testid="child">Hello, World!</div>
      </ContextWrapper>,
    );

    // Ensure children are rendered directly without any providers
    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
  });

  test('handles providers with complex dependencies', () => {
    const providers = [
      createMockProvider('Auth', ['Theme']),
      createMockProvider('Theme', ['Config']),
      createMockProvider('Config', []),
    ];

    const ContextWrapper = createContextProvidersProvider({ providers });

    render(
      <ContextWrapper>
        <div data-testid="child">Hello, World!</div>
      </ContextWrapper>,
    );

    const configProvider = screen.getByTestId('provider-Config');
    const themeProvider = screen.getByTestId('provider-Theme');
    const authProvider = screen.getByTestId('provider-Auth');
    const child = screen.getByTestId('child');

    // Check proper nesting
    expect(configProvider).toContainElement(themeProvider);
    expect(themeProvider).toContainElement(authProvider);
    expect(authProvider).toContainElement(child);
  });

  test('throws an error when a provider has a circular dependency', () => {
    const providers = [
      createMockProvider('A', ['B']),
      createMockProvider('B', ['C']),
      createMockProvider('C', ['A']),
    ];

    const ContextWrapper = createContextProvidersProvider({ providers });

    expect(() =>
      render(
        <ContextWrapper>
          <div>Child</div>
        </ContextWrapper>,
      ),
    ).toThrowError(/Circular dependency detected/);
  });
});
