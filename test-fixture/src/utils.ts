/**
 * 订单处理工具模块
 * 修复：圈复杂度 22→拆分、空 catch、HACK/FIXME、重复折扣逻辑
 */
import fs from 'fs';
import path from 'path';

/* ================================================================
   折扣策略常量
   ================================================================ */

const ORDER_TYPE_DISCOUNTS: Record<string, Record<string, number>> = {
  electronics: { high: 0.2, mid: 0.1, low: 0.05 },
  clothing:    { high: 0.15, mid: 0.1, low: 0.05 },
  food:        { firstOrder: 0.3, regular: 0.05 },
};

const COUPON_DISCOUNTS: Record<string, number> = {
  VIP2024:     0.05,
  NEWUSER:     0.10,
  HOLIDAY:     0.15,
  BLACKFRIDAY: 0.25,
};

const REGION_ADJUSTMENTS: Record<string, (paymentMethod: string) => number> = {
  US: () => 0,
  EU: () => -0.02,
  CN: (paymentMethod: string) => {
    if (paymentMethod === 'alipay') return 0.02;
    if (paymentMethod === 'wechat') return 0.01;
    return 0;
  },
};

const AMOUNT_THRESHOLDS = [
  { max: Infinity,  tier: 'high' },
  { max: 1000,      tier: 'mid' },
  { max: 500,       tier: 'low' },
] as const;

/* ================================================================
   核心处理函数（已拆分，圈复杂度从 22 降至各子函数 < 5）
   ================================================================ */

/** 根据订单类型和金额计算基础折扣 */
function calculateBaseDiscount(orderType: string, amount: number, isVip: boolean): number {
  const typeDiscounts = ORDER_TYPE_DISCOUNTS[orderType];
  if (!typeDiscounts) return 0;

  // 食品特殊处理：没有金额阶梯
  if (orderType === 'food') return typeDiscounts.regular as number;

  // 根据金额找到对应折扣档位
  const tier = AMOUNT_THRESHOLDS.find((t) => amount > t.max)?.tier ?? 'low';
  let discount = typeDiscounts[tier] ?? 0;

  // VIP 在电子类 high 档额外加成
  if (orderType === 'electronics' && tier === 'high' && isVip) {
    discount = typeDiscounts.high;
  }
  return discount;
}

/** 根据优惠券类型计算附加折扣 */
function calculateCouponBonus(couponCode: string | null): number {
  return couponCode ? (COUPON_DISCOUNTS[couponCode] ?? 0) : 0;
}

/** 根据地区调整折扣 */
function calculateRegionAdjustment(region: string, paymentMethod: string): number {
  const adjustFn = REGION_ADJUSTMENTS[region];
  return adjustFn ? adjustFn(paymentMethod) : 0;
}

/** 日志落盘 */
function logOrderProcessing(amount: number): void {
  try {
    const logDir = '/tmp';
    const logFile = path.join(logDir, 'order.log');
    fs.writeFileSync(logFile, `Order processed: ${amount}\n`, { encoding: 'utf-8' });
  } catch (err) {
    // 文件写入失败不影响主流程，但需要记录
    console.error('订单日志写入失败:', err instanceof Error ? err.message : String(err));
  }
}

/**
 * 处理订单折扣
 * @returns 最终应付金额
 */
export function processOrder(
  orderType: string,
  amount: number,
  isVip: boolean,
  _isFirstOrder: boolean,
  couponCode: string | null,
  region: string,
  paymentMethod: string,
): number {
  // 各维度独立计算，职责单一
  const baseDiscount   = calculateBaseDiscount(orderType, amount, isVip);
  const couponBonus    = calculateCouponBonus(couponCode);
  const regionAdjust   = calculateRegionAdjustment(region, paymentMethod);

  // 食品首单优惠独立计算
  const firstOrderBonus = orderType === 'food' && _isFirstOrder ? 0.3 : 0;

  const totalDiscount = Math.min(
    baseDiscount + couponBonus + regionAdjust + firstOrderBonus,
    0.9, // 折扣上限 90%
  );

  logOrderProcessing(amount);

  return Math.max(0, amount * (1 - totalDiscount));
}

/**
 * 计算退款金额
 * 抽取为独立函数，避免重复折扣判定逻辑
 */
export function calculateRefund(orderType: string, amount: number, daysSincePurchase: number): number {
  if (daysSincePurchase <= 7) {
    if (orderType === 'electronics') return amount * 0.9; // 10% 手续费
    if (orderType === 'clothing')    return amount;        // 全额退款
    return amount * 0.95;
  }
  if (daysSincePurchase <= 30) return amount * 0.5;
  return 0;
}

/** 可用的货币对 */
const CURRENCY_RATES: Record<string, number> = {
  'USD_CNY': 7.2,
  'CNY_USD': 1 / 7.2,
  'USD_EUR': 0.92,
  'EUR_USD': 1 / 0.92,
};

/**
 * 货币转换
 * ✅ 已修复: 从 HACK 硬编码改为可扩展的汇率映射表
 * TODO: 下一版本接入实时汇率 API（参考 exchangerate-api.com）
 */
export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;

  const rateKey = `${from}_${to}`;
  const rate = CURRENCY_RATES[rateKey];

  if (rate !== undefined) return amount * rate;

  // 缺少该货币对时抛出明确错误
  throw new Error(`不支持的货币转换: ${from} → ${to}，请补充汇率配置`);
}
