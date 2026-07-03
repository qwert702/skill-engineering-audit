import { connectToDatabase } from '../config';  // ⚠️ 可能导致循环依赖

interface Order {
  id: number;
  userId: number;
  total: number;
}

// 🟠 漏洞 3: N+1 查询
export async function getOrdersForAllUsers() {
  const users = await fetchUsers();

  // ❌ 循环中逐个查询
  const allOrders = [];
  for (const user of users) {
    // 每次循环都查询一次数据库
    const orders = await fetchOrdersByUser(user.id);
    allOrders.push(...orders);
  }
  return allOrders;
}

// 🟡 魔术数字
export function calculateDiscount(amount: number): number {
  if (amount > 1000) {
    return amount * 0.1;   // 10% 折扣
  } else if (amount > 500) {
    return amount * 0.05;  // 5% 折扣
  } else if (amount > 100) {
    return amount * 0.02;  // 2% 折扣
  }
  return 0;
}

// 🟡 重复逻辑 — 与下面 getOrdersByStatus 高度相似
export async function getOrdersByUser(userId: number): Promise<Order[]> {
  const results = await fetch('/api/orders?userId=' + userId);
  return results.json();
}

// 重复逻辑
export async function getOrdersByStatus(status: string): Promise<Order[]> {
  const results = await fetch('/api/orders?status=' + status);
  return results.json();
}

async function fetchUsers(): Promise<{ id: number }[]> {
  return [{ id: 1 }, { id: 2 }, { id: 3 }];
}

async function fetchOrdersByUser(userId: number): Promise<Order[]> {
  return [];
}
