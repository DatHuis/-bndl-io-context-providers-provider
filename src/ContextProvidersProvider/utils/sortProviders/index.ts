import { ProviderConfig } from '../..';

/**
 * Sorts an array of provider configurations based on their dependencies.
 * Throws an error if a circular dependency is detected or if a dependency is missing.
 *
 * @param {ProviderConfig[]} providers - The array of provider configurations to sort.
 * @returns {ProviderConfig[]} - The sorted array of provider configurations.
 */
const sortProviders = (providers: ProviderConfig[]): ProviderConfig[] => {
  const sorted: ProviderConfig[] = [];
  const visited: Set<string> = new Set();
  const visiting: Set<string> = new Set();

  const visit = (provider: ProviderConfig) => {
    if (visiting.has(provider.name)) {
      throw new Error(
        `Circular dependency detected involving "${provider.name}"`,
      );
    }
    if (visited.has(provider.name)) {
      return;
    }

    visiting.add(provider.name);

    provider.dependencies.forEach(depName => {
      const dep = providers.find(p => p.name === depName);
      if (!dep) {
        throw new Error(
          `Provider "${provider.name}" depends on unknown provider "${depName}"`,
        );
      }
      visit(dep);
    });

    visiting.delete(provider.name);
    visited.add(provider.name);
    sorted.push(provider);
  };

  providers.forEach(provider => {
    if (!visited.has(provider.name)) {
      visit(provider);
    }
  });

  return sorted;
};

export default sortProviders;
