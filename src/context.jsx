/* eslint-env browser */
import React, { createContext, useEffect, useCallback } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import PropTypes from 'prop-types'

const getFromPath = (data, path) => path.split('.').reduce(
  (curr, sub) => curr && curr[sub],
  data,
)

const Context = createContext()

const messageProxy = {
  set() {
    throw new Error('[use-locales] messages is unvariant.')
  },
  get(obj, prop) {
    return obj[prop] || prop
  },
}

const LocalesProvider = ({ children, loadingElm, hashKey }) => {
  const [lang, setLang] = useLocalStorage('lang', undefined)
  const [locales, setLocales] = useLocalStorage('locales', undefined)

  useEffect(() => {
    // load lang
    let currentLang = lang
    if (!lang) {
      // retrieve lang from navigator
      const { navigator } = window
      if (navigator) {
        const { language, userLanguage, languages } = navigator
        currentLang = language || userLanguage || (languages && languages.length && languages[0]) || 'en'
        if (currentLang.length > 2) currentLang = currentLang.substring(0, 2)
        if (currentLang.length < 2) currentLang = 'en'
      }
      setLang(currentLang)
    }

    // load locales
    if (
      !locales
      || !locales.date
      || !locales.lang
      || locales.lang !== currentLang
      || (hashKey && hashKey !== locales.hashKey)
      || (Date.now() - locales.date) > 259200000 /* 3 days */
    ) {
      const loadLocales = (fetchLang) => (
        fetch(`${process.env.PUBLIC_URL}/locales/${fetchLang}.json${hashKey ? `?hashKey=${hashKey}` : ''}`)
          .then((raw) => raw.json())
          .then((newLocales) => setLocales({
            data: newLocales,
            lang: fetchLang,
            date: Date.now(),
            hashKey,
          }))
      )

      loadLocales(currentLang)
        .catch(() => {
          setLang('en')
          loadLocales('en')
        })
    }
  }, [hashKey])

  const getMessages = useCallback((path = '') => {
    let { data: messages } = locales
    if (path !== '') messages = getFromPath(locales.data, path)
    if (typeof Proxy !== 'undefined') return new Proxy(messages, messageProxy)
    return messages
  }, [locales])

  if (!locales) return loadingElm

  return (
    <Context.Provider
      value={{
        lang,
        locales,
        getMessages,
      }}
    >
      {children}
    </Context.Provider>
  )
}

LocalesProvider.propTypes = {
  children: PropTypes.node.isRequired,
  loadingElm: PropTypes.node,
  hashKey: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
}

LocalesProvider.defaultProps = {
  loadingElm: null,
  hashKey: null,
}

export { Context as LocalesContext }
export { LocalesProvider }
