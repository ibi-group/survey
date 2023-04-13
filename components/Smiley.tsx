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
  const matchingEmoji = Object.keys(EMOJI_MAP).find(
    (key) => parseInt(key) >= percentage * 100
  )
  if (!matchingEmoji) return null

  return (
    <span
      aria-label={`Satisfaction level: ${matchingEmoji}`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={percentage * 100}
      className={styles.large}
      role="slider"
      tabIndex={0}
      title={`Satisfaction level: ${matchingEmoji}`}
    >
      {EMOJI_MAP[matchingEmoji]}
    </span>
  )
}

export default Smiley
