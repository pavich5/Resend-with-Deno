import { useMemo, useState } from 'react'
import './App.css'
import type { ApiResponse } from './api/client.ts'
import { emptyResponse } from './api/client.ts'
import {
  cancelEmail,
  listEmails,
  pingServer,
  rescheduleEmail,
  retrieveEmail,
  sendEmail,
  type SendEmailPayload,
} from './api/emailApi.ts'
import ApiSection from './components/ApiSection.tsx'
import CancelEmailCard from './components/CancelEmailCard.tsx'
import HeroSection from './components/HeroSection.tsx'
import ListEmailsCard from './components/ListEmailsCard.tsx'
import RescheduleEmailCard from './components/RescheduleEmailCard.tsx'
import RetrieveEmailCard from './components/RetrieveEmailCard.tsx'
import SendEmailCard from './components/SendEmailCard.tsx'

function App() {
  const [baseUrl, setBaseUrl] = useState('http://localhost:8000')
  const normalizedBase = useMemo(
    () => baseUrl.trim().replace(/\/+$/, ''),
    [baseUrl],
  )
  const apiBase = normalizedBase ? `${normalizedBase}/api` : ''

  const [pingResult, setPingResult] = useState<ApiResponse | null>(null)
  const [pingLoading, setPingLoading] = useState(false)

  const [listLimit, setListLimit] = useState('20')
  const [listSkip, setListSkip] = useState('')
  const [listTake, setListTake] = useState('')
  const [listResult, setListResult] = useState<ApiResponse | null>(null)
  const [listLoading, setListLoading] = useState(false)

  const [sendFrom, setSendFrom] = useState('onboarding@resend.dev')
  const [sendTo, setSendTo] = useState('antonio.pavikj@ludotech.co')
  const [sendSubject, setSendSubject] = useState('Hello from Resend')
  const [sendTemplateId, setSendTemplateId] = useState('your-template-id')
  const [sendVariables, setSendVariables] = useState('{"PRODUCT":"Laptop"}')
  const [sendScheduledAt, setSendScheduledAt] = useState('')
  const [sendResult, setSendResult] = useState<ApiResponse | null>(null)
  const [sendLoading, setSendLoading] = useState(false)

  const [emailId, setEmailId] = useState('')
  const [retrieveResult, setRetrieveResult] = useState<ApiResponse | null>(null)
  const [retrieveLoading, setRetrieveLoading] = useState(false)

  const [cancelResult, setCancelResult] = useState<ApiResponse | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const [rescheduleAt, setRescheduleAt] = useState('in 2 min')
  const [rescheduleResult, setRescheduleResult] = useState<ApiResponse | null>(null)
  const [rescheduleLoading, setRescheduleLoading] = useState(false)

  const handlePing = async () => {
    if (!normalizedBase) {
      setPingResult(emptyResponse('Add a server URL first.'))
      return
    }
    setPingLoading(true)
    setPingResult(await pingServer(normalizedBase))
    setPingLoading(false)
  }

  const handleList = async () => {
    if (!apiBase) {
      setListResult(emptyResponse('Add a server URL first.'))
      return
    }
    setListLoading(true)
    setListResult(
      await listEmails(apiBase, {
        limit: listLimit,
        skip: listSkip,
        take: listTake,
      }),
    )
    setListLoading(false)
  }

  const handleSend = async () => {
    if (!apiBase) {
      setSendResult(emptyResponse('Add a server URL first.'))
      return
    }
    const templateId = sendTemplateId.trim()
    if (!templateId) {
      setSendResult(emptyResponse('Template ID is required.'))
      return
    }
    const variablesInput = sendVariables.trim()
    let variables: Record<string, string | number> | undefined
    if (variablesInput.length > 0) {
      try {
        const parsed = JSON.parse(variablesInput)
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          setSendResult(emptyResponse('Variables must be a JSON object.'))
          return
        }
        for (const value of Object.values(parsed)) {
          const valueType = typeof value
          if (valueType !== 'string' && valueType !== 'number') {
            setSendResult(
              emptyResponse('Variables values must be strings or numbers.'),
            )
            return
          }
        }
        variables = parsed as Record<string, string | number>
      } catch {
        setSendResult(emptyResponse('Variables must be valid JSON.'))
        return
      }
    }
    setSendLoading(true)
    const payload: SendEmailPayload = {
      from: sendFrom,
      to: sendTo,
      subject: sendSubject,
      template_id: templateId,
    }
    if (variables) {
      payload.variables = variables
    }
    if (sendScheduledAt.trim().length > 0) {
      payload.scheduledAt = sendScheduledAt.trim()
    }
    setSendResult(await sendEmail(apiBase, payload))
    setSendLoading(false)
  }

  const handleRetrieve = async () => {
    if (!apiBase) {
      setRetrieveResult(emptyResponse('Add a server URL first.'))
      return
    }
    if (!emailId.trim()) {
      setRetrieveResult(emptyResponse('Enter an email id first.'))
      return
    }
    setRetrieveLoading(true)
    setRetrieveResult(await retrieveEmail(apiBase, emailId.trim()))
    setRetrieveLoading(false)
  }

  const handleCancel = async () => {
    if (!apiBase) {
      setCancelResult(emptyResponse('Add a server URL first.'))
      return
    }
    if (!emailId.trim()) {
      setCancelResult(emptyResponse('Enter an email id first.'))
      return
    }
    setCancelLoading(true)
    setCancelResult(await cancelEmail(apiBase, emailId.trim()))
    setCancelLoading(false)
  }

  const handleReschedule = async () => {
    if (!apiBase) {
      setRescheduleResult(emptyResponse('Add a server URL first.'))
      return
    }
    if (!emailId.trim()) {
      setRescheduleResult(emptyResponse('Enter an email id first.'))
      return
    }
    setRescheduleLoading(true)
    setRescheduleResult(
      await rescheduleEmail(apiBase, emailId.trim(), rescheduleAt),
    )
    setRescheduleLoading(false)
  }

  return (
    <div className='page'>
      <HeroSection
        baseUrl={baseUrl}
        onBaseUrlChange={setBaseUrl}
        onPing={handlePing}
        pingLoading={pingLoading}
        pingResult={pingResult}
      />

      <ApiSection>
        <ListEmailsCard
          listLimit={listLimit}
          listSkip={listSkip}
          listTake={listTake}
          onLimitChange={setListLimit}
          onSkipChange={setListSkip}
          onTakeChange={setListTake}
          onSubmit={handleList}
          loading={listLoading}
          result={listResult}
        />

        <SendEmailCard
          from={sendFrom}
          to={sendTo}
          subject={sendSubject}
          templateId={sendTemplateId}
          variables={sendVariables}
          scheduledAt={sendScheduledAt}
          onFromChange={setSendFrom}
          onToChange={setSendTo}
          onSubjectChange={setSendSubject}
          onTemplateIdChange={setSendTemplateId}
          onVariablesChange={setSendVariables}
          onScheduledAtChange={setSendScheduledAt}
          onSubmit={handleSend}
          loading={sendLoading}
          result={sendResult}
        />

        <RetrieveEmailCard
          emailId={emailId}
          onEmailIdChange={setEmailId}
          onSubmit={handleRetrieve}
          loading={retrieveLoading}
          result={retrieveResult}
        />

        <CancelEmailCard
          emailId={emailId}
          onEmailIdChange={setEmailId}
          onSubmit={handleCancel}
          loading={cancelLoading}
          result={cancelResult}
        />

        <RescheduleEmailCard
          emailId={emailId}
          scheduledAt={rescheduleAt}
          onEmailIdChange={setEmailId}
          onScheduledAtChange={setRescheduleAt}
          onSubmit={handleReschedule}
          loading={rescheduleLoading}
          result={rescheduleResult}
        />
      </ApiSection>
    </div>
  )
}

export default App
