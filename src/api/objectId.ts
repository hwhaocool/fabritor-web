import { SKETCH_ID } from '@/utils/constants';

/**
 * 对象ID生成器
 */
class ObjectIdGenerator {
  private counter = 0;

  generate(): string {
    this.counter++;
    return `obj_${Date.now()}_${this.counter}`;
  }

  reset() {
    this.counter = 0;
  }
}

// 导出单例
export const objectIdGenerator = new ObjectIdGenerator();

/**
 * 确保对象有ID
 * @param obj fabric对象
 * @returns 对象的ID
 */
export function ensureObjectId(obj: any): string {
  if (!obj.id || obj.id === SKETCH_ID) {
    obj.id = objectIdGenerator.generate();
  }
  return obj.id;
}

/**
 * 为fabric对象原型添加ensureObjectId方法
 */
export function setupObjectIdSystem() {
  const { Object: FabricObject } = require('fabric');

  // 重写initialize方法，确保新创建的对象都有ID
  const originalInitialize = FabricObject.prototype.initialize;

  FabricObject.prototype.initialize = function(this: any, options: any) {
    const result = originalInitialize.call(this, options);
    if (!this.id) {
      this.id = objectIdGenerator.generate();
    }
    return result;
  };

  console.log('[Fabritor] Object ID system initialized');
}
