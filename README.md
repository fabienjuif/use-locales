# use-locales

> React hooks to bring locales in your browser

![npm](https://img.shields.io/npm/v/use-locales.svg) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-locales.svg) ![CI](https://github.com/fabienjuif/use-locales/actions/workflows/simple.yml/badge.svg)

## How it works?

- Detects your browser lang
- Try to find locales in locales storages
- If locales are not in locales storages or lang store in local storage is different that the browser lang
  - Load accurate locales, if it doesn't find one matching the browser lang, fallback to `en`
  - Set downloaded locales and lang in localStorage
- Add locales in context
- As a developper give a path (no path means root path) to search from your loaded locales

## How to use it?

1. Install the package: `yarn add use-locales react-use`
2. Add a locales provider to your application:

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { LocalesProvider } from 'use-locales'
import App from './app'

ReactDOM.render(
  <LocalesProvider hashKey={process.env.REACT_APP_GIT_SHA || Date.now()}>
    <App />
  </LocalesProvider>
  document.getElementById('root'),
)
```

3. Use locales in your components

```jsx
import React from "react";
import { useLocales } from "use-locales";

const App = () => {
  const messages = useLocales();

  return <div>{messages.welcome}</div>;
};
```

4. Maintain your locales
   Your locales must accessibles from http in `<public-path>/locales/<lang>.json`

- `<public-path>` is loaded from `PUBLIC_PATH` env variable
- `<lang>` is 2 chars, like `en` or `fr`

Exemple of files:
**public/locales/en.json**

```json
{
  "welcome": "Welcome!"
}
```

**public/locales/fr.json**

```json
{
  "welcome": "Bienvenue !"
}
```

## API

- `<LocalesProvider hashKey>`: provider, your nodes must be wrapped by this to use hooks, we recommand to set it at your application root element.
  - `hashKey`: is used to detect if locales have to be fetched before the timeout. A good practice is to use the git commit hash!
- `useLang(): string`: returns the detect language use by the browser
- `useLocales(path: string?): object`: given the path, returns locales from `<public-path>/locales/<lang>.json`
  - if `path` is not set it will returns all the locales

## Feel free to open PR/Issues !

Feel free to discuss or open PR to have a better package all together!
Right know I use this package into:

- [roll](https://github.com/fabienjuif/roll)
- [lire](https://github.com/fabienjuif/lire)
