import { ProviderConfig } from '../..';
import detectCircularDependencies from './';
const MockProvider = jest.fn() as any as JSX.Element;

describe('detectCircularDependencies', () => {
  const createProvider = (
    name: string,
    dependencies: string[] = [],
  ): ProviderConfig => ({
    name,
    dependencies,
    C: () => MockProvider,
  });

  test('does not throw an error for providers with no dependencies', () => {
    const providers = [
      createProvider('A'),
      createProvider('B'),
      createProvider('C'),
    ];

    expect(() => detectCircularDependencies(providers)).not.toThrow();
  });

  test('does not throw an error for valid dependencies', () => {
    const providers = [
      createProvider('A', ['B']),
      createProvider('B', ['C']),
      createProvider('C'),
    ];

    expect(() => detectCircularDependencies(providers)).not.toThrow();
  });

  test('throws an error for a circular dependency', () => {
    const providers = [
      createProvider('A', ['B']),
      createProvider('B', ['C']),
      createProvider('C', ['A']),
    ];

    expect(() => detectCircularDependencies(providers)).toThrowError(
      'Circular dependency detected involving "A"',
    );
  });

  test('throws an error for a self-dependency', () => {
    const providers = [createProvider('A', ['A'])];

    expect(() => detectCircularDependencies(providers)).toThrowError(
      'Circular dependency detected involving "A"',
    );
  });

  test('throws an error for a complex circular dependency', () => {
    const providers = [
      createProvider('A', ['B']),
      createProvider('B', ['C']),
      createProvider('C', ['D']),
      createProvider('D', ['A']),
    ];

    expect(() => detectCircularDependencies(providers)).toThrowError(
      'Circular dependency detected involving "A"',
    );
  });

  test('does not throw an error for independent providers', () => {
    const providers = [
      createProvider('A', ['B']),
      createProvider('B', []),
      createProvider('C', []),
      createProvider('D', ['C']),
    ];

    expect(() => detectCircularDependencies(providers)).not.toThrow();
  });
});
