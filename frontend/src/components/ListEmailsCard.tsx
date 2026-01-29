import type { ApiResponse } from '../api/client'
import EndpointCard from './EndpointCard'
import Field from './Field'
import PrimaryButton from './PrimaryButton'

type ListEmailsCardProps = {
  listLimit: string
  listSkip: string
  listTake: string
  onLimitChange: (value: string) => void
  onSkipChange: (value: string) => void
  onTakeChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  result: ApiResponse | null
}

function ListEmailsCard({
  listLimit,
  listSkip,
  listTake,
  onLimitChange,
  onSkipChange,
  onTakeChange,
  onSubmit,
  loading,
  result,
}: ListEmailsCardProps) {
  return (
    <EndpointCard
      method='get'
      path='/api/emails'
      description='List sent emails with optional pagination.'
      delay='0ms'
      result={result}
    >
      <div className='form-grid'>
        <Field label='Limit'>
          <input
            type='number'
            min='1'
            max='100'
            value={listLimit}
            onChange={(event) => onLimitChange(event.target.value)}
            placeholder='20'
          />
        </Field>
        <Field label='Skip'>
          <input
            type='number'
            min='0'
            max='100'
            value={listSkip}
            onChange={(event) => onSkipChange(event.target.value)}
            placeholder='0'
          />
        </Field>
        <Field label='Take'>
          <input
            type='number'
            min='1'
            max='100'
            value={listTake}
            onChange={(event) => onTakeChange(event.target.value)}
            placeholder='20'
          />
        </Field>
      </div>
      <PrimaryButton onClick={onSubmit} disabled={loading} compact>
        {loading ? 'Loading...' : 'Fetch Emails'}
      </PrimaryButton>
    </EndpointCard>
  )
}

export default ListEmailsCard
