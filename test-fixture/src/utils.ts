import fs from 'fs';
import path from 'path';

// 🟠 圈复杂度 22 — if/else if 链
export function processOrder(
  orderType: string,
  amount: number,
  isVip: boolean,
  isFirstOrder: boolean,
  couponCode: string | null,
  region: string,
  paymentMethod: string
): number {
  let discount = 0;

  if (orderType === 'electronics') {
    if (amount > 1000) {
      if (isVip) {
        discount = 0.2;
      } else {
        discount = 0.15;
      }
    } else if (amount > 500) {
      discount = 0.1;
    } else {
      discount = 0.05;
    }
  } else if (orderType === 'clothing') {
    if (amount > 500) {
      discount = 0.15;
    } else if (amount > 200) {
      discount = 0.1;
    } else {
      discount = 0.05;
    }
  } else if (orderType === 'food') {
    if (isFirstOrder) {
      discount = 0.3;
    } else {
      discount = 0.05;
    }
  } else {
    discount = 0;
  }

  // 优惠券叠加
  if (couponCode) {
    if (couponCode === 'VIP2024') {
      discount += 0.05;
    } else if (couponCode === 'NEWUSER') {
      discount += 0.1;
    } else if (couponCode === 'HOLIDAY') {
      discount += 0.15;
    } else if (couponCode === 'BLACKFRIDAY') {
      discount += 0.25;
    }
  }

  // 地区特殊折扣
  if (region === 'US') {
    // 无额外折扣
  } else if (region === 'EU') {
    discount -= 0.02; // 税
  } else if (region === 'CN') {
    if (paymentMethod === 'alipay') {
      discount += 0.02;
    } else if (paymentMethod === 'wechat') {
      discount += 0.01;
    }
  }

  // 空 catch 块
  try {
    fs.writeFileSync('/tmp/order.log', `Order processed: ${amount}`);
  } catch (err) {
    // ❌ 什么都不做
  }

  return Math.max(0, amount * (1 - discount));
}

// 与 processOrder 有部分重复逻辑
export function calculateRefund(orderType: string, amount: number, daysSincePurchase: number): number {
  // 重复的条件判断
  if (daysSincePurchase <= 7) {
    if (orderType === 'electronics') {
      return amount * 0.9;  // 10% 手续费
    } else if (orderType === 'clothing') {
      return amount;        // 全额退款
    }
  } else if (daysSincePurchase <= 30) {
    return amount * 0.5;
  }
  return 0;
}

// ❌ HACK: 快速修复，后续需要重写
// HACK: 硬编码的汇率，应该接入实时汇率 API
export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === 'USD' && to === 'CNY') return amount * 7.2;
  if (from === 'CNY' && to === 'USD') return amount / 7.2;
  if (from === 'USD' && to === 'EUR') return amount * 0.92;
  if (from === 'EUR' && to === 'USD') return amount / 0.92;
  // FIXME: 缺少其他货币对
  return amount;
}
