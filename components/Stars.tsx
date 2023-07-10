import React, { useCallback, useEffect, useState } from 'react'

import starStyles from '../styles/Stars.module.css'

export type StarsProps = {
  defaultOptionIndex?: number
  number?: number
  updateCallback?: (update: number) => void
}

const Star = ({ index, selected }: { index?: string; selected?: boolean }) => {
  let fill = 'rgba(30, 30, 30, 0.3)'
  if (selected) {
    fill = 'rgba(255, 214, 0, 0.8)'
  }

  return (
    <svg
      aria-label={index ? `${Number(index) + 1} stars` : ''}
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

  const onStarChange = useCallback((e) => {
    return updateSelectedOption(parseInt((e.target as HTMLInputElement).value))
  }, [])
  return (
    <div className={starStyles.container}>
      {Array(number)
        .fill(null)
        .map((_, index) => (
          <React.Fragment key={index}>
            <input
              className={` ${starStyles.input} invisibleA11yLabel`}
              id={`star-rating-${index}`}
              name="rating"
              onChange={onStarChange}
              ref={(starRef) => {
                // If there is no default selected option, set focus to first radio button
                if (starRef && index === 0 && selectedOption < 0) {
                  starRef.focus()
                  // If there is a default selected option, set focus to that option
                } else if (
                  starRef &&
                  selectedOption === defaultOptionIndex &&
                  index === selectedOption
                ) {
                  starRef.focus()
                }
              }}
              type="radio"
              value={`${index}`}
            />
            <label htmlFor={`star-rating-${index}`}>
              <span>
                {selectedOption >= index ? (
                  <Star index={`${index}`} selected />
                ) : (
                  <Star />
                )}
              </span>
            </label>
          </React.Fragment>
        ))}
    </div>
  )
}
export { Stars }
