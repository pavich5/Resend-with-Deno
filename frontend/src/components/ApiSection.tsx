import type { PropsWithChildren } from 'react'

function ApiSection({ children }: PropsWithChildren) {
  return (
    <section className='section'>
      <div className='section-title'>
        <h2>Try the API</h2>
        <p>
          Each panel sends a real request to your local backend and prints the
          response as JSON so clients can see exactly what happens.
        </p>
      </div>
      <div className='endpoint-grid'>{children}</div>
    </section>
  )
}

export default ApiSection
