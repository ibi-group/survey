import { useEffect, useState } from 'react'

import styles from '../styles/SatisfactionSlider.module.css'

import Smiley from './Smiley'

type Props = {
  initial?: number
  max?: number
  min?: number
  step?: number
  title?: string
  updateCallback?: (update: number) => void
}
const SatisfactionSlider = ({
  initial = 6,
  max = 10,
  min = 0,
  step,
  title,
  updateCallback
}: Props) => {
  const [number, updateNumber] = useState(initial || 0)

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
    <span className={styles.wrapper}>
      {title && <h1>{title}</h1>}
      <Smiley percentage={scaledNumber} />
      <input
        max={max}
        min={min}
        onChange={(e) => updateNumber(parseInt(e.target.value))}
        step={step}
        type="range"
        value={number}
      />
    </span>
  )
}
export { SatisfactionSlider }
