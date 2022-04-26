import { useEffect, useState } from 'react'
// @ts-expect-error This package is typescripted, but not uploaded to npm correctly
import { useDebounce } from 'use-lodash-debounce'

import styles from '../styles/TextResponse.module.css'

type Props = {
  placeholder?: string
  updateCallback?: (update: string) => void
}
const TextResponse = ({ placeholder, updateCallback }: Props) => {
  const [userText, updateUserText] = useState('')
  const debouncedUserText = useDebounce(userText, 500)

  useEffect(
    () => {
      if (!updateCallback) return
      updateCallback(debouncedUserText)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedUserText]
  )

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
