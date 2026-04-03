# Coze 聊天代理 Demo（前端自写聊天框 + 后端代理）

## 已完成内容

- `server.js`：Express 后端代理 Coze API（`/api/coze-chat`）。
- `.env`：放置 `COZE_TOKEN` 和 `COZE_BOT_ID`。
- `src/main.js`：前端手写聊天框，直接请求本地后端。
- `package.json`：已包含 `"type": "module"` 以及 Vite/后端脚本。

## 启动方式

> 需要两个终端窗口。

### 窗口 1（前端）

```bash
npm run dev
```

### 窗口 2（后端）

```bash
node server.js
```

打开：<http://localhost:5173>

## 常见报错

1. 前端显示“请求失败”：后端可能未启动。
2. 后端返回 401：`.env` 中 `COZE_TOKEN` 可能错误。
3. 后端返回 403/404：可能是 Bot 未发布、Bot ID 错误或权限不足。
