import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import { v4 } from 'uuid'
import { useTranslations } from 'next-intl'

import { Question, renderQuestion } from '../components/util/questionRenderer'
import styles from '../styles/base.module.css'
import config from '../config.json'

const sessionUuid = v4()

type Props = {
  children?: React.ReactNode
  questions?: Question[]
}

const Home: NextPage = ({ questions }: Props) => {
  const [activeQuestion, setActiveQuestion] = useState(0)
  const t = useTranslations()

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

  if (!questions || questions.length === 0) {
    return <div>No questions defined</div>
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
          <h1>{t('index.completion')}</h1>
          <h2>{t('index.completionSecondary')}</h2>
        </div>
      )}

      <section className={styles.buttons}>
        <button disabled={activeQuestion === 0} onClick={prevQuestion}>
          {t('index.prev')}
        </button>
        <button disabled={surveyOver} onClick={nextQuestion}>
          {t('index.next')}
        </button>
      </section>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const messages = config.i18n[context.locale as keyof typeof config.i18n]
  const questionMessages = config.questions.reduce((prev, cur, index) => {
    if (cur.i18n) {
      // TODO: merge in keys and give them unique titles, then set that title as the title object for the question
    }
  }, {})

  return {
    props: {
      messages,
      questions: config.questions
    }
  }
}

export default Home
