import { useContext } from 'react'
import { LocalesContext } from './context'

export const useLang = () => {
  const { lang } = useContext(LocalesContext)

  return lang
}
