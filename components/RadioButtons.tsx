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
  defaultOptionIndex = -1,
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
        className={styles.container}
        disabled={disabled}
        onChange={(e) => {
          const selectedValue = parseInt((e.target as HTMLInputElement).value)
          updateSelectedOption(selectedValue)
        }}
      >
        {title && (
          <legend>
            <h2>{title}</h2>
          </legend>
        )}
        {options?.map((option, index) => (
          <label htmlFor={`${uuid}-${index}`} key={index}>
            <input
              aria-labelledby={`${option}-label`}
              className={styles.button}
              defaultChecked={index === selectedOption}
              id={`${uuid}-${index}`}
              name={uuid}
              type="radio"
              value={index}
            />
            <span className={styles.label} id={`${option}-label`}>
              {option}
            </span>
          </label>
        ))}
      </fieldset>
    </>
  )
}
export { RadioButtons }
