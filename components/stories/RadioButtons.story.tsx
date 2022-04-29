import React from 'react'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'

import { RadioButtons } from '../RadioButtons'

export default {
  component: RadioButtons,
  title: 'Radio Buttons'
} as ComponentMeta<typeof RadioButtons>

export const Default = () => (
  <RadioButtons
    options={['first', 'second', 'third']}
    updateCallback={action('Option is selected')}
  />
)

export const WithTitle = () => (
  <RadioButtons
    defaultOptionIndex={2}
    options={['one', 'two', 'three', 'four', 'five']}
    title="Pick a number"
    updateCallback={action('Option is selected')}
  />
)
