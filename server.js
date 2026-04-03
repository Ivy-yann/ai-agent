import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const COZE_TOKEN = process.env.COZE_TOKEN
const COZE_BOT_ID = process.env.COZE_BOT_ID

app.post('/api/coze-chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body || {}

    if (!COZE_TOKEN || !COZE_BOT_ID) {
      return res.status(500).json({ error: 'missing COZE_TOKEN or COZE_BOT_ID in .env' })
    }

    if (!message) {
      return res.status(400).json({ error: 'message is required' })
    }

    const payload = {
      bot_id: COZE_BOT_ID,
      user_id: 'web-user-001',
      stream: false,
      additional_messages: [
        {
          role: 'user',
          content: message,
          content_type: 'text',
        },
      ],
    }

    if (conversationId) {
      payload.conversation_id = conversationId
    }

    const response = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const raw = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'coze request failed',
        detail: raw,
      })
    }

    let reply = ''
    const newConversationId = raw?.data?.conversation_id || raw?.conversation_id || conversationId || ''

    if (Array.isArray(raw?.data?.messages)) {
      const assistantMsg = [...raw.data.messages]
        .reverse()
        .find((m) => m.role === 'assistant' || m.type === 'answer')

      reply = assistantMsg?.content || assistantMsg?.text || ''
    }

    if (!reply) {
      reply = raw?.data?.content || raw?.content || '没有解析到回复内容'
    }

    res.json({
      reply,
      conversationId: newConversationId,
      raw,
    })
  } catch (error) {
    res.status(500).json({
      error: 'server error',
      detail: error.message,
    })
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
