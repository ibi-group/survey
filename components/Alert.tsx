import React from 'react'

import styles from '../styles/Alert.module.css'

export type AlertProps = {
  alertText: string
  show: boolean
}

const Alert = ({ alertText, show }: AlertProps) => {
  const wrapperStyles = show
    ? styles.wrapper
    : styles.wrapper + ' ' + styles.hidden
  return (
    <div
      aria-hidden={!show}
      className={wrapperStyles}
      style={{ display: show ? '' : 'none' }}
    >
      {alertText}
    </div>
  )
}

export { Alert }
