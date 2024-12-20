// ContextProvidersProvider.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import ContextProvidersProvider, { type ProviderConfig } from './';

describe('ContextProvidersProvider', () => {
  const createProvider = (
    name: string,
    dependencies: string[] = [],
    output: string = name,
  ): ProviderConfig => {
    return {
      name,
      dependencies,
      C: (children: React.ReactNode) => (
        <div data-testid={`provider-${name}`}>
          {output}
          {children}
        </div>
      ),
    };
  };

  test('renders providers in the correct order based on dependencies', () => {
    const providers: ProviderConfig[] = [
      createProvider('A', ['B']),
      createProvider('B', ['C']),
      createProvider('C'),
    ];

    render(
      <ContextProvidersProvider providers={providers}>
        <div data-testid="child">Child Content</div>
      </ContextProvidersProvider>,
    );

    const providerA = screen.getByTestId('provider-A');
    const providerB = screen.getByTestId('provider-B');
    const providerC = screen.getByTestId('provider-C');
    const child = screen.getByTestId('child');

    expect(providerC).toContainElement(providerB);
    expect(providerB).toContainElement(providerA);
    expect(providerA).toContainElement(child);
  });

  test('detects circular dependencies and throws an error', () => {
    const providers: ProviderConfig[] = [
      createProvider('A', ['B']),
      createProvider('B', ['A']),
    ];

    expect(() =>
      render(
        <ContextProvidersProvider providers={providers}>
          <div>Child Content</div>
        </ContextProvidersProvider>,
      ),
    ).toThrowError(/Circular dependency detected involving "A"/);
  });

  test('throws an error when a provider depends on an unknown provider', () => {
    const providers: ProviderConfig[] = [
      createProvider('A', ['UnknownProvider']),
    ];

    expect(() =>
      render(
        <ContextProvidersProvider providers={providers}>
          <div>Child Content</div>
        </ContextProvidersProvider>,
      ),
    ).toThrowError(
      /Provider "A" depends on unknown provider "UnknownProvider"/,
    );
  });

  test('renders children correctly when there are no providers', () => {
    const providers: ProviderConfig[] = [];

    render(
      <ContextProvidersProvider providers={providers}>
        <div data-testid="child">Child Content</div>
      </ContextProvidersProvider>,
    );

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
  });

  test('handles providers with no dependencies', () => {
    const providers: ProviderConfig[] = [
      createProvider('A'),
      createProvider('B'),
      createProvider('C'),
    ];

    render(
      <ContextProvidersProvider providers={providers}>
        <div data-testid="child">Child Content</div>
      </ContextProvidersProvider>,
    );

    const providerA = screen.getByTestId('provider-A');
    const providerB = screen.getByTestId('provider-B');
    const providerC = screen.getByTestId('provider-C');
    const child = screen.getByTestId('child');

    // Since there are no dependencies, the order should be as provided
    expect(providerA).toContainElement(providerB);
    expect(providerB).toContainElement(providerC);
    expect(providerC).toContainElement(child);
  });

  test('renders providers with complex dependencies', () => {
    const providers: ProviderConfig[] = [
      createProvider('Auth', ['Theme']),
      createProvider('Theme', ['Config']),
      createProvider('Config'),
    ];

    render(
      <ContextProvidersProvider providers={providers}>
        <div data-testid="child">Child Content</div>
      </ContextProvidersProvider>,
    );

    const providerConfig = screen.getByTestId('provider-Config');
    const providerTheme = screen.getByTestId('provider-Theme');
    const providerAuth = screen.getByTestId('provider-Auth');
    const child = screen.getByTestId('child');

    expect(providerConfig).toContainElement(providerTheme);
    expect(providerTheme).toContainElement(providerAuth);
    expect(providerAuth).toContainElement(child);
  });
});
