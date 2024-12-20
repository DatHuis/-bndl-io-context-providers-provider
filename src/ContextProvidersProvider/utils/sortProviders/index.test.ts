import { ProviderConfig } from '../..';
import sortProviders from './';

describe('sortProviders', () => {
  const createProvider = (
    name: string,
    dependencies: string[] = [],
  ): ProviderConfig => ({
    name,
    C: jest.fn(),
    dependencies,
  });

  test('sorts providers with no dependencies', () => {
    const providers = [
      createProvider('A'),
      createProvider('B'),
      createProvider('C'),
    ];

    const sorted = sortProviders(providers);

    // The order should remain the same as there are no dependencies
    expect(sorted.map(p => p.name)).toEqual(['A', 'B', 'C']);
  });

  test('sorts providers with simple dependencies', () => {
    const providers = [
      createProvider('A', ['B']),
      createProvider('B', ['C']),
      createProvider('C'),
    ];

    const sorted = sortProviders(providers);

    // Providers should be ordered based on their dependencies
    expect(sorted.map(p => p.name)).toEqual(['C', 'B', 'A']);
  });

  test('sorts providers with complex dependencies', () => {
    const providers = [
      createProvider('Auth', ['Theme']),
      createProvider('Theme', ['Config']),
      createProvider('Config'),
      createProvider('Analytics', ['Config']),
    ];

    const sorted = sortProviders(providers);

    // Config should come first, followed by Theme and Analytics, then Auth
    expect(sorted.map(p => p.name)).toEqual([
      'Config',
      'Theme',
      'Auth',
      'Analytics',
    ]);
  });

  test('throws an error for unknown dependencies', () => {
    const providers = [
      createProvider('A', ['B']),
      createProvider('B', ['Unknown']),
    ];

    expect(() => sortProviders(providers)).toThrowError(
      'Provider "B" depends on unknown provider "Unknown"',
    );
  });

  test('throws an error for circular dependencies', () => {
    const providers = [
      createProvider('A', ['B']),
      createProvider('B', ['C']),
      createProvider('C', ['A']),
    ];

    expect(() => sortProviders(providers)).toThrowError(
      'Circular dependency detected involving "A"',
    );
  });

  test('handles providers with no dependencies interleaved', () => {
    const providers = [
      createProvider('A', ['C']),
      createProvider('B'),
      createProvider('C'),
    ];

    const sorted = sortProviders(providers);

    // C must come before A due to the dependency, B can appear anywhere
    expect(sorted.map(p => p.name)).toEqual(['C', 'A', 'B']);
  });
});
