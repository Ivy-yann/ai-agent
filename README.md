# AI 客服接入与调试网站

这是一个轻量级静态页面，用于快速接入并调试 Coze Chat SDK。

## 使用方式

1. 直接打开 `index.html`（或用本地静态服务启动）。
2. 填写 `Bot ID`，可选填写 token 与 userId。
3. 点击“启动聊天组件”。
4. 在右侧查看聊天预览和运行日志。

## 本地启动

```bash
python3 -m http.server 8080
```

访问 <http://localhost:8080>。

## 说明

- 页面会自动生成当前配置对应的初始化代码片段，便于复制到业务项目。
- 若使用 token 鉴权，`onRefreshToken` 需要替换为你自己的后端刷新逻辑。
