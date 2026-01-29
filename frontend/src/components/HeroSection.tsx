import type { ApiResponse } from '../api/client'
import Field from './Field'
import PrimaryButton from './PrimaryButton'
import ResponsePanel from './ResponsePanel'

type HeroSectionProps = {
  baseUrl: string
  onBaseUrlChange: (value: string) => void
  onPing: () => void
  pingLoading: boolean
  pingResult: ApiResponse | null
}

function HeroSection({
  baseUrl,
  onBaseUrlChange,
  onPing,
  pingLoading,
  pingResult,
}: HeroSectionProps) {
  return (
    <header className='hero'>
      <div className='hero-copy'>
        <span className='badge'>Resend + Deno + Hono</span>
        <h1>Resend API Explorer</h1>
        <p>
          A clean, lightweight UI to walk clients through the email endpoints.
          Adjust the server URL, run a request, and review the exact payload and
          response.
        </p>
        <div className='base-row'>
          <Field label='Server URL'>
            <input
              type='url'
              value={baseUrl}
              onChange={(event) => onBaseUrlChange(event.target.value)}
              placeholder='http://localhost:8000'
            />
          </Field>
          <PrimaryButton onClick={onPing} disabled={pingLoading}>
            {pingLoading ? 'Pinging...' : 'Ping Server'}
          </PrimaryButton>
        </div>
        <ResponsePanel result={pingResult} />
      </div>
      <div className='hero-panel'>
        <h2>Endpoints at a glance</h2>
        <ul>
          <li>
            <span className='method get'>GET</span>
            <span>/api/emails</span>
            <span>List emails</span>
          </li>
          <li>
            <span className='method post'>POST</span>
            <span>/api/emails/send</span>
            <span>Send/Schedule</span>
          </li>
          <li>
            <span className='method get'>GET</span>
            <span>/api/emails/:id</span>
            <span>Retrieve</span>
          </li>
          <li>
            <span className='method post'>POST</span>
            <span>/api/emails/:id/cancel</span>
            <span>Cancel</span>
          </li>
          <li>
            <span className='method patch'>PATCH</span>
            <span>/api/emails/:id</span>
            <span>Reschedule</span>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default HeroSection
