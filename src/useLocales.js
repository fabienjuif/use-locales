import { useContext, useState, useLayoutEffect } from 'react'
import { LocalesContext } from './context'
import format from './messageFormat'

export const useLocales = (path, object) => {
  const { getMessages, lang } = useContext(LocalesContext)
  const [messages, setMessages] = useState(getMessages(path))

  useLayoutEffect(() => {
    const rawMessage = getMessages(path)
    if (!object) {
      setMessages(rawMessage)
      return
    }

    setMessages(Object.entries(rawMessage).reduce(
      (acc, [key, value]) => ({
        ...acc, [key]: format(value, object, lang),
      }),
      {},
    ))
  }, [object])

  return messages
}
