import { connectToDatabase } from './config';

// 与 orders.ts 的 getOrdersByUser / getOrdersByStatus 重复逻辑
export async function fetchUserData(userId: number): Promise<any> {
  const results = await fetch('/api/users?userId=' + userId);
  return results.json();
}

export async function fetchProductData(productId: number): Promise<any> {
  const results = await fetch('/api/products?productId=' + productId);
  return results.json();
}

// 🔵 重复的 JSON.parse
export function parseConfig(configStr: string): any {
  const parsed = JSON.parse(configStr);  // 热路径中重复
  // 处理...
  return JSON.parse(JSON.stringify(parsed));  // 深拷贝，效率低
}

// 未使用的导出
export const UNUSED_CONSTANT = 'this is never used anywhere';
