/* eslint-disable jsx-a11y/label-has-for */
import React, { useEffect, useState } from 'react'

import styles from '../styles/RadioButtons.module.css'

export type RadioButtonProps = {
  defaultOptionIndex?: number
  options: string[]
  title?: string
  updateCallback?: (update: number) => void
}
const RadioButtons = ({
  defaultOptionIndex = 0,
  options,
  title,
  updateCallback
}: RadioButtonProps) => {
  const [selectedOption, updateSelectedOption] = useState(defaultOptionIndex)

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
              className={styles.button}
              defaultChecked={index === selectedOption}
              id={`${index}`}
              name={title}
              tabIndex={index}
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
