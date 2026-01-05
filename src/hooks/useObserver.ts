import { useEffect, useRef } from 'react'

export const useObserver = <T>(callback: (isIntersecting: boolean) => T, options = {}) => {
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      callback(entry.isIntersecting)
    }, {
      threshold: 1,  // Trigger when 10% visible
      ...options
    })

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [callback])

  return elementRef
}