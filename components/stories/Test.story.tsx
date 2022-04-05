import React from 'react'
import { ComponentMeta } from '@storybook/react'

import { Test } from '../Test'

export default {
  component: Test,
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Test Component'
} as ComponentMeta<typeof Test>

export const Default = () => <Test />
