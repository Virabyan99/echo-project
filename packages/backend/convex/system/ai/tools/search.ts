import { openai } from '@ai-sdk/openai'
import { createTool } from '@convex-dev/agent'
import { generateText } from 'ai'
import { z } from 'zod'
import { internal } from '../../../_generated/api'
import rag from '../rag'
import { SEARCH_INTERPRETER_PROMPT } from '../constants'

export const search = createTool({
  description:
    'Search the knowledge base for relevant information to help answer user questions',
  args: z.object({
    query: z.string().describe('The Search query to find relevant Information'),
  }),
  handler: async (cxt, args) => {
    if (!cxt.threadId) {
      return 'Missing thread Id'
    }

    const conversation = await cxt.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: cxt.threadId }
    )

    if (!conversation) {
      return 'Conversation not found'
    }

    const orgId = conversation.organizationId

    const searchResult = await rag.search(cxt, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    })

    const contextText = `Found Results in ${searchResult.entries
      .map((e) => e.title || null)
      .filter((t) => t !== null)
      .join(', ')}. Here is the Context:\n\n${searchResult.text}`

    const response = await generateText({
      messages: [
        {
          role: 'system',
          content: SEARCH_INTERPRETER_PROMPT,
        },
        {
          role: 'user',
          content: `User asked "${args.query}"\n\nSearch Results ${contextText}`,
        },
      ],
      model: openai.chat('gpt-4o-mini'),
    })

    return response.text
  },
})
