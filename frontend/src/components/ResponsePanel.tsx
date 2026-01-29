import type { ApiResponse } from '../api/client'

const formatResponse = (result: ApiResponse | null) => {
  if (!result) {
    return 'Run a request to see the response.'
  }
  return JSON.stringify(result, null, 2)
}

function ResponsePanel({ result }: { result: ApiResponse | null }) {
  return <pre className='response'>{formatResponse(result)}</pre>
}

export default ResponsePanel
