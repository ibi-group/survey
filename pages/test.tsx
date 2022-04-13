import { useState } from 'react'
import type { NextPage } from 'next'

import styles from '../styles/base.module.css'
import { TextResponse } from '../components/TextResponse'
import QuestionWrapper from '../components/QuestionWrapper'

const Home: NextPage = () => {
  const [messages, setMessages] = useState<string[]>([])
  const addMessage = (msg: string) => setMessages([...messages, msg])

  return (
    <div className={styles.home}>
      <h3>
        This will one day contain a configurable survey. For now it renders the
        components and displays callback updates
      </h3>
      <div className={styles.columns}>
        <div className={styles.messageLog}>
          <h1>Message Log</h1>
          <ul>
            {messages.map((msg) => (
              <li key={Math.random()}>{msg}</li>
            ))}
          </ul>
        </div>
        <div className={styles.questions}>
          <QuestionWrapper>
            <TextResponse placeholder="q 1" />
          </QuestionWrapper>
          <QuestionWrapper>
            <TextResponse placeholder="q 2" />
          </QuestionWrapper>
        </div>
      </div>
    </div>
  )
}

export default Home
