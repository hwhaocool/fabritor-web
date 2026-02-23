import Editor from '@/editor';
import {
  FabritorAPI,
  CanvasAPI,
  ActionsAPI,
  HistoryAPI,
  EventsAPI,
  ExportAPI,
  FabricObjectInfo,
  CanvasState,
  ObjectProps,
  ActionResult,
  FabricEventNames,
} from './types';
import { SKETCH_ID } from '@/utils/constants';
import { ensureObjectId, objectIdGenerator } from './objectId';

/**
 * 转换fabric对象为FabricObjectInfo
 */
function fabricObjectToInfo(obj: any): FabricObjectInfo | null {
  if (!obj || obj.id === SKETCH_ID) {
    return null;
  }

  const info: FabricObjectInfo = {
    id: ensureObjectId(obj),
    type: obj.type,
    left: obj.left,
    top: obj.top,
    width: obj.getScaledWidth?.() || obj.width,
    height: obj.getScaledHeight?.() || obj.height,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    angle: obj.angle,
    opacity: obj.opacity,
    fill: obj.fill,
    stroke: obj.stroke,
    strokeWidth: obj.strokeWidth,
    flipX: obj.flipX,
    flipY: obj.flipY,
    visible: obj.visible,
    selectable: obj.selectable,
  };

  // 文本特有属性
  if (obj.type === 'f-text' || obj.type === 'textbox') {
    info.text = obj.text;
    info.fontFamily = obj.fontFamily;
    info.fontSize = obj.fontSize;
    info.fontWeight = obj.fontWeight;
    info.textAlign = obj.textAlign;
  }

  // 图片特有属性
  if (obj.type === 'f-image') {
    info.src = obj.getSrc?.();
  }

  // 线条特有属性
  if (obj.type === 'f-line' || obj.type === 'f-arrow' || obj.type === 'f-tri-arrow') {
    info.x1 = obj.x1;
    info.y1 = obj.y1;
    info.x2 = obj.x2;
    info.y2 = obj.y2;
  }

  // 路径特有属性
  if (obj.path) {
    info.path = obj.path;
  }

  // 自定义属性
  info.sub_type = obj.sub_type;
  info.imageSource = obj.imageSource;
  info.imageBorder = obj.imageBorder;

  return info;
}

/**
 * 创建CanvasAPI
 */
function createCanvasAPI(editor: Editor): CanvasAPI {
  return {
    getObjects(): FabricObjectInfo[] {
      return editor.canvas
        .getObjects()
        .map(fabricObjectToInfo)
        .filter((obj): obj is FabricObjectInfo => obj !== null);
    },

    getObjectsByType(type: string): FabricObjectInfo[] {
      return editor.canvas
        .getObjects()
        .filter((obj) => obj.type === type)
        .map(fabricObjectToInfo)
        .filter((obj): obj is FabricObjectInfo => obj !== null);
    },

    getActiveObject(): FabricObjectInfo | null {
      const active = editor.canvas.getActiveObject();
      return fabricObjectToInfo(active);
    },

    getObjectById(id: string): FabricObjectInfo | null {
      const obj = editor.canvas.getObjects().find((o) => o.id === id);
      return fabricObjectToInfo(obj);
    },

    getDimensions() {
      return {
        width: editor.canvas.width,
        height: editor.canvas.height,
      };
    },

    getZoom(): number {
      return editor.canvas.getZoom();
    },

    getState(): CanvasState {
      const active = editor.canvas.getActiveObject();
      return {
        width: editor.canvas.width,
        height: editor.canvas.height,
        zoom: editor.canvas.getZoom(),
        objectCount: editor.canvas.getObjects().filter((o) => o.id !== SKETCH_ID).length,
        selectedIds: active
          ? (active.type === 'active-selection'
              ? active.getObjects()
              : [active]
            ).map((o) => o.id || 'unknown')
          : [],
      };
    },
  };
}

