export type ApiResponse = {
  ok: boolean
  status: number
  durationMs: number
  data: unknown
  error?: string
}

export const emptyResponse = (message: string): ApiResponse => ({
  ok: false,
  status: 0,
  durationMs: 0,
  data: null,
  error: message,
})

export const buildQuery = (params: Record<string, string>) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value.trim().length > 0) {
      search.set(key, value.trim())
    }
  })
  const query = search.toString()
  return query.length > 0 ? `?${query}` : ''
}

export async function callApi(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse> {
  const start = Date.now()
  try {
    const response = await fetch(url, options)
    const text = await response.text()
    let data: unknown = null

    if (text.length > 0) {
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      durationMs: Date.now() - start,
      data,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return {
      ok: false,
      status: 0,
      durationMs: Date.now() - start,
      data: null,
      error: message,
    }
  }
}
