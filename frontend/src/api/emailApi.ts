import { buildQuery, callApi } from './client.ts'

export type SendEmailPayload = {
  from: string
  to: string
  subject: string
  html: string
  scheduledAt?: string
}

export type ListEmailsParams = {
  limit?: string
  skip?: string
  take?: string
}

export const pingServer = (baseUrl: string) => callApi(`${baseUrl}/`)

export const listEmails = (apiBase: string, params: ListEmailsParams) => {
  const query = buildQuery({
    limit: params.limit ?? '',
    skip: params.skip ?? '',
    take: params.take ?? '',
  })
  return callApi(`${apiBase}/emails${query}`)
}

export const sendEmail = (apiBase: string, payload: SendEmailPayload) =>
  callApi(`${apiBase}/emails/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

export const retrieveEmail = (apiBase: string, id: string) =>
  callApi(`${apiBase}/emails/${id}`)

export const cancelEmail = (apiBase: string, id: string) =>
  callApi(`${apiBase}/emails/${id}/cancel`, {
    method: 'POST',
  })

export const rescheduleEmail = (
  apiBase: string,
  id: string,
  scheduledAt: string,
) =>
  callApi(`${apiBase}/emails/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheduledAt }),
  })
