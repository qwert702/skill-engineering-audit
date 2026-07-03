import fs from 'fs'; // 未使用的导入

// 🔴 漏洞 1: JWT Secret 硬编码
export const JWT_SECRET = 'my-secret-key-12345';

// 数据库配置也硬编码了
export const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'password123', // 🔴 硬编码密码
  database: 'myapp',
};

// 🟡 函数命名含义不明
export function foo(data: any): any {
  return data;
}

export function connectToDatabase() {
  // 空 catch — 静默吞没错误
  try {
    // 假装连接数据库
    console.log('Connecting to database...');
  } catch (err) {
    // ❌ 空 catch 块，什么都不做
  }
}
