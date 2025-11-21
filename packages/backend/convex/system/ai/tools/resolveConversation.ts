import { createTool } from '@convex-dev/agent'
import { z } from 'zod'
import { internal } from '../../../_generated/api'

export const resolveConversation = createTool({
  description: 'Resolve a conversation when the user\'s issue has been completely addressed and they are satisfied with the help provided.',
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return 'Missing thread Id'
    }

    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    })

    return 'Conversation resolved. Let the user know their issue has been resolved and thank them for contacting support.'
  },
})
