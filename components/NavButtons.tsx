import React from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  activeQuestion: number
  connected: boolean
  lastQuestion: boolean
  nextQuestion: () => void
  prevQuestion: () => void
  surveyOver: boolean
}

const NavButtons = ({
  activeQuestion,
  connected,
  lastQuestion,
  nextQuestion,
  prevQuestion,
  surveyOver
}: Props) => {
  const t = useTranslations()
  return (
    <>
      <button
        disabled={activeQuestion === 0 || !connected}
        onClick={prevQuestion}
      >
        {t('index.prev')}
      </button>
      <button
        disabled={surveyOver || !connected}
        onClick={nextQuestion}
        type={lastQuestion ? 'submit' : 'button'}
      >
        {lastQuestion ? t('index.submitFeedback') : t('index.next')}
      </button>
    </>
  )
}

export default NavButtons
