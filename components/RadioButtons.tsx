/* eslint-disable jsx-a11y/label-has-for */
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
      {title && <h3>{title}</h3>}
      <fieldset
        className={styles.container}
        disabled={disabled}
        onChange={(e) => {
          const selectedValue = parseInt((e.target as HTMLInputElement).value)
          updateSelectedOption(selectedValue)
        }}
      >
        <legend>{title}</legend>
        {options?.map((option, index) => (
          <label key={index}>
            <input
              aria-checked={index === selectedOption}
              aria-label={option}
              className={styles.button}
              defaultChecked={index === selectedOption}
              id={`${index}`}
              name={uuid}
              tabIndex={0}
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
