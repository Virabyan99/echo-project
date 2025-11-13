import { ConvexError, v } from 'convex/values'
import { mutation, query } from '../_generated/server'
import { supportAgent } from '../system/ai/agents/supportAgent'
import { saveMessage } from '@convex-dev/agent'
import { components } from '../_generated/api'

export const getOne = query({
  args: {
    conversationId: v.id('conversations'),
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId)
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid Session',
      })
    }

    const conversation = await ctx.db.get(args.conversationId)

    if (!conversation) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Conversation Not Found',
      })
    }

    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect Session',
      })
    }

    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    }
  },
})

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId)
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid Session',
      })
    }

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    })

    await saveMessage(ctx, components.agent, {
      threadId: threadId,
      message: {
        role: "assistant",
        // TODO: Later modify to widget settings initial message
        content: "Hello! How can we assist you today?"
      },
    })

    const conversationId = await ctx.db.insert('conversations', {
      contactSessionId: session._id,
      status: 'unresolved',
      organizationId: args.organizationId,
      threadId: threadId,
    })
    return conversationId
  },
})
