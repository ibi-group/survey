import { useEffect, useState } from 'react'
// @ts-expect-error This package is typescripted, but not uploaded to npm correctly
import { useDebounce } from 'use-lodash-debounce'

import styles from '../styles/TextResponse.module.css'

export type TextResponseProps = {
  placeholder?: string
  title?: string
  updateCallback?: (update: string) => void
}
const TextResponse = ({
  placeholder,
  title,
  updateCallback
}: TextResponseProps) => {
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
    <>
      {title && <h3>{title}</h3>}
      <textarea
        className={styles.textbox}
        name={title}
        onChange={(e) => updateUserText(e.target.value)}
        placeholder={placeholder}
        value={userText}
      />
    </>
  )
}
export { TextResponse }
