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
  <>
    <h1>How many stars are there in the sky?</h1>
    <Stars number={50} updateCallback={action('Option is selected')} />
  </>
)
