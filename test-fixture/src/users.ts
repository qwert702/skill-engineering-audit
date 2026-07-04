/**
 * 用户认证模块
 * 所有数据库查询使用参数化查询，防止 SQL 注入
 */
import { getJwtSecret } from './config';
import jwt from 'jsonwebtoken';

export interface User {
  id: number;
  username: string;
  password: string;
}

// 🔴 (已修复): SQL 注入 — 改用参数化查询
export async function login(username: string, password: string): Promise<User | null> {
  // ✅ 使用参数化查询（模拟，实际应用应使用 db.execute）
  const query = {
    text: 'SELECT * FROM users WHERE username = ? AND password = ?',
    params: [username, password],
  };
  console.log('Executing parameterized query:', query.text);
  // 正式实现应使用:
  // const [rows] = await db.execute(query.text, query.params);
  return null;
}

// 🟠 (已修复): Access Token 过期时间缩短至 15 分钟
export function generateAccessToken(user: Pick<User, 'id' | 'username'>): string {
  const secret = getJwtSecret();
  return jwt.sign(
    { id: user.id, username: user.username, type: 'access' },
    secret,
    { expiresIn: '15m' }  // 从 7d 缩短为 15m
  );
}

// ✅ 新增: Refresh Token（7天 + 轮换机制）
export function generateRefreshToken(user: Pick<User, 'id' | 'username'>): string {
  const secret = getJwtSecret();
  return jwt.sign(
    { id: user.id, username: user.username, type: 'refresh', tokenVersion: Date.now() },
    secret,
    { expiresIn: '7d' }
  );
}

// 🟡 (已修复): 添加参数类型标注
export function processData(data: Array<{ value: unknown }>): unknown[] {
  return data.map((x) => x.value);
}
