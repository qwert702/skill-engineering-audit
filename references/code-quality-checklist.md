# 代码质量检查清单

本文档是代码质量审计的操作指南，列出每项检查的具体排查方法、命令模板和判定标准。

---

## 一、死代码检测

### 未使用的导入

**排查方法**：跨文件搜索每个 import 的符号是否在文件中被引用

**判定标准**：文件中被导入但未在代码中使用的符号

**典型模式**：
```typescript
// ❌ 已导入但未使用
import { unusedFunction } from './utils';
import fs from 'fs';
```

### 未使用的变量

**排查方法**：
1. 搜索变量声明
2. 检查当前作用域中是否有对变量的读取操作
3. 检查仅赋值但从未读取的变量

**判定标准**：声明并赋值但从未被读取的变量

**典型模式**：
```typescript
// ❌ 定义了但从未使用的变量
const result = computeSomething();
return true;  // result 从未被使用

// ❌ 只写不读的变量
let counter = 0;
counter = 10;  // 从未被读取
```

### 未使用的函数

**排查方法**：
1. 列出所有函数定义（exported 和 non-exported）
2. 对 non-exported 函数，搜索文件内是否有调用
3. 对 exported 函数，搜索整个代码库是否有调用

**判定标准**：定义了但从未在任何地方被调用的函数

### 未使用的导出

**排查方法**：
1. 列出所有 `export` 的符号
2. 跨文件搜索每个符号的导入引用
3. 检查是否仅有自身文件引用

**判定标准**：导出但未被其他文件导入的符号

---

## 二、代码重复检测

### 字符串/常量重复

**排查方法**：
1. 搜索相同的字符串字面量出现在多个位置
2. 检查值相等的常量定义分散在不同文件中

**判定标准**：相同的非平凡字符串（长度 > 20 字符）出现 3 次以上

### 逻辑重复

**排查方法**：
1. 搜索相似的条件判断模式
2. 搜索相似的数据转换/处理模式（map/filter/reduce 链）
3. 搜索相同的错误处理代码块（如多处相同 if-err-return）

**判定标准**：完全相同的逻辑代码块出现 2 次以上

### 配置/魔数重复

**排查方法**：
1. 搜索文件中出现的数字字面量（魔数）
2. 检查相同数值出现在多个位置

**判定标准**：相同的非 0/1/true/false 常量值在多个位置硬编码

---

## 三、圈复杂度检查

### 判定标准

| 等级 | 函数圈复杂度 | 评估 |
|------|-------------|------|
| 低 | 1-5 | 正常 |
| 中 | 6-10 | 可接受 |
| 高 | 11-20 | 需要关注 |
| 极高 | >20 | 必须重构 |

### 复杂度计算规则

每个函数/方法的圈复杂度 = 1 + 以下各分支点数之和：

| 结构 | 增加点数 |
|------|---------|
| if / else if | +1 |
| else | +0（已计入对应 if） |
| switch case（每 case） | +1 |
| for / while / do-while | +1 |
| forEach / map / filter 回调 | +1（回调节点） |
| && / `||` 逻辑运算符 | +1 |
| catch | +1 |
| ? : 三元运算符 | +1 |

### 排查方法

1. 使用 `Grep` 搜索目标文件中的控制流关键字
2. 定位超过阈值的高复杂度函数
3. 人工评估是否可拆分为更小的函数

---

## 四、命名约定检查

### 通用命名规则

| 类型 | 推荐格式 | 示例 |
|------|---------|------|
| 类/类型/接口 | PascalCase | `UserService`, `ApiResponse` |
| 函数/方法 | camelCase | `getUserById`, `validateInput` |
| 变量 | camelCase | `userName`, `totalCount` |
| 常量（不可变） | UPPER_SNAKE_CASE 或 camelCase | `MAX_RETRY_COUNT` |
| 布尔变量 | is/has/should/can 前缀 | `isActive`, `hasPermission` |
| 文件名 | kebab-case 或 PascalCase | `user-service.ts`, `UserService.ts` |
| 目录名 | kebab-case | `api/`, `data-access/` |
| 枚举 | PascalCase（枚举名）, UPPER_SNAKE_CASE（成员） | `Color.RED`, `Status.ACTIVE` |
| 私有成员 | 下划线前缀或 # 前缀 | `_privateMethod()` 或 `#privateMethod()` |

### 命名一致性检查

- [ ] 同类元素是否使用相同的命名模式
- [ ] 相关概念是否使用一致的命名（如 UserInfo 和 UserDetail 不是同一个类）
- [ ] 缩写是否一致（如全部用 `id` 而非混用 `id` 和 `identifier`）
- [ ] 布尔返回值的函数是否以 is/has/should/can 开头

### 不良命名模式

