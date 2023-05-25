import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import styles from '../styles/SatisfactionSlider.module.css'

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

  return (
    <>
      <span className={styles.invisibleA11yLabel}>
        {t('Slider.valueDescription')}
      </span>
      <Smiley percentage={scaledNumber} />
      <input
        aria-hidden="true"
        name={title}
        type="hidden"
        value={scaledNumber}
      />
      <input
        aria-label={title}
        disabled={disabled}
        max={max}
        min={min}
        name={title}
        onChange={(e) => updateNumber(parseInt(e.target.value))}
        step={step}
        type="range"
        value={number}
      />
    </>
  )
}
export { SatisfactionSlider }
