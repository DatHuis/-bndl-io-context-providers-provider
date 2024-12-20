import { ProviderConfig } from '../..';

/**
 * Detects circular dependencies among provider configurations.
 *
 * @param {ProviderConfig[]} providers - The array of provider configurations to check.
 * @throws Will throw an error if a circular dependency is detected.
 */
const detectCircularDependencies = (providers: ProviderConfig[]) => {
  const dependencyMap: Record<string, string[]> = {};

  providers.forEach(({ name, dependencies }) => {
    dependencyMap[name] = dependencies;
  });

  const visited = new Set<string>();
  const visiting = new Set<string>();

  /**
   * Visits a provider and its dependencies recursively to detect circular dependencies.
   *
   * @param {string} name - The name of the provider to visit.
   * @throws Will throw an error if a circular dependency is detected.
   */
  const visit = (name: string) => {
    if (visiting.has(name)) {
      throw new Error(`Circular dependency detected involving "${name}"`);
    }
    if (visited.has(name)) return;

    visiting.add(name);
    dependencyMap[name]?.forEach(visit);
    visiting.delete(name);
    visited.add(name);
  };

  Object.keys(dependencyMap).forEach(visit);
};

export default detectCircularDependencies;
