import { createTool } from '@convex-dev/agent'
import { z } from 'zod'
import { internal } from '../../../_generated/api'

export const escalateConversation = createTool({
  description:
    'Escalate a conversation to a human operator. Use this when the user explicitly asks to speak with a human or when you cannot adequately help them.',
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return 'Missing thread Id'
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    })

    return 'Conversation escalated to a human operator. Let the user know that a human operator will assist them shortly.'
  },
})
