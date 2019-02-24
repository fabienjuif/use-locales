import { useContext } from 'react'
import { LocalesContext } from './context'

export const useLocales = (path) => {
  const { getMessages } = useContext(LocalesContext)

  return getMessages(path)
}
