/* eslint-disable complexity */
import { useTranslations } from 'next-intl'

import { RadioButtonProps, RadioButtons } from './RadioButtons'
import {
  SatisfactionSlider,
  SatisfactionSliderProps
} from './SatisfactionSlider'
import { Stars, StarsProps } from './Stars'
import { TextResponse, TextResponseProps } from './TextResponse'

export type Question = {
  i18n?: IntlMessages & { options: Record<string, string> }
  subtitle?: string
  title?: string
  type: string
} & (
  | RadioButtonProps
  | SatisfactionSliderProps
  | TextResponseProps
  | StarsProps
)

// eslint-disable-next-line complexity
const QuestionRenderer = ({
  disabled,
  index,
  question,
  updateCallback
}: {
  disabled: boolean
  index: number
  question: Question
  updateCallback?: (update: unknown) => void
}) => {
  const t = useTranslations()

  const { subtitle, title, type } = question

  const failure = (
    <>
      <h1>Error</h1>
      <p>{type} was misconfigured.</p>
    </>
  )

  // TODO: Reduce complexity

  const renderQuestion = (type: string) => {
    switch (type) {
      case 'radio':
        if (!('options' in question)) return failure
        return (
          <RadioButtons
            defaultOptionIndex={question.defaultOptionIndex}
            disabled={disabled}
            options={question.options}
            updateCallback={updateCallback}
          />
        )
      case 'stars':
        return (
          <Stars
            defaultOptionIndex={
              'defaultOptionIndex' in question
                ? question.defaultOptionIndex
                : undefined
            }
            number={'number' in question ? question.number : undefined}
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
  if (type === 'info') {
    return (
      <>
        {title && (
          <h1 aria-live="assertive" id={`heading-${index}`} tabIndex={-1}>
            {title}
          </h1>
        )}
        {subtitle && <h2>{subtitle}</h2>}
      </>
    )
  }

  return (
    <fieldset className="container">
      {title && (
        <legend>
          <h1
            aria-live="assertive"
            className={type === 'textarea' ? 'alignLeft' : ''}
            id={`heading-${index}`}
            tabIndex={-1}
          >
            {title}
          </h1>
        </legend>
      )}
      {subtitle && <h2>{subtitle}</h2>}
      {renderQuestion(type)}
    </fieldset>
  )
}

export default QuestionRenderer
