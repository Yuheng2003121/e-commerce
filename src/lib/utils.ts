import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEmptyFilterValue(value: any): boolean {
  // 1. 显式 null / undefined → 空
  if (value == null) return true;

  // 2. 字符串 → 判空（trim 防止空格）
  if (typeof value === "string") {
    return value.trim() === "";
  }

  // 3. 数组 → 判 length
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // 4. 对象（不常见，但可扩展）→ 判 keys
  if (typeof value === "object" && value.constructor === Object) {
    return Object.keys(value).length === 0;
  }

  // 5. boolean / number / etc. → 默认非空（谨慎！）
  //    例如：`inStock: false` 是有效筛选，不能丢
  //    `price: 0` 可能是用户故意筛 0 元商品
  return false; // 非空 → 有有效值
}
