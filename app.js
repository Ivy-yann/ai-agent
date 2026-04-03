const form = document.getElementById('configForm');
const logs = document.getElementById('logs');
const clearLogsBtn = document.getElementById('clearLogs');
const chatRoot = document.getElementById('chatRoot');
const snippet = document.getElementById('snippet');

function appendLog(message, type = 'info') {
  const li = document.createElement('li');
  li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  if (type === 'error') li.classList.add('error');
  logs.prepend(li);
}

function getConfigFromForm() {
  const formData = new FormData(form);
  return {
    botId: formData.get('botId')?.toString().trim(),
    token: formData.get('token')?.toString().trim(),
    userId: formData.get('userId')?.toString().trim(),
    theme: formData.get('theme')?.toString(),
    useIframe: Boolean(formData.get('useIframe')),
  };
}

function renderSnippet(config) {
  const json = JSON.stringify(
    {
      type: 'bot',
      bot_id: config.botId,
      user_id: config.userId || 'debug-user',
      isIframe: config.useIframe,
      theme: config.theme,
      token: config.token ? '***' : '',
    },
    null,
    2
  );

  snippet.textContent = `// 初始化示例\nconst config = ${json};\n\nnew CozeWebSDK.WebChatClient({\n  config: {\n    bot_id: config.bot_id\n  },\n  auth: config.token ? { type: 'token', token: config.token } : undefined\n});`;
}

function mountChat(config) {
  chatRoot.innerHTML = '';
  const mountPoint = document.createElement('div');
  mountPoint.id = 'coze-chat-mount';
  mountPoint.style.width = '100%';
  mountPoint.style.height = '100%';
  chatRoot.appendChild(mountPoint);

  if (!window.CozeWebSDK || !window.CozeWebSDK.WebChatClient) {
    throw new Error('Chat SDK 未加载成功，请检查网络或 SDK 地址。');
  }

  const clientConfig = {
    config: {
      bot_id: config.botId,
      user_id: config.userId || `debug-${Date.now()}`,
      isIframe: config.useIframe,
      theme: config.theme,
    },
    componentProps: {
      container: '#coze-chat-mount',
    },
  };

  if (config.token) {
    clientConfig.auth = {
      type: 'token',
      token: config.token,
      onRefreshToken: function () {
        appendLog('触发 token 刷新，请在 app.js 中对接后端 token 服务。');
        return Promise.resolve(config.token);
      },
    };
  }

  new window.CozeWebSDK.WebChatClient(clientConfig);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const config = getConfigFromForm();

  if (!config.botId) {
    appendLog('Bot ID 不能为空。', 'error');
    return;
  }

  renderSnippet(config);

  try {
    mountChat(config);
    appendLog(`聊天组件已启动，Bot ID=${config.botId}`);
  } catch (error) {
    appendLog(error.message || '初始化失败', 'error');
  }
});

clearLogsBtn.addEventListener('click', () => {
  logs.innerHTML = '';
  appendLog('日志已清空');
});

appendLog('页面已加载，等待配置。');
renderSnippet({
  botId: '<BOT_ID>',
  token: '',
  userId: 'debug-user-001',
  theme: 'light',
  useIframe: true,
});
