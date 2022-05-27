import type { NextPage } from 'next'
import { useState } from 'react'
import { v4 } from 'uuid'

import { RadioButtonProps, RadioButtons } from '../components/RadioButtons'
import {
  SatisfactionSlider,
  SatisfactionSliderProps
} from '../components/SatisfactionSlider'
import { TextResponse, TextResponseProps } from '../components/TextResponse'
import styles from '../styles/base.module.css'

type Question = {
  title?: string
  type: string
} & (RadioButtonProps | SatisfactionSliderProps | TextResponseProps)

// TODO: import from file
const questions: Question[] = [
  {
    title: 'Welcome message',
    type: 'info'
  },
  { title: 'So what do you think of this survey?', type: 'textarea' },
  {
    initial: 0,
    title: "What's your face when you see this slider?",
    type: 'satisfaction'
  },
  {
    options: [
      'Once in my lifetime',
      'Once a week',
      'Once I find the time',
      'Once I get my act together',
      'Once upon a time'
    ],
    title: 'How often do you see yourself taking this awesome survey?',
    type: 'radio'
  },
  {
    placeholder: 'Talk about how sad you are here...',
    title: 'The survey is almost over',
    type: 'textarea'
  }
]

const renderQuestion = (
  question: Question,
  updateCallback?: (update: unknown) => void
) => {
  const { title, type } = question

  const failure = <h2>{type} was misconfigured.</h2>

  switch (type) {
    case 'info':
      return <h1>{title}</h1>
    case 'radio':
      if (!('options' in question)) return failure
      return (
        <RadioButtons
          options={question.options}
          title={title}
          updateCallback={updateCallback}
        />
      )
    case 'satisfaction':
      return (
        <SatisfactionSlider
          initial={'initial' in question ? question.initial : undefined}
          max={'max' in question ? question.max : undefined}
          min={'min' in question ? question.min : undefined}
          step={'step' in question ? question.step : undefined}
          title={title}
          updateCallback={updateCallback}
        />
      )
    case 'textarea':
      return (
        <TextResponse
          placeholder={
            'placeholder' in question ? question.placeholder : undefined
          }
          title={title}
          updateCallback={updateCallback}
        />
      )
    default:
      console.warn(`Invalid question type ${type}`)
      return (
        <h2>
          The configuration contains an invalid question type{' '}
          <pre style={{ display: 'inline' }}>{type || 'undefined'}</pre>. See
          console for details.
        </h2>
      )
  }
}

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
