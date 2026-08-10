import { useState, useCallback } from 'react'

export type ModalTag = 'kids' | 'adults' | 'women' | 'both' | null

interface UseModalReturn {
  isOpen: boolean
  defaultTag: ModalTag
  open: (tag?: ModalTag) => void
  close: () => void
}

export function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultTag, setDefaultTag] = useState<ModalTag>(null)

  const open = useCallback((tag: ModalTag = null) => {
    setDefaultTag(tag)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])

  return { isOpen, defaultTag, open, close }
}
