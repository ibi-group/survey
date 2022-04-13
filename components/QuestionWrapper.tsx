import styles from '../styles/QuestionWrapper.module.css'

type Props = { children?: JSX.Element }

const QuestionWrapper = ({ children }: Props) => (
  <section className={styles.q}>{children}</section>
)
export default QuestionWrapper
