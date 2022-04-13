import React from 'react'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'

import { TextResponse } from '../TextResponse'

export default {
  component: TextResponse,
  title: 'Text Box'
} as ComponentMeta<typeof TextResponse>

const Wrapper = ({
  children,
  style
}: {
  children: JSX.Element
  style?: Record<string, string | number>
}) => (
  <div style={{ ...style, height: '30vh', padding: 80, width: '60vw' }}>
    {children}
  </div>
)

export const Default = () => (
  <Wrapper>
    <TextResponse
      placeholder="Describe your favorite food here"
      updateCallback={action('Text is updated')}
    />
  </Wrapper>
)

export const OnABackground = () => (
  <Wrapper style={{ backgroundColor: 'green' }}>
    <TextResponse />
  </Wrapper>
)
