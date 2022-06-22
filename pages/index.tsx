import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import { v4 } from 'uuid'
import { useTranslations } from 'next-intl'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { clone } from 'lodash'

import QuestionRenderer, { Question } from '../components/QuestionRenderer'
import styles from '../styles/base.module.css'
import config from '../config.yaml'
import { Alert } from '../components/Alert'

const sessionUuid = v4()

type Props = {
  children?: React.ReactNode
  questions?: Question[]
}

const Home: NextPage = ({ questions }: Props) => {
  const [activeQuestion, setActiveQuestion] = useState(0)
  const t = useTranslations()

  const { connected, error, socket } = useSocket(config.socketServerUrl, {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  })
  const { sendMessage } = useSocketEvent(socket, 'textUpdated')
  const [hasDisconnected, setHasDisconnected] = useState(false)
  socket.on('disconnect', () => setHasDisconnected(true))
  socket.on('connect_error', () => setHasDisconnected(true))

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

  // TODO: add a wrapper here to blur focus when changing questions
  const prevQuestion = () => setActiveQuestion(activeQuestion - 1)
  const nextQuestion = () => setActiveQuestion(activeQuestion + 1)

  return (
    <main className={styles.wrapper}>
      <Alert
        alertText="No connection to internet."
        show={!connected && (hasDisconnected || !!error)}
      />
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
            <QuestionRenderer
              disabled={!connected}
              question={question}
              updateCallback={(update: unknown) => {
                return activeQuestion === index
                  ? updateHandler(update)
                  : console.log(
                      'Swallowing invalid callback update provided by inactive question'
                    )
              }}
            />
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
        <button
          disabled={activeQuestion === 0 || !connected}
          onClick={prevQuestion}
        >
          {t('index.prev')}
        </button>
        <button disabled={surveyOver || !connected} onClick={nextQuestion}>
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
      let updatedQuestion = clone(question)

      if (question.i18n) {
        const translations = question.i18n[context.locale as string]
        questionMessages[`question${index}`] = translations

        // NOTE: this doesn't use the internationalization library, but achieves the same outcome
        updatedQuestion.title = translations.title

        if (translations?.options) {
          updatedQuestion = {
            ...updatedQuestion,
            options: translations.options
          }
        }
        if (translations?.placeholder) {
          updatedQuestion = {
            ...updatedQuestion,
            placeholder: translations.placeholder
          }
        }
      }

      return updatedQuestion
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
