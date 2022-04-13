import React from 'react'

// From https://www.30secondsofcode.org/react/s/use-unload
export const useUnload = (fn: () => void) => {
  const cb = React.useRef(fn)

  React.useEffect(() => {
    const onUnload = cb.current
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [cb])
}
