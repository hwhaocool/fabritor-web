import { fabric } from 'fabric';

/**
 * Fabric对象信息接口
 */
export interface FabricObjectInfo {
  id: string;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  opacity: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  flipX: boolean;
  flipY: boolean;
  visible: boolean;
  selectable: boolean;
  // 文本特有属性
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  // 图片特有属性
  src?: string;
  // 线条特有属性
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  // 路径特有属性
  path?: any;
  // 自定义属性
  sub_type?: string;
  imageSource?: string;
  imageBorder?: any;
}

/**
 * 对象属性接口
 */
export interface ObjectProps {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  opacity?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  flipX?: boolean;
  flipY?: boolean;
  visible?: boolean;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  src?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

/**
 * 画布状态接口
 */
export interface CanvasState {
  width: number;
  height: number;
  zoom: number;
  objectCount: number;
  selectedIds: string[];
}

/**
 * 画布查询接口
 */
export interface CanvasAPI {
  /**
   * 获取所有对象
   */
  getObjects(): FabricObjectInfo[];

  /**
   * 根据类型获取对象
   */
  getObjectsByType(type: string): FabricObjectInfo[];

  /**
   * 获取当前选中的对象
   */
  getActiveObject(): FabricObjectInfo | null;

  /**
   * 根据ID获取对象
   */
  getObjectById(id: string): FabricObjectInfo | null;

  /**
   * 获取画布尺寸
   */
  getDimensions(): { width: number; height: number };

  /**
   * 获取缩放级别
   */
  getZoom(): number;

  /**
   * 获取画布状态
   */
  getState(): CanvasState;
}

/**
 * 操作结果接口
 */
export interface ActionResult {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * 画布操作接口
 */
export interface ActionsAPI {
  /**
   * 选中对象
   */
  selectObject(id: string): ActionResult;

void;

  /**
   * 取消选中
   */
  deselectAll(): void;

  /**
   * 删除对象
   */
  deleteObject(id: string): ActionResult;

  /**
   * 批量删除对象
   */
  deleteObjectIds(ids: string[]): ActionResult;

  /**
   * 设置对象属性
   */
  setObjectProperty(id: string, key: keyof ObjectProps, value: any): ActionResult;

  /**
   * 批量设置对象属性
   */
  setObjectProperties(id: string, props: Partial<ObjectProps>): ActionResult;

  /**
   * 批量对相同类型的对象设置属性
   */
  updateObjectsByType(type: string, props: Partial<ObjectProps>): ActionResult;

  /**
   * 复制对象
   */
  duplicateObject(id: string): ActionResult;

  /**
   * 移动对象层级
   */
  moveObject(id: string, direction: 'up' | 'down' | 'front' | 'back'): ActionResult;

  /**
   * 分组对象
   */
  groupObjectIds(ids: string[]): ActionResult;

  /**
   * 解组对象
   */
  ungroupObject(id: string): ActionResult;

  /**
   * 清空画布
   */
  clearCanvas(): void;
}

/**
 * 历史操作接口
 */
export interface HistoryAPI {
  /**
   * 撤销
   */
  undo(): void;

  /**
   * 重做
   */
  redo(): void;

  /**
   * 清空历史
   */
  clear(): void;

  /**
   * 获取历史状态
   */
  getState(): {
    canUndo: boolean;
    canRedo: boolean;
    size: number;
  };
}

/**
 * 事件回调类型
 */
export type EventCallback = (data: any) => void;

/**
 * 事件接口
 */
export interface EventsAPI {
  /**
   * 订阅事件
   */
  on(event: string, callback: EventCallback): void;

  /**
   * 取消订阅
   */
  off(event: string, callback: EventCallback): void;

  /**
   * 触发事件
   */
  emit(event: string, data?: any): void;

  /**
   * 订阅一次
   */
  once(event: string, callback: EventCallback): void;
}

/**
 * 导出接口
 */
export interface ExportAPI {
  /**
   * 导出为图片
   */
  toImg(options?: { format?: 'png' | 'jpeg'; quality?: number }): string;

  /**
   * 导出为SVG
   */
  toSvg(): string;

  /**
   * 导出为JSON
   */
  toJSON(): object;

  /**
   * 从JSON加载
   */
  loadFromJSON(json: object | string): Promise<boolean>;
}

/**
 * Fabritor API 主接口
 */
export interface FabritorAPI {
  /**
   * 版本信息
   */
  version: string;

  /**
   * 画布查询API
   */
  canvas: CanvasAPI;

  /**
   * 操作API
   */
  actions: ActionsAPI;

  /**
   * 历史操作API
   */
  history: HistoryAPI;

  /**
   * 事件API
   */
  events: EventsAPI;

  /**
   * 导出API
   */
  export: ExportAPI;

  /**
   * 内部编辑器实例（高级用法）
   */
  _editor?: any;

  /**
   * 是否已初始化
   */
  isReady(): boolean;
}

/**
 * 全局Window接口扩展
 */
declare global {
  interface Window {
    fabritor?: FabritorAPI;
  }
}

/**
 * 事件名称常量
 */
export const FabricEventNames = {
  // 对象事件
  OBJECT_ADDED: 'object:added',
  OBJECT_MODIFIED: 'object:modified',
  OBJECT_REMOVED: 'object:removed',
  OBJECT_SELECTED: 'object:selected',
  OBJECT_DESELECTED: 'object:deselected',
  OBJECT_MOVING: 'object:moving',
  OBJECT_SCALING: 'object:scaling',
  OBJECT_ROTATING: 'object:rotating',

  // 选择事件
  SELECTION_CREATED: 'selection:created',
  SELECTION_UPDATED: 'selection:updated',
  SELECTION_CLEARED: 'selection:cleared',

  // 画布事件
  CANVAS_RENDERED: 'after:render',

  // Fabritor自定义事件
  FABRITOR_MODIFIED: 'fabritor:object:modified',
  FABRITOR_GROUP: 'fabritor:group',
  FABRITOR_UNGROUP: 'fabritor:ungroup',
  FABRITOR_LOAD_JSON: 'fabritor:load:json',
  FABRITOR_HISTORY_UNDO: 'fabritor:history:undo',
  FABRITOR_HISTORY_REDO: 'fabritor:history:redo',
} as const;
