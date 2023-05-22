import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import styles from '../styles/RadioButtons.module.css'

export type RadioButtonProps = {
  defaultOptionIndex?: number
  disabled?: boolean
  options: string[]
  updateCallback?: (update: number) => void
}
const RadioButtons = ({
  defaultOptionIndex = -1,
  disabled = false,
  options,
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
    <div className={styles.container}>
      {options?.map((option, index) => (
        <label htmlFor={`${uuid}-${index}`} key={index}>
          <input
            aria-labelledby={`${option}-label`}
            className={styles.button}
            defaultChecked={index === selectedOption}
            disabled={disabled}
            id={`${uuid}-${index}`}
            name={uuid}
            onChange={(e) => {
              const selectedValue = parseInt(
                (e.target as HTMLInputElement).value
              )
              updateSelectedOption(selectedValue)
            }}
            type="radio"
            value={index}
          />
          <span className={styles.label} id={`${option}-label`}>
            {option}
          </span>
        </label>
      ))}
    </div>
  )
}
export { RadioButtons }
