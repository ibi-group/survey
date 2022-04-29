import { useEffect, useState } from 'react'

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
      {title && <h1>{title}</h1>}
      <form
        className={styles.container}
        onChange={
          (e) =>
            updateSelectedOption(parseInt((e.target as HTMLInputElement).value))
          // eslint-disable-next-line react/jsx-curly-newline
        }
      >
        {options?.map((option, index) => (
          <div className={styles.buttonContainer} key={index}>
            <input
              checked={index === selectedOption}
              className={styles.button}
              id={`${index}`}
              name="radio"
              type="radio"
              value={index}
            />
            <label htmlFor={`${index}`}>{option}</label>
          </div>
        ))}
      </form>
    </>
  )
}
export { RadioButtons }
