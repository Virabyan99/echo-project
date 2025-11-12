'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { LoaderIcon } from 'lucide-react'
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from '../../atoms/widget-atoms'
import { WidgetHeader } from '../components/widget-header'
import { useEffect, useState } from 'react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@workspace/backend/_generated/api'

type InitStep = 'session' | 'org' | 'settings' | 'vapi' | 'done'

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null
}) => {
  const [step, setStep] = useState<InitStep>('org')
  const [sessionValid, setSessionValid] = useState(false)

  const loadingMessage = useAtomValue(loadingMessageAtom)
  const setOrganizationId = useSetAtom(organizationIdAtom)
  const setLoadingMessage = useSetAtom(loadingMessageAtom)
  const setErrorMessage = useSetAtom(errorMessageAtom)
  const setScreen = useSetAtom(screenAtom)

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || '')
  )

  const validateOrganization = useAction(api.public.organizations.validate)

  // Step 1: Validate Organization
  useEffect(() => {
    if (step !== 'org') {
      return
    }

    setLoadingMessage('Finding Organization ID...')

    if (!organizationId) {
      setErrorMessage('Organization Id is required')
      setScreen('error')
      return
    }

    setLoadingMessage('Validating organization...')

    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId)
          setStep('session')
        } else {
          setErrorMessage(result.reason || 'Invalid Configuration')
          setScreen('error')
        }
      })
      .catch(() => {
        setErrorMessage('Failed to validate organization')
        setScreen('error')
      })
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setLoadingMessage,
    setOrganizationId,
    validateOrganization,
    setStep,
  ])

  // Step 2: Validate Session (if exists)
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  )

  useEffect(() => {
    if (step !== 'session') {
      return
    }

    setLoadingMessage('Finding Contact Session ID...')

    if (!contactSessionId) {
      setSessionValid(false)
      setStep('done')
      return
    }

    setLoadingMessage('Validating session...')

    validateContactSession({ contactSessionId })
      .then((result) => {
        setSessionValid(result.valid)
        setStep('done')
      })
      .catch(() => {
        setSessionValid(false)
        setStep('done')
      })
  }, [step, contactSessionId, validateContactSession, setLoadingMessage])

  useEffect(() => {
    if (step !== 'done') {
      return
    }

    const hasValidSession = contactSessionId && sessionValid
    setScreen(hasValidSession ? 'selection' : 'auth')
  }, [step, contactSessionId, sessionValid, setScreen])

  return (
    <>
      <WidgetHeader>
        <div className="flex font-semibold flex-col justify-between gap-y-2 px-2 py-6">
          <p className=" text-3xl">Hi there!👋</p>
          <p className=" text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || 'Loading...'}</p>
      </div>
    </>
  )
}
