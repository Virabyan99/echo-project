'use client'

import { screenAtom } from '../../atoms/widget-atoms'
import { WidgetAuthScreen } from '../screens/widget-auth-screen'
import { useAtomValue } from 'jotai'
import { WidgetErrorScreen } from '../screens/widget-error-screen'
import { WidgetLoadingScreen } from '../screens/widget-loading-screen'

interface Props {
  organizationId: string | null
}

export const WidgetView = ({ organizationId }: Props) => {

  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    error: <WidgetErrorScreen/>,
    auth: <WidgetAuthScreen/>,
    voice: <p>TODO</p>,
    inbox: <p>TODO</p>,
    selection: <p>TODO</p>,
    chat: <p>TODO</p>,
    contact: <p>TODO</p>

  }

  return (
    // TODO: confirm wether min-h-screen, min-w-screen is necessary
    <main className=" min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  )
}
