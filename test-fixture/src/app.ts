/**
 * 应用入口
 * 修复未使用导入、魔术数字/TODO
 */
import express from 'express';
import { connectToDatabase } from './config';

const app = express();

// 🟡 (已修复): 抽取魔术数字为命名常量
/** 请求超时时间（毫秒）— 24 小时 */
const REQUEST_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 86400

app.set('timeout', REQUEST_TIMEOUT_MS);

// TODO: 添加错误处理中间件
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ✅ 新增: 全局错误处理中间件
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('未捕获的错误:', err.message);
  res.status(500).json({ error: '内部服务器错误' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
