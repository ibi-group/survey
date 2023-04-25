import React, { useEffect, useState } from 'react'

import styles from '../styles/RadioButtons.module.css'
import starStyles from '../styles/Stars.module.css'

export type StarsProps = {
  defaultOptionIndex?: number
  number?: number
  title?: string
  updateCallback?: (update: number) => void
}

const Star = ({ selected }: { selected?: boolean }) => {
  let fill = 'rgba(30, 30, 30, 0.3)'
  if (selected) {
    fill = 'rgba(255, 214, 0, 0.8)'
  }

  return (
    <svg
      className={starStyles.star}
      height="55"
      width="54"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27,2.5 43,52.5 1,21.5H53.5L11,52.5"
        style={{
          fill
        }}
      />
    </svg>
  )
}

const Stars = ({
  defaultOptionIndex = -1,
  number = 5,
  title,
  updateCallback
}: StarsProps) => {
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
      {title && <h2>{title}</h2>}
      <fieldset
        className={starStyles.container}
        onChange={
          (e) =>
            updateSelectedOption(parseInt((e.target as HTMLInputElement).value))
          // eslint-disable-next-line react/jsx-curly-newline
        }
      >
        {Array(number)
          .fill(null)
          .map((_, index) => (
            <React.Fragment key={index}>
              <input
                className={starStyles.hidden}
                id={`rating-${index}`}
                name="rating"
                type="radio"
                value={`${index}`}
              />
              <label htmlFor={`rating-${index}`}>
                <span>
                  {selectedOption >= index ? <Star selected /> : <Star />}
                </span>
              </label>
            </React.Fragment>
          ))}
      </fieldset>
    </>
  )
}
export { Stars }
