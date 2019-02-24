# use-locales
> React hooks to bring locales in your browser

## How it works?
- Detects your browser lang
- Try to find locales in locales storages
- If locales are not in locales storages or lang store in local storage is different that the browser lang
  * Load accurate locales, if it doesn't find one matching the browser lang, fallback to `en`
  * Set downloaded locales and lang in localStorage
- Add locales in context
- As a developper give a path (no path means root path) to search from your loaded locales

## How to use it?
1. Install the package: `yarn add use-locales`
2. Add a locales provider to your application:
```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { LocalesProvider } from 'use-locales'
import App from './app'

ReactDOM.render(
  <LocalesProvider>
    <App />
  </LocalesProvider>
  document.getElementById('root'),
)
```
3. Use locales in your components
```jsx
import React from 'react'
import { useLocales } from 'use-locales'

const App = () => {
  const messages = useLocales()

  return (
    <div>
      {messages.welcome}
    </div>
  )
}
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

## Feel free to open PR/Issues !
Feel free to discuss or open PR to have a better package all together!
Right know I use this package into:
 - [roll](https://github.com/fabienjuif/roll)
 - [lire](https://github.com/fabienjuif/lire)
