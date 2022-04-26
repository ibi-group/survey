import { useEffect, useState } from 'react'

import styles from '../styles/Slider.module.css'

import Smiley from './Smiley'

type Props = {
  initial?: number
  max?: number
  min?: number
  step?: number
  updateCallback?: (update: number) => void
}
const SatisfactionSlider = ({
  initial,
  max,
  min,
  step,
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

  return (
    <>
      <Smiley percentage={number} />
      <input
        max={max}
        min={min}
        onChange={(e) => updateNumber(parseInt(e.target.value))}
        step={step}
        type="range"
        value={number}
      />
    </>
  )
}
export { SatisfactionSlider }
