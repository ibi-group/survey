import type { NextPage } from 'next'
import { useState } from 'react'
import { v4 } from 'uuid'

import { renderQuestion } from '../components/util/questionRenderer'
import styles from '../styles/base.module.css'
import { questions } from '../config.json'

const sessionUuid = v4()

const Home: NextPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(0)

  const updateHandler = (update: unknown) => {
    console.log(
      `update! session ${sessionUuid}. activeQuestion ${activeQuestion}. value ${update}`
    )
    fetch(`/api/recordUpdate`, {
      body: JSON.stringify({
        question: activeQuestion,
        sessionUuid,
        value: update
      }),
      method: 'POST'
    })
  }

  const surveyOver = activeQuestion >= questions.length

  const prevQuestion = () => setActiveQuestion(activeQuestion - 1)
  const nextQuestion = () => setActiveQuestion(activeQuestion + 1)

  return (
    <main className={styles.wrapper}>
      {/* dynamically imported content */}
      {questions.map((question, index) => {
        return (
          <form
            className={styles.question}
            key={index}
            onSubmit={nextQuestion}
            style={{
              display: index === activeQuestion ? 'inherit' : 'none'
            }}
          >
            {renderQuestion(question, (update: unknown) =>
              activeQuestion === index
                ? updateHandler(update)
                : console.log(
                    'Swallowing invalid callback update provided by inactive question'
                  )
            )}
          </form>
        )
      })}

      {surveyOver && (
        <div className={styles.question}>
          <h1>Thanks. Results are submitted.</h1>
          <h2>It is now safe to turn off your computer.</h2>
        </div>
      )}

      <section className={styles.buttons}>
        <button disabled={activeQuestion === 0} onClick={prevQuestion}>
          〈 Previous
        </button>
        <button disabled={surveyOver} onClick={nextQuestion}>
          Next 〉
        </button>
      </section>
    </main>
  )
}

export default Home