/**
 * 创建ActionsAPI
 */
function createActionsAPI(editor: Editor): ActionsAPI {
  return {
    selectObject(id: string): ActionResult {
      const obj = editor.canvas.getObjects().find((o) => o.id === id);
      if (!obj) {
        return { success: false, message: `Object with id "${id}" not found` };
      }
      editor.canvas.setActiveObject(obj);
      editor.canvas.requestRenderAll();
      return { success: true };
    },

    selectObjects(ids: string[]): void {
      const objects = editor.canvas.getObjects().filter((o) => ids.includes(o.id));
      if (objects.length > 0) {
        editor.canvas.discardActiveObject();
        if (objects.length === 1) {
          editor.canvas.setActiveObject(objects[0]);
        } else {
          const selection = new (editor.canvas as any).ActiveSelection(objects, {
            canvas: editor.canvas,
          });
          editor.canvas.setActiveObject(selection);
        }
        editor.canvas.requestRenderAll();
      }
    },

    deselectAll(): void {
      editor.canvas.discardActiveObject();
      editor.canvas.requestRenderAll();
    },

    deleteObject(id: string): ActionResult {
      const obj = editor.canvas.getObjects().find((o) => o.id === id);
      if (!obj) {
        return { success: false, message: `Object with id "${id}" not found` };
      }
      editor.canvas.remove(obj);
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
      return { success: true };
    },

    deleteObjectIds(ids: string[]): ActionResult {
      const objects = editor.canvas.getObjects().filter((o) => ids.includes(o.id));
      objects.forEach((obj) => editor.canvas.remove(obj));
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
      return { success: true, data: { deletedCount: objects.length } };
    },

    setObjectProperty(id: string, key: keyof ObjectProps, value: any): ActionResult {
      const obj = editor.canvas.getObjects().find((o) => o.id === id);
      if (!obj) {
        return { success: false, message: `Object with id "${id}" not found` };
      }
      obj.set(key, value);
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
      return { success: true };
    },

    setObjectProperties(id: string, props: Partial<ObjectProps>): ActionResult {
      const obj = editor.canvas.getObjects().find((o) => o.id === id);
      if (!obj) {
        return { success: false, message: `Object with id "${id}" not found` };
      }
      obj.set(props);
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
      return { success: true };
    },

    updateObjectsByType(type: string, props: Partial<ObjectProps>): ActionResult {
      const objects = editor.canvas.getObjects().filter((o) => o.type === type);
      objects.forEach((obj) => obj.set(props));
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
      return { success: true, data: { updatedCount: objects.length } };
    },

    duplicateObject(id: string): ActionResult {
      const obj = editor.canvas.getObjects().find((o) => o.id === id);
      if (!obj) {
        return { success: false, message: `Object with id "${id}" not found` };
      }
      obj.clone((cloned: any) => {
        cloned.set({
          left: obj.left + 10,
          top: obj.top + 10,
        });
        // 生成新ID
        cloned.id = idGenerator.generate();
        editor.canvas.add(cloned);
        editor.canvas.setActiveObject(cloned);
        editor.canvas.requestRenderAll();
        editor.fireCustomModifiedEvent();
      });
      return { success: true };
    },

    moveObject(id: string, direction: 'up' | 'down' | 'front' | 'back'): ActionResult {
      const obj = editor.canvas.getObjects().find((o) => o.id === id);
      if (!obj) {
        return { success: false, message: `Object with id "${id}" not found` };
      }
      switch (direction) {
        case 'up':
          editor.canvas.bringForward(obj);
          break;
        case 'down':
          editor.canvas.sendBackwards(obj);
          break;
        case 'front':
          editor.canvas.bringToFront(obj);
          break;
        case 'back':
          editor.canvas.sendToBack(obj);
          break;
      }
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
      return { success: true };
    },

    groupObjectIds(ids: string[]): ActionResult {
      const objects = editor.canvas.getObjects().filter((o) => ids.includes(o.id));
      if (objects.length < 2) {
        return { success: false, message: 'Need at least 2 objects to group' };
      }
      const group = new (editor.canvas as any).Group(objects, {
        canvas: editor.canvas,
      });
      group.id = idGenerator.generate();
      editor.canvas.add(group);
      editor.canvas.setActiveObject(group);
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
      editor.canvas.fire('fabritor:group', { target: group });
      return { success: true };
    },

    ungroupObject(id: string): ActionResult {
      const obj = editor.canvas.getObjects().find((o) => o.id === id);
      if (!obj || obj.type !== 'group') {
        return { success: false, message: 'Object is not a group' };
      }
      const items = obj.getObjects();
      obj.destroy();
      items.forEach((item: any) => {
        editor.canvas.add(item);
      });
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
      editor.canvas.fire('fabritor:ungroup', {});
      return { success: true };
    },

    clearCanvas(): void {
      editor.clearCanvas();
    },
  };
}

