import { JWT_SECRET } from './config';
import jwt from 'jsonwebtoken';

interface User {
  id: number;
  username: string;
  password: string;
}

// 🔴 漏洞 2: SQL 注入 — 用户输入直接拼接 SQL
export async function login(username: string, password: string): Promise<User | null> {
  // ❌ 直接拼接用户输入
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  // 假装执行查询
  console.log('Executing:', query);
  return null;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,     // 使用硬编码密钥
    { expiresIn: '7d' }
  );
}

// 🟡 未使用类型标注
export function processData(data) {
  return data.map(x => x.value);
}
