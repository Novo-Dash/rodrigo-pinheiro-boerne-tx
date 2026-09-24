import { useBooking } from '@/nd'

export type ModalTag = 'kids' | 'adults' | 'women' | 'both' | null

// Bridge to the Novo Dash kit: the page keeps calling open(tag); the kit's
// modal lists every class, so the tag no longer pre-selects one.
export function useModal() {
  const { open } = useBooking()
  return { open: (_tag?: ModalTag) => open() }
}
