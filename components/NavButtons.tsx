import React from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  isLastQuestion: boolean
  nextDisabled: boolean
  nextQuestion: () => void
  prevDisabled: boolean
  prevQuestion: () => void
}

const NavButtons = ({
  isLastQuestion,
  nextDisabled,
  nextQuestion,
  prevDisabled,
  prevQuestion
}: Props) => {
  const t = useTranslations()
  return (
    <>
      <button disabled={prevDisabled} onClick={prevQuestion}>
        {t('index.prev')}
      </button>
      <button
        disabled={nextDisabled}
        onClick={nextQuestion}
        type={isLastQuestion ? 'submit' : 'button'}
      >
        {isLastQuestion ? t('index.submitFeedback') : t('index.next')}
      </button>
    </>
  )
}

export default NavButtons
