import { useEffect, useState } from 'react'

import styles from '../styles/TextResponse.module.css'

type Props = {
  placeholder?: string
  updateCallback?: (update: string) => void
}
const TextResponse = ({ placeholder, updateCallback }: Props) => {
  const [userText, updateUserText] = useState('')
  useEffect(() => {
    if (!updateCallback) return
    // TODO: debounce
    updateCallback(userText)
  }, [updateCallback, userText])

  return (
    <textarea
      className={styles.textbox}
      onChange={(e) => updateUserText(e.target.value)}
      placeholder={placeholder}
      value={userText}
    />
  )
}
export { TextResponse }
