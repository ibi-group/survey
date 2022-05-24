/* eslint-disable jsx-a11y/label-has-for */
import React, { useEffect, useState } from 'react'

import styles from '../styles/RadioButtons.module.css'

type Props = {
  defaultOptionIndex?: number
  options: string[]
  title?: string
  updateCallback?: (update: number) => void
}
const RadioButtons = ({
  defaultOptionIndex,
  options,
  title,
  updateCallback
}: Props) => {
  const [selectedOption, updateSelectedOption] = useState(
    defaultOptionIndex || 0
  )

  useEffect(
    () => {
      if (!updateCallback) return
      updateCallback(selectedOption)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedOption]
  )

  return (
    <>
      {title && <h3>{title}</h3>}
      <fieldset
        className={styles.container}
        onChange={
          (e) =>
            updateSelectedOption(parseInt((e.target as HTMLInputElement).value))
          // eslint-disable-next-line react/jsx-curly-newline
        }
      >
        {options?.map((option, index) => (
          <label key={index}>
            <input
              checked={index === selectedOption}
              className={styles.button}
              id={`${index}`}
              name={title}
              type="radio"
              value={index}
            />
            <span className={styles.label}>{option}</span>
          </label>
        ))}
      </fieldset>
    </>
  )
}
export { RadioButtons }
