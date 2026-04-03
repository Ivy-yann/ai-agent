document.querySelector('#app').innerHTML = `
  <div style="max-width: 900px; margin: 0 auto; padding: 24px; font-family: Arial, sans-serif;">
    <h1 style="margin-bottom: 16px;">AI 客服测试</h1>

    <div style="border: 1px solid #ddd; border-radius: 12px; overflow: hidden;">
      <div id="chat"
        style="height: 500px; overflow-y: auto; padding: 16px; background: #fafafa;">
        <div style="margin-bottom: 12px;">
          <div style="display:inline-block; padding:10px 12px; border-radius:12px; background:#fff; border:1px solid #e5e5e5;">
            你好，我是 AI 客服，请输入你的问题。
          </div>
        </div>
      </div>

      <div style="display:flex; gap:8px; padding:12px; border-top:1px solid #eee; background:#fff;">
        <input id="input" placeholder="请输入问题..."
          style="flex:1; padding:12px; border:1px solid #ccc; border-radius:10px; font-size:14px;" />
        <button id="sendBtn"
          style="padding:12px 18px; border:none; border-radius:10px; cursor:pointer;">
          发送
        </button>
      </div>
    </div>

    <div id="status" style="margin-top:12px; color:#666;">状态：等待发送</div>
  </div>
`

const input = document.getElementById('input')
const sendBtn = document.getElementById('sendBtn')
const chat = document.getElementById('chat')
const status = document.getElementById('status')

let conversationId = ''

function appendMessage(role, text) {
  const wrap = document.createElement('div')
  wrap.style.marginBottom = '12px'
  wrap.style.display = 'flex'
  wrap.style.justifyContent = role === 'user' ? 'flex-end' : 'flex-start'

  const bubble = document.createElement('div')
  bubble.textContent = text
  bubble.style.maxWidth = '75%'
  bubble.style.padding = '10px 12px'
  bubble.style.borderRadius = '12px'
  bubble.style.whiteSpace = 'pre-wrap'
  bubble.style.wordBreak = 'break-word'

  if (role === 'user') {
    bubble.style.background = '#111'
    bubble.style.color = '#fff'
  } else {
    bubble.style.background = '#fff'
    bubble.style.color = '#111'
    bubble.style.border = '1px solid #e5e5e5'
  }

  wrap.appendChild(bubble)
  chat.appendChild(wrap)
  chat.scrollTop = chat.scrollHeight
  return bubble
}

async function sendMessage() {
  const text = input.value.trim()
  if (!text) return

  appendMessage('user', text)
  input.value = ''
  status.textContent = '状态：正在请求 Coze...'
  const loadingBubble = appendMessage('bot', '正在回复...')

  try {
    const res = await fetch('http://localhost:3000/api/coze-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, conversationId }),
    })

    const data = await res.json()

    if (!res.ok) {
      loadingBubble.textContent = '请求失败：' + JSON.stringify(data)
      status.textContent = '状态：失败'
      return
    }

    if (data.conversationId) {
      conversationId = data.conversationId
    }

    loadingBubble.textContent = data.reply || '没有回复内容'
    status.textContent = '状态：成功'
  } catch (err) {
    loadingBubble.textContent = '请求异常：' + err.message
    status.textContent = '状态：异常'
  }
}

sendBtn.addEventListener('click', sendMessage)
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage()
  }
})
