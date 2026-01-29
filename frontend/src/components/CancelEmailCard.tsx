import type { ApiResponse } from '../api/client'
import EndpointCard from './EndpointCard'
import Field from './Field'
import PrimaryButton from './PrimaryButton'

type CancelEmailCardProps = {
  emailId: string
  onEmailIdChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  result: ApiResponse | null
}

function CancelEmailCard({
  emailId,
  onEmailIdChange,
  onSubmit,
  loading,
  result,
}: CancelEmailCardProps) {
  return (
    <EndpointCard
      method='post'
      path='/api/emails/:id/cancel'
      description='Cancel a scheduled email.'
      delay='240ms'
      result={result}
    >
      <Field label='Email id' full>
        <input
          type='text'
          value={emailId}
          onChange={(event) => onEmailIdChange(event.target.value)}
          placeholder='Paste the email id'
        />
      </Field>
      <PrimaryButton onClick={onSubmit} disabled={loading}>
        {loading ? 'Canceling...' : 'Cancel Email'}
      </PrimaryButton>
    </EndpointCard>
  )
}

export default CancelEmailCard