/**
 * 创建HistoryAPI
 */
function createHistoryAPI(editor: Editor): HistoryAPI {
  return {
    undo(): void {
      editor.fhistory.undo();
    },

    redo(): void {
      editor.fhistory.redo();
    },

    clear(): void {
      editor.fhistory.reset();
    },

    getState() {
      return editor.fhistory.canUndo || editor.fhistory.canRedo
        ? {
            canUndo: editor.fhistory.canUndo(),
            canRedo: editor.fhistory.canRedo(),
            size: editor.fhistory.size || 0,
          }
        : { canUndo: false, canRedo: false, size: 0 };
    },
  };
}

/**
 * 创建EventsAPI
 */
function createEventsAPI(editor: Editor): EventsAPI {
  const listeners = new Map<string, Set<Function>>();

  return {
    on(event: string, callback: (data: any) => void): void {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(callback);

      // 监听fabric事件
      editor.canvas.on(event, callback);
    },

    off(event: string, callback: (data: any) => void): void {
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          listeners.delete(event);
        }
      }
      editor.canvas.off(event, callback);
    },

    emit(event: string, data?: any): void {
      editor.canvas.fire(event, data);
    },

    once(event: string, callback: (data: any) => void): void {
      const wrapper = (data: any) => {
        callback(data);
        this.off(event, wrapper);
      };
      this.on(event, wrapper);
    },
  };
}

/**
 * 创建ExportAPI
 */
function createExportAPI(editor: Editor): ExportAPI {
  return {
    toImg(options = { format: 'png', quality: 1 }): string {
      return editor.export2Img(options);
    },

    toSvg(): string {
      return editor.export2Svg();
    },

    toJSON(): object {
      return editor.canvas2Json();
    },

    loadFromJSON(json: object | string): Promise<boolean> {
      return editor.loadFromJSON(json);
    },
  };
}

/**
 * 创建FabritorAPI实例
 */
export function createFabritorAPI(editor: Editor): FabritorAPI {
  const api: FabritorAPI = {
    version: '3.0.0',
    canvas: createCanvasAPI(editor),
    actions: createActionsAPI(editor),
    history: createHistoryAPI(editor),
    events: createEventsAPI(editor),
    export: createExportAPI(editor),
    _editor: editor,
    isReady(): boolean {
      return !!editor && !!editor.canvas;
    },
  };

  return api;
}

/**
 * 暴露API到全局window对象
 */
export function exposeAPI(editor: Editor): void {
  (window as any).fabritor = createFabritorAPI(editor);
  console.log('[Fabritor] API exposed to window.fabritor');
}

/**
 * 获取全局API实例
 */
export function getGlobalAPI(): FabritorAPI | undefined {
  return (window as any).fabritor;
}

// 导出事件名称常量
export { FabricEventNames };
export type { FabricObjectInfo, CanvasState, ObjectProps, ActionResult };
