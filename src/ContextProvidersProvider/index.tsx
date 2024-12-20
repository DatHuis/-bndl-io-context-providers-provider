import React, { ReactNode } from 'react';
import sortProviders from './utils/sortProviders';
import detectCircularDependencies from './utils/detectCircularDependencies';

/**
 * Configuration for a context provider.
 *
 * @typedef {Object} ProviderConfig
 * @property {string} name - The name of the provider.
 * @property {(children: ReactNode) => JSX.Element} C - The provider component.
 * @property {string[]} dependencies - The names of the providers that this provider depends on.
 */
export type ProviderConfig = {
  name: string;
  C: (children: ReactNode) => JSX.Element;
  dependencies: string[];
};

export type ContextProvidersProviderProps = {
  providers: ProviderConfig[];
  children?: ReactNode;
};

/**
 * A component that provides context providers in a sorted order based on their dependencies.
 *
 * @param {ContextProvidersProviderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ContextProvidersProvider: React.FC<ContextProvidersProviderProps> = ({
  providers,
  children,
}) => {
  detectCircularDependencies(providers);
  const sortedProviders = sortProviders(providers);

  /**
   * Recursively renders the providers in the correct order.
   *
   * @param {number} index - The current index of the provider to render.
   * @returns {JSX.Element} The rendered providers.
   */
  const renderProviders = (index: number): JSX.Element => {
    if (index >= sortedProviders.length) return <>{children}</>;

    const { C } = sortedProviders[index];
    return C(renderProviders(index + 1));
  };

  return renderProviders(0);
};

export default ContextProvidersProvider;
