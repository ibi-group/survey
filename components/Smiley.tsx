import styles from '../styles/SatisfactionSlider.module.css'

type Props = {
  percentage: number
}

interface EmojiMap {
  [key: string]: string
}
const EMOJI_MAP: EmojiMap = {
  10: 'âšī¸',
  100: 'đ',
  20: 'đ',
  30: 'đ',
  50: 'đ',
  60: 'đ',
  70: 'đ',
  90: 'đ'
}

const Smiley = ({ percentage }: Props) => {
  const matchingEmoji = Object.keys(EMOJI_MAP).find(
    (key) => parseInt(key) >= percentage * 100
  )
  if (!matchingEmoji) return null

  return <span className={styles.large}>{EMOJI_MAP[matchingEmoji]}</span>
}

export default Smiley
