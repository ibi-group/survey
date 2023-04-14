import styles from '../styles/SatisfactionSlider.module.css'

type Props = {
  percentage: number
}

interface EmojiMap {
  [key: string]: string
}
const EMOJI_MAP: EmojiMap = {
  10: '😢',
  100: '😁',
  20: '🙁',
  30: '😕',
  50: '😐',
  60: '🙂',
  70: '😊',
  90: '😄'
}

const Smiley = ({ percentage }: Props) => {
  const min = 0
  const max = 10
  const matchingEmoji = Object.keys(EMOJI_MAP).find(
    (key) => parseInt(key) >= percentage * 100
  )
  if (!matchingEmoji) return null

  return (
    <span
      aria-label={`Satisfaction rating: ${
        parseInt(matchingEmoji) / 10
      }, ${min} is the worst rating, ${max} is the best rating`}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={parseInt(matchingEmoji) / 10}
      className={styles.large}
      role="slider"
      tabIndex={0}
      title={`Satisfaction rating: ${
        parseInt(matchingEmoji) / 10
      }, ${min} is the worst rating, ${max} is the best rating`}
    >
      {EMOJI_MAP[matchingEmoji]}
    </span>
  )
}

export default Smiley
