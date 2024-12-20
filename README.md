# @bndl-io/context-providers-provider

A React utility component for managing complex context dependencies. Automatically sorts and nests context providers based on dependencies, promoting clean and maintainable patterns for context usage.

## Why?

React applications often rely on multiple context providers to manage state, theming, authentication, and more. However, managing these providers can quickly lead to deeply nested and unmanageable component trees, especially when providers depend on one another.

### Common Problems:

1. **Context Hell**: Wrapping components in multiple layers of context providers makes the tree hard to read and maintain.
2. **Dependency Issues**: Incorrect nesting of providers can lead to runtime errors or unexpected behavior.
3. **Encapsulation**: Logic for initializing context values often leaks outside of dedicated components, making the code harder to reuse or test.

### How `@bndl-io/context-providers-provider` Solves This:

- Automatically **sorts providers** based on their dependencies.
- Detects **circular dependencies** and throws helpful error messages.
- Encourages encapsulation by requiring all context logic to reside in dedicated `ProviderComponents`.
- Simplifies application structure by managing provider nesting for you.

---

## Installation

Install the library via npm:

```bash
npm install @bndl-io/context-providers-provider
```

or with yarn:

```bash
yarn add @bndl-io/context-providers-provider
```

---

## Usage

### Define Your Providers

Each provider is defined as an object with the following structure:

```ts
type ProviderConfig = {
  name: string;
  C: (children: ReactNode) => JSX.Element; // The provider component
  dependencies: string[]; // Names of other providers this provider depends on
};
```

For example:

```tsx
const providers = [
  {
    name: 'Auth',
    C: children => <AuthProvider>{children}</AuthProvider>,
    dependencies: ['Theme'], // Auth depends on Theme
  },
  {
    name: 'Theme',
    C: children => <ThemeProvider>{children}</ThemeProvider>,
    dependencies: [], // No dependencies
  },
  {
    name: 'Config',
    C: children => <ConfigProvider>{children}</ConfigProvider>,
    dependencies: ['Auth'], // Config depends on Auth
  },
];
```

---

### Wrap Your Application

Use the `ContextProvidersProvider` to automatically sort and nest providers based on their dependencies:

```tsx
import React from 'react';
import ContextProvidersProvider from '@bndl-io/context-providers-provider';

const providers = [
  {
    name: 'Auth',
    C: children => <AuthProvider>{children}</AuthProvider>,
    dependencies: ['Theme'],
  },
  {
    name: 'Theme',
    C: children => <ThemeProvider>{children}</ThemeProvider>,
    dependencies: [],
  },
  {
    name: 'Config',
    C: children => <ConfigProvider>{children}</ConfigProvider>,
    dependencies: ['Auth'],
  },
];

const App = () => {
  return (
    <ContextProvidersProvider providers={providers}>
      <YourApp />
    </ContextProvidersProvider>
  );
};
```

---

### Example Output

The above setup would result in the following provider tree:

```tsx
<ThemeProvider>
  <AuthProvider>
    <ConfigProvider>
      <YourApp />
    </ConfigProvider>
  </AuthProvider>
</ThemeProvider>
```

---

## API

### `ContextProvidersProvider`

#### Props:

- `providers`: An array of `ProviderConfig` objects. Each config must include:
  - `name`: A unique string identifying the provider.
  - `C`: A function that renders the provider component, wrapping its children.
  - `dependencies`: An array of strings identifying the providers this provider depends on.
- `children`: The children to be rendered inside the nested providers.

#### Errors:

- Throws an error if a provider has dependencies that don’t exist.
- Throws an error if circular dependencies are detected.

---

## License

MIT License

Copyright (c) DatHuis B.V.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Contributing

We welcome contributions! Please open an issue or submit a pull request for any bugs, features, or enhancements.
