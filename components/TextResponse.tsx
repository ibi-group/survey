import { useCallback, useEffect, useState } from 'react'
// @ts-expect-error This package is typescripted, but not uploaded to npm correctly
import { useDebounce } from 'use-lodash-debounce'

import styles from '../styles/TextResponse.module.css'

export type TextResponseProps = {
  disabled?: boolean
  placeholder?: string
  title?: string
  updateCallback?: (update: string) => void
}
const TextResponse = ({
  disabled = false,
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

  const onTextChange = useCallback((e) => updateUserText(e.target.value), [])

  return (
    <>
      <textarea
        className={`${styles.textbox} ${disabled ? 'disabled' : ''}`}
        disabled={disabled}
        id={title}
        name={title}
        onChange={onTextChange}
        placeholder={placeholder}
        // Focus the textarea on render
        ref={(textboxRef) => {
          if (textboxRef) {
            textboxRef.focus()
          }
        }}
        value={userText}
      />
    </>
  )
}
export { TextResponse }
