import styles from '../styles/QuestionWrapper.module.css'

type Props = { children?: JSX.Element }

/**
 * This wrapper ensures that only one question is shown at a time.
 */
const QuestionWrapper = ({ children }: Props) => (
  <section className={styles.q}>{children}</section>
)
export default QuestionWrapper
