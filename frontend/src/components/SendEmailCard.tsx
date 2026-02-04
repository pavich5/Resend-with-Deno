import type { ApiResponse } from '../api/client'
import EndpointCard from './EndpointCard'
import Field from './Field'
import PrimaryButton from './PrimaryButton'

type SendEmailCardProps = {
  from: string
  to: string
  subject: string
  html: string
  scheduledAt: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onSubjectChange: (value: string) => void
  onHtmlChange: (value: string) => void
  onScheduledAtChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  result: ApiResponse | null
}

function SendEmailCard({
  from,
  to,
  subject,
  html,
  scheduledAt,
  onFromChange,
  onToChange,
  onSubjectChange,
  onHtmlChange,
  onScheduledAtChange,
  onSubmit,
  loading,
  result,
}: SendEmailCardProps) {
  return (
    <EndpointCard
      method='post'
      path='/api/emails/send'
      description='Send a new email or schedule delivery.'
      delay='80ms'
      result={result}
    >
      <div className='form-grid'>
        <Field label='From'>
          <input
            type='email'
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
          />
        </Field>
        <Field label='To'>
          <input
            type='email'
            value={to}
            onChange={(event) => onToChange(event.target.value)}
          />
        </Field>
        <Field label='Subject' full>
          <input
            type='text'
            value={subject}
            onChange={(event) => onSubjectChange(event.target.value)}
          />
        </Field>
        <Field label='HTML' full>
          <textarea
            rows={3}
            value={html}
            onChange={(event) => onHtmlChange(event.target.value)}
          />
        </Field>
        <Field label='Scheduled At (optional)' full>
          <input
            type='text'
            value={scheduledAt}
            onChange={(event) => onScheduledAtChange(event.target.value)}
            placeholder='in 10 min or 2026-05-01T10:00:00Z'
          />
        </Field>
      </div>
      <PrimaryButton onClick={onSubmit} disabled={loading}>
        {loading ? 'Sending...' : 'Send Email'}
      </PrimaryButton>
    </EndpointCard>
  )
}

export default SendEmailCard
