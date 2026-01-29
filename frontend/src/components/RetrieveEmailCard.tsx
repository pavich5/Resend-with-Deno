import type { ApiResponse } from '../api/client'
import EndpointCard from './EndpointCard'
import Field from './Field'
import PrimaryButton from './PrimaryButton'

type RetrieveEmailCardProps = {
  emailId: string
  onEmailIdChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  result: ApiResponse | null
}

function RetrieveEmailCard({
  emailId,
  onEmailIdChange,
  onSubmit,
  loading,
  result,
}: RetrieveEmailCardProps) {
  return (
    <EndpointCard
      method='get'
      path='/api/emails/:id'
      description='Fetch a single email by id.'
      delay='160ms'
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
      <PrimaryButton onClick={onSubmit} disabled={loading} compact>
        {loading ? 'Fetching...' : 'Retrieve Email'}
      </PrimaryButton>
    </EndpointCard>
  )
}

export default RetrieveEmailCard
