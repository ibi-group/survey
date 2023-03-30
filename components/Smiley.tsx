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

  return <span className={styles.large}>{EMOJI_MAP[matchingEmoji]}</span>
}

export default Smiley
