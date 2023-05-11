import { atom, useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'

const isScrollingAtom = atom(false)

export function useScrollDirection() {
  const [isScrolling, setIsScrolling] = useAtom(isScrollingAtom)
  const lastScrollTop = useRef(0)
  const lastScrollLeft = useRef(0)
  let timer: NodeJS.Timeout

  const hasScrolledTo = (x: number, y: number) => {
    timer && clearTimeout(timer)

    if (lastScrollLeft.current !== x || lastScrollTop.current !== y) {
      setIsScrolling(true)
    }

    timer = setTimeout(() => {
      setIsScrolling(false)
      lastScrollTop.current = y
      lastScrollLeft.current = x
    }, 100)
  }

  useEffect(() => {
    return () => timer && clearTimeout(timer)
  }, [])

  return {
    hasScrolledTo,
    isScrolling
  }
}
