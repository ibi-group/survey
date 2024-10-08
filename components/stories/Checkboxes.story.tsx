import React from 'react'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'

import { Checkboxes } from '../Checkboxes'

export default {
  component: Checkboxes,
  title: 'Check Boxes'
} as ComponentMeta<typeof Checkboxes>

export const Default = () => (
  <Checkboxes
    options={['first', 'second', 'third']}
    updateCallback={action('Option is selected')}
  />
)

export const WithTitle = () => (
  <>
    <h1>How many stars are there in the sky?</h1>
    <Checkboxes
      options={['one', 'two', 'three', 'four', 'five']}
      updateCallback={action('Option is selected')}
    />
  </>
)
