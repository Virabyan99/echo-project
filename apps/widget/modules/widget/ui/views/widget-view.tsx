'use client'

import { WidgetFooter } from '../components/widget-footer'
import { WidgetHeader } from '../components/widget-header'

interface Props {
  organizationId: string
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    // TODO: confirm wether min-h-screen, min-w-screen is necessary
    <main className=" min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      <WidgetHeader>
        <div className="flex font-semibold flex-col justify-between gap-y-2 px-2 py-6">
          <p className=" text-3xl">Hi there!👋</p>
          <p className=" text-lg">How can we help you Today?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1">Widget view: ${organizationId}</div>
      <WidgetFooter />
    </main>
  )
}
