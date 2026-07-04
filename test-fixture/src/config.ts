/**
 * 应用配置模块
 * 所有敏感值应从环境变量读取，严禁硬编码
 */

// 🔴 漏洞 1 (已修复): JWT Secret 从环境变量读取
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET 环境变量未设置或强度不足（至少 32 字符）\n' +
      '生成命令: openssl rand -base64 64'
    );
  }
  return secret;
}

// 🔴 漏洞 2 (已修复): 数据库密码从环境变量读取
export function getDbConfig(): Readonly<{
  host: string;
  user: string;
  password: string;
  database: string;
}> {
  const password = process.env.DB_PASSWORD;
  if (!password) {
    throw new Error('DB_PASSWORD 环境变量未设置');
  }
  return Object.freeze({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'myapp_user',
    password,
    database: process.env.DB_NAME || 'myapp',
  });
}

// 🟡 (已修复): 移除无意义函数名 foo，改为有语义名称
export function identity<T>(data: T): T {
  return data;
}

export async function connectToDatabase(): Promise<void> {
  const config = getDbConfig();
  try {
    // 假装连接数据库
    console.log(`Connecting to database at ${config.host}...`);
  } catch (err) {
    // 🛡️ (已修复): 记录错误并重新抛出，避免静默吞没
    console.error('数据库连接失败:', err instanceof Error ? err.message : String(err));
    throw new Error('数据库连接失败，请检查配置');
  }
}
