import type { CSSProperties, PropsWithChildren } from 'react'
import type { ApiResponse } from '../api/client'
import ResponsePanel from './ResponsePanel'

type EndpointCardProps = PropsWithChildren<{
  method: 'get' | 'post' | 'patch'
  path: string
  description: string
  delay?: string
  result: ApiResponse | null
}>

function EndpointCard({
  method,
  path,
  description,
  delay,
  result,
  children,
}: EndpointCardProps) {
  const style = delay
    ? ({ '--delay': delay } as CSSProperties)
    : undefined

  return (
    <article className='card' style={style}>
      <div className='card-head'>
        <span className={`method ${method}`}>{method.toUpperCase()}</span>
        <h3>{path}</h3>
      </div>
      <p className='card-desc'>{description}</p>
      {children}
      <ResponsePanel result={result} />
    </article>
  )
}

export default EndpointCard
