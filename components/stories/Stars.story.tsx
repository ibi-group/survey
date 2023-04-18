import React from 'react'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'

import { Stars } from '../Stars'

export default {
  component: Stars,
  title: 'Star Ratings'
} as ComponentMeta<typeof Stars>

export const Default = () => (
  <Stars updateCallback={action('Option is selected')} />
)

export const WithTitle = () => (
  <Stars
    number={50}
    title="How many stars are there in the sky?"
    updateCallback={action('Option is selected')}
  />
)
