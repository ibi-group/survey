import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import { v4 } from 'uuid'
import { useTranslations } from 'next-intl'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'

import { Question, renderQuestion } from '../components/util/questionRenderer'
import styles from '../styles/base.module.css'
import config from '../config.yaml'

const sessionUuid = v4()

type Props = {
  children?: React.ReactNode
  questions?: Question[]
}

const Home: NextPage = ({ questions }: Props) => {
  const [activeQuestion, setActiveQuestion] = useState(0)
  const t = useTranslations()

  const { connected, error, socket } = useSocket(config.socketServerUrl)
  const { sendMessage } = useSocketEvent(socket, 'textUpdated')

  const updateHandler = (update: unknown) => {
    console.log(
      `update! session ${sessionUuid}. activeQuestion ${activeQuestion}. value ${update}`
    )
    sendMessage({
      question: activeQuestion,
      sessionUuid,
      value: update
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
        if (question.i18n) {
          question.title = t(`question${index}.title`)
        }
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
  const questionMessages: Record<
    string,
    Record<string, string | string[] | undefined>
  > = {}
  const localizedQuestions = config.questions.map(
    (question: Question, index: number) => {
      if (question.i18n) {
        const translations = question.i18n[context.locale as string]
        questionMessages[`question${index}`] = translations

        // TODO: this is a bit of a hack to internationalize the some extra fields
        if (translations?.options) {
          return { ...question, options: translations.options }
        }
        if (translations?.placeholder) {
          return { ...question, placeholder: translations.placeholder }
        }
      }

      return question
    },
    {}
  )

  return {
    props: {
      messages: { ...messages, ...questionMessages },
      questions: localizedQuestions
    }
  }
}

export default Home
