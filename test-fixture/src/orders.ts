/**
 * 订单模块
 * 修复 N+1 查询、URL 注入、魔术数字、重复逻辑
 */
import { connectToDatabase } from './config';  // 注意：实际应移到 db.ts 避免循环依赖

export interface Order {
  id: number;
  userId: number;
  total: number;
}

// 折扣率常量（已修复: 抽取魔术数字）
const DISCOUNT_RATES = {
  HIGH_VALUE: 0.1,    // 满 1000 享 10% 折扣
  MEDIUM_VALUE: 0.05, // 满 500 享 5% 折扣
  LOW_VALUE: 0.02,    // 满 100 享 2% 折扣
} as const;

const DISCOUNT_THRESHOLDS = {
  HIGH: 1000,
  MEDIUM: 500,
  LOW: 100,
} as const;

// 🟠 (已修复): N+1 查询 → 改用 IN 查询一次获取
export async function getOrdersForAllUsers(): Promise<Order[]> {
  const users = await fetchUsers();
  if (users.length === 0) return [];

  // ✅ 批量查询，避免 N+1
  const userIds = users.map((u) => u.id);
  return batchFetchOrdersByUserIds(userIds);
}

// 🟡 (已修复): 抽取魔术数字为命名常量
export function calculateDiscount(amount: number): number {
  if (amount > DISCOUNT_THRESHOLDS.HIGH) {
    return amount * DISCOUNT_RATES.HIGH_VALUE;
  }
  if (amount > DISCOUNT_THRESHOLDS.MEDIUM) {
    return amount * DISCOUNT_RATES.MEDIUM_VALUE;
  }
  if (amount > DISCOUNT_THRESHOLDS.LOW) {
    return amount * DISCOUNT_RATES.LOW_VALUE;
  }
  return 0;
}

// 🟡 (已修复): 使用 URL 构造函数，禁止字符串拼接
export async function getOrdersByUser(userId: number): Promise<Order[]> {
  const url = new URL('/api/orders', 'http://localhost');
  url.searchParams.set('userId', String(userId));
  const response = await fetch(url.toString());
  return response.json();
}

// 🟡 (已修复): 同上，使用 URL 构造函数
export async function getOrdersByStatus(status: string): Promise<Order[]> {
  const url = new URL('/api/orders', 'http://localhost');
  url.searchParams.set('status', status);
  const response = await fetch(url.toString());
  return response.json();
}

async function fetchUsers(): Promise<Pick<Order, 'id'>[]> {
  return [{ id: 1 }, { id: 2 }, { id: 3 }];
}

async function batchFetchOrdersByUserIds(userIds: number[]): Promise<Order[]> {
  // ✅ 模拟批量查询，实际应使用:
  // const placeholders = userIds.map(() => '?').join(',');
  // const [rows] = await db.execute(`SELECT * FROM orders WHERE user_id IN (${placeholders})`, userIds);
  return [];
}
