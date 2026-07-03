import http from 'http'; // 未使用的导入
import express from 'express';
import { connectToDatabase } from './config';

const app = express();
const PORT = 3000;

// 魔术数字: 86400 代表什么？应该命名
app.set('timeout', 86400);

// TODO: 添加错误处理中间件
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
