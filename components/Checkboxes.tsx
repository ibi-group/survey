import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import styles from '../styles/Checkboxes.module.css'

export type CheckboxesProps = {
  disabled?: boolean
  options: string[]
  updateCallback?: (update: string) => void
}
const Checkboxes = ({
  disabled = false,
  options,
  updateCallback
}: CheckboxesProps) => {
  const [selectedOptions, updateSelectedOptions] = useState(
    options.map(() => false)
  )

  useEffect(
    () => {
      if (!updateCallback) return
      updateCallback(selectedOptions.toString())
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedOptions]
  )

  const uuid = v4()

  const onSelectionChange = (e) => {
    const index = parseInt((e.target as HTMLInputElement).value)
    const clonedSelectedOptions = Array.from(selectedOptions)
    clonedSelectedOptions[index] = !clonedSelectedOptions[index]
    updateSelectedOptions(clonedSelectedOptions)
  }

  return (
    <div className={styles.container}>
      {options?.map((option, index) => (
        <label htmlFor={`${uuid}-${index}`} key={index}>
          <input
            aria-labelledby={`${option}-label`}
            className={styles.button}
            defaultChecked={selectedOptions[index] === true}
            disabled={disabled}
            id={`${uuid}-${index}`}
            name={uuid}
            onChange={onSelectionChange}
            type="checkbox"
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
export { Checkboxes }
