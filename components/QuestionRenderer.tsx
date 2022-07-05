import { useTranslations } from 'next-intl'

import { RadioButtonProps, RadioButtons } from './RadioButtons'
import {
  SatisfactionSlider,
  SatisfactionSliderProps
} from './SatisfactionSlider'
import { TextResponse, TextResponseProps } from './TextResponse'

export type Question = {
  i18n?: IntlMessages & { options: Record<string, string> }
  title?: string
  type: string
} & (RadioButtonProps | SatisfactionSliderProps | TextResponseProps)

const QuestionRenderer = ({
  disabled,
  question,
  updateCallback
}: {
  disabled: boolean
  question: Question
  updateCallback?: (update: unknown) => void
}) => {
  const t = useTranslations()

  const { title, type } = question

  const failure = (
    <>
      <h1>Error</h1>
      <p>{type} was misconfigured.</p>
    </>
  )

  // TODO: move title rendering to this component?
  // Only if there is a way to make it stable across all components

  switch (type) {
    case 'info':
      return <h1>{title}</h1>
    case 'radio':
      if (!('options' in question)) return failure
      return (
        <RadioButtons
          disabled={disabled}
          options={question.options}
          title={title}
          updateCallback={updateCallback}
        />
      )
    case 'satisfaction':
      return (
        <SatisfactionSlider
          disabled={disabled}
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
          disabled={disabled}
          placeholder={
            'placeholder' in question
              ? question.placeholder
              : t('TextResponse.enterText')
          }
          title={title}
          updateCallback={updateCallback}
        />
      )
    default:
      console.warn(`Invalid question type ${type}`)
      return (
        <>
          <h1>Error</h1>
          <p>
            The configuration contains an invalid question type{' '}
            <code>{type || 'undefined'}</code>. See console for details.
          </p>
        </>
      )
  }
}

export default QuestionRenderer
