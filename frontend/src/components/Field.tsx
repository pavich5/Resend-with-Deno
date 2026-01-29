import type { PropsWithChildren } from 'react'

type FieldProps = PropsWithChildren<{
  label: string
  full?: boolean
}>

function Field({ label, full, children }: FieldProps) {
  return (
    <label className={`field${full ? ' full' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export default Field
