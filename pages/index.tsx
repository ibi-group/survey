import type { GetStaticProps, NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'
import { useTranslations } from 'next-intl'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { clone } from 'lodash'

import QuestionRenderer, { Question } from '../components/QuestionRenderer'
import styles from '../styles/base.module.css'
import config from '../config.yaml'
import { Alert } from '../components/Alert'
import NavButtons from '../components/NavButtons'

const sessionUuid = v4()

type Props = {
  children?: React.ReactNode
  questions?: Question[]
  socketServerUrl?: string
}

const Home: NextPage = ({ questions, socketServerUrl }: Props) => {
  if (!socketServerUrl) {
    throw Error(
      'SOCKET_SERVER_URL env variable not set. There is nowhere to send survey results!'
    )
  }
  const headingRefs = useRef<Array<HTMLHeadingElement>>([])
  const [activeQuestion, setActiveQuestion] = useState(0)
  const t = useTranslations()

  const { connected, error, socket } = useSocket(socketServerUrl, {
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

  // On each question render, set focus to h1 for AT
  useEffect(() => {
    headingRefs.current[activeQuestion]?.focus()
  }, [activeQuestion])

  if (!questions || questions.length === 0) {
    return <div>No questions defined</div>
  }

  const isLastQuestion = activeQuestion === questions.length - 1
  const surveyOver = activeQuestion >= questions.length

  const prevQuestion = () => setActiveQuestion(activeQuestion - 1)
  const nextQuestion = () => setActiveQuestion(activeQuestion + 1)

  const prevDisabled = activeQuestion === 0 || !connected
  const nextDisabled = surveyOver || !connected

  return (
    <main
      className={styles.wrapper}
      style={{
        backgroundColor: config?.customStyles?.backgroundColor || '#fff'
      }}
    >
      <Alert
        alertText={t('alert.noConnection')}
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
              display: index === activeQuestion ? '' : 'none'
            }}
          >
            <QuestionRenderer
              disabled={!connected}
              headingRefs={headingRefs}
              index={index}
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
          <h1 aria-live="assertive" tabIndex={-1}>
            {t('index.completion')}
          </h1>
          {t('index.completionSubtitle') !== 'index.completionSubtitle' && (
            <h2>{t('index.completionSubtitle')}</h2>
          )}
        </div>
      )}
      <section className={styles.buttons}>
        <NavButtons
          isLastQuestion={isLastQuestion}
          nextDisabled={nextDisabled}
          nextQuestion={nextQuestion}
          prevDisabled={prevDisabled}
          prevQuestion={prevQuestion}
        />
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

        if (translations?.subtitle) {
          updatedQuestion.subtitle = translations.subtitle
        }

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
      questions: localizedQuestions,
      socketServerUrl: process.env.SOCKET_SERVER_URL
    }
  }
}

export default Home
