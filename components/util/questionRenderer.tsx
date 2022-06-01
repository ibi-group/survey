import { RadioButtonProps, RadioButtons } from '../RadioButtons'
import {
  SatisfactionSlider,
  SatisfactionSliderProps
} from '../SatisfactionSlider'
import { TextResponse, TextResponseProps } from '../TextResponse'

export type Question = {
  // TODO: superior type
  i18n?: Record<string, any>
  title?: string
  type: string
} & (RadioButtonProps | SatisfactionSliderProps | TextResponseProps)

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

export { renderQuestion }
