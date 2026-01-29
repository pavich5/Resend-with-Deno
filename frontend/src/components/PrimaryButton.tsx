import type { PropsWithChildren } from 'react'

type PrimaryButtonProps = PropsWithChildren<{
  onClick: () => void
  disabled?: boolean
  compact?: boolean
}>

function PrimaryButton({ onClick, disabled, compact, children }: PrimaryButtonProps) {
  return (
    <button
      className={`button primary${compact ? ' compact' : ''}`}
      type='button'
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
