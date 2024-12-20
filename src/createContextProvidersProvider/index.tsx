import React from 'react';
import ContextProvidersProvider, {
  ContextProvidersProviderProps,
} from '../ContextProvidersProvider';

/**
 * Creates a ContextProvidersProvider component with the given providers.
 *
 * @param {ContextProvidersProviderProps} props - The props for the ContextProvidersProvider.
 * @returns {React.FC<{ children?: React.ReactNode }>} A functional component that wraps its children with the ContextProvidersProvider.
 */
const createContextProvidersProvider =
  ({
    providers,
  }: ContextProvidersProviderProps): React.FC<{ children?: React.ReactNode }> =>
  ({ children }) =>
    (
      <ContextProvidersProvider providers={providers}>
        {children}
      </ContextProvidersProvider>
    );

export default createContextProvidersProvider;
