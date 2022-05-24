import React from 'react'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'

import { SatisfactionSlider } from '../SatisfactionSlider'

export default {
  component: SatisfactionSlider,
  title: 'Smiley Slider'
} as ComponentMeta<typeof SatisfactionSlider>

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
    <SatisfactionSlider updateCallback={action('Slider is updated')} />
  </Wrapper>
)

export const WithTitleAndCustomScale = () => (
  <Wrapper>
    <SatisfactionSlider
      initial={7}
      max={15}
      min={-5}
      title="How much do you like the bus?"
      updateCallback={action('Slider is updated')}
    />
  </Wrapper>
)
