import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import Smiley from './Smiley'

export type SatisfactionSliderProps = {
  disabled?: boolean
  initial?: number
  max?: number
  min?: number
  step?: number
  title?: string
  updateCallback?: (update: number) => void
}
const SatisfactionSlider = ({
  disabled = false,
  initial = 6,
  max = 10,
  min = 0,
  step,
  title,
  updateCallback
}: SatisfactionSliderProps) => {
  const [number, updateNumber] = useState(initial || 0)
  const t = useTranslations()

  useEffect(
    () => {
      if (!updateCallback) return
      updateCallback(number)
    },
    // The eslint rule is correct in identifying that if you change the callback
    // it may not get fired until the value is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [number]
  )

  const scaledNumber = (number - min) / (max - min)

  const onSliderChange = useCallback(
    (e) => updateNumber(parseInt(e.target.value)),
    []
  )

  return (
    <>
      <span className="invisibleA11yLabel">{t('Slider.valueDescription')}</span>
      <Smiley percentage={scaledNumber} />
      <input name={title} type="hidden" value={scaledNumber} />
      <input
        aria-label={title}
        disabled={disabled}
        max={max}
        min={min}
        name={title}
        onChange={onSliderChange}
        // Set focus to input on render
        ref={(sliderRef) => {
          if (sliderRef) {
            sliderRef.focus()
          }
        }}
        step={step}
        type="range"
        value={number}
      />
    </>
  )
}
export { SatisfactionSlider }
