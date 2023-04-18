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
  const emojiKeys = Object.keys(EMOJI_MAP).map(Number)
  const [min, max] = [Math.min(...emojiKeys), Math.max(...emojiKeys)]
  const matchingEmoji = Object.keys(EMOJI_MAP).find(
    (key) => parseInt(key) >= percentage * 100
  )
  if (!matchingEmoji) return null

  return (
    <span
      aria-valuemax={max / 10}
      aria-valuemin={min / 10}
      aria-valuenow={parseInt(matchingEmoji) / 10}
      className={styles.large}
      role="slider"
      tabIndex={0}
    >
      {EMOJI_MAP[matchingEmoji]}
    </span>
  )
}

export default Smiley
