import type { ApiResponse } from '../api/client'
import EndpointCard from './EndpointCard'
import Field from './Field'
import PrimaryButton from './PrimaryButton'

type RescheduleEmailCardProps = {
  emailId: string
  scheduledAt: string
  onEmailIdChange: (value: string) => void
  onScheduledAtChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  result: ApiResponse | null
}

function RescheduleEmailCard({
  emailId,
  scheduledAt,
  onEmailIdChange,
  onScheduledAtChange,
  onSubmit,
  loading,
  result,
}: RescheduleEmailCardProps) {
  return (
    <EndpointCard
      method='patch'
      path='/api/emails/:id'
      description='Reschedule a pending email.'
      delay='320ms'
      result={result}
    >
      <div className='form-grid'>
        <Field label='Email id' full>
          <input
            type='text'
            value={emailId}
            onChange={(event) => onEmailIdChange(event.target.value)}
            placeholder='Paste the email id'
          />
        </Field>
        <Field label='Scheduled At' full>
          <input
            type='text'
            value={scheduledAt}
            onChange={(event) => onScheduledAtChange(event.target.value)}
          />
        </Field>
      </div>
      <PrimaryButton onClick={onSubmit} disabled={loading}>
        {loading ? 'Updating...' : 'Reschedule'}
      </PrimaryButton>
    </EndpointCard>
  )
}

export default RescheduleEmailCard
