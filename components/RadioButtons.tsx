import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import styles from '../styles/RadioButtons.module.css'

export type RadioButtonProps = {
  defaultOptionIndex?: number
  disabled?: boolean
  options: string[]
  title?: string
  updateCallback?: (update: number) => void
}
const RadioButtons = ({
  defaultOptionIndex = 0,
  disabled = false,
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

  const uuid = v4()

  return (
    <>
      <fieldset
        aria-labelledby={`${uuid}-legend`}
        className={styles.container}
        disabled={disabled}
        onChange={(e) => {
          const selectedValue = parseInt((e.target as HTMLInputElement).value)
          updateSelectedOption(selectedValue)
        }}
      >
        {title && (
          <legend id={`${uuid}-legend`}>
            <h2>{title}</h2>
          </legend>
        )}
        {options?.map((option, index) => (
          <label htmlFor={title} key={index}>
            <input
              aria-label={option}
              checked={index === selectedOption}
              className={styles.button}
              id={`${uuid}-${index}`}
              name={uuid}
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
