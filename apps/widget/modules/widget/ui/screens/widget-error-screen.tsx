'use client'

import { useAtomValue } from 'jotai'
import { AlertTriangleIcon } from 'lucide-react'
import { errorMessageAtom } from '../../atoms/widget-atoms'
import { WidgetHeader } from '../components/widget-header'

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom)

  return (
    <>
      <WidgetHeader>
        <div className="flex font-semibold flex-col justify-between gap-y-2 px-2 py-6">
          <p className=" text-3xl">Hi there!👋</p>
          <p className=" text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <AlertTriangleIcon className="h-12 w-12" />
        <p className="text-sm">{errorMessage || 'Invalid Configuration'}</p>
      </div>
    </>
  )
}