| ❌ 不良命名 | 问题 |
|------------|------|
| `data`, `info`, `result` | 过于通用，不表达含义 |
| `proc1`, `handle2` | 编号命名，不表达功能 |
| `temp`, `tmp` | 临时变量过多 |
| `flag`, `status` | 不表达含义的布尔变量名 |
| 单字母（除 i/j/k 作为循环变量） | 可读性差 |

---

## 五、注释质量检查

### 缺失的文档注释

需要在何处检查：
- [ ] 导出/公开的 API 函数或方法
- [ ] 复杂的业务逻辑（超过 15 行）
- [ ] 非显而易见的边界条件处理
- [ ] 非标准算法或实现

**判定标准**：公开 API 没有描述参数的用途、返回值和可能抛出的异常

### 过时注释

- [ ] 注释描述的行为与代码实际行为不一致
- [ ] 注释引用已删除或重命名的元素
- [ ] 注释声称做了某件事但代码并未实现

### 误导注释

- [ ] 声称处理了某个边界情况但代码中未处理
- [ ] 描述的参数/返回值与实际类型不符
- [ ] 声称的复杂度与实际不符（如"简单实现"但实际很复杂）

### 遗留标记检查

| 标记 | 含义 | 可接受数量 |
|------|------|-----------|
| TODO | 待完成的工作 | ≤ 5 |
| FIXME | 已知有问题的代码 | ≤ 3 |
| HACK | 临时/不优雅的解决方案 | ≤ 3 |
| XXX | 警告/危险区域 | ≤ 2 |
| 注释掉的代码 | 历史遗留 | 0（应删除） |

---

## 六、类型安全（TypeScript 特定）

### 检查项

| 检查项 | 搜索模式 | 判定 |
|--------|---------|------|
| `any` 类型 | `: any` | 禁止，除非有明确豁免原因 |
| 隐式 any | 未标注类型的参数 | 应启用 `noImplicitAny` |
| 类型断言 | `as Type` | 需确认断言是否安全 |
| 非空断言 | `!` 操作符 | 需确认非空理由 |
| `@ts-ignore` | `// @ts-ignore` | 0 容忍，应使用 `@ts-expect-error` 并附原因 |
| `@ts-nocheck` | `// @ts-nocheck` | 0 容忍 |
| 未类型化的 Promise | `Promise<any>` | 应指定具体类型 |
| 未类型化的 API 响应 | `response.data as any` | 应定义 Response 接口 |

---

## 七、错误处理完整性

### 检查项

| 模式 | 问题描述 |
|------|---------|
| `catch (e) {}` | 空的 catch 块，静默吞没错误 |
| `catch (e) { console.log(e) }` | 仅打印日志，未做处理 |
| `try { ... } finally { ... }` | 无 catch，仅 finally（异常被重新抛出？） |
| `.catch(() => {})` | Promise 异常被忽略 |
| `void asyncFunction()` | async 调用未 await 且未 catch |
| `// eslint-disable-next-line @typescript-eslint/no-unused-vars` | 编译忽略的未使用错误参数 |

### 错误处理的良好实践

```typescript
// ✅ 正确：区分错误类型 + 恢复或转发
try {
  await processOrder(orderId);
} catch (error) {
  if (error instanceof ValidationError) {
    // 返回用户友好的错误
    return { success: false, message: '订单数据不合法' };
  }
  if (error instanceof DatabaseError) {
    // 记录并重试
    logger.error('数据库异常', { orderId, error });
    await retryOperation(orderId);
  }
  // 未知错误向上传播
  throw error;
}
```

---

## 八、资源泄漏

### 文件句柄

```typescript
// ❌ 错误：未关闭文件
const data = fs.readFileSync(path);

// ✅ 正确：使用完毕自动关闭
const data = await fs.promises.readFile(path, 'utf-8');

// ❌ 错误：WriteStream 未关闭
const stream = fs.createWriteStream(path);
stream.write(data);

// ✅ 正确：使用后关闭
const stream = fs.createWriteStream(path);
try {
  stream.write(data);
} finally {
  stream.close();
}
```

### 数据库连接

- [ ] 连接池配置了合适的 max 和 timeout
- [ ] 事务在 finally 中提交或回滚
- [ ] ORM 查询使用了 `using` / `Dispose` 模式

### 事件监听器

- [ ] 组件销毁时移除了事件监听
- [ ] `addEventListener` 有对应的 `removeEventListener`
- [ ] EventEmitter 的 `on` 有对应的 `off`
- [ ] WebSocket 连接在关闭时断开

### 定时器

- [ ] `setInterval` 在组件/服务关闭时调用 `clearInterval`
- [ ] `setTimeout` 在组件/服务关闭时调用 `clearTimeout`
- [ ] requestAnimationFrame 在组件卸载时取消
