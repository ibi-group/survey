import React, { useCallback, useEffect, useState } from 'react'
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

  const onSelectionChange = useCallback((e) => {
    const selectedValue = parseInt((e.target as HTMLInputElement).value)
    updateSelectedOption(selectedValue)
  }, [])

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
            onChange={onSelectionChange}
            ref={(radioRef) => {
              // If there is no default selected option, set focus to first radio button
              if (radioRef && index === 0 && selectedOption < 0) {
                radioRef.focus()
                // If there is a default selected option, set focus to that option
              } else if (
                radioRef &&
                selectedOption === defaultOptionIndex &&
                index === selectedOption
              ) {
                radioRef.focus()
              }
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
