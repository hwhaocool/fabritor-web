# Fabritor AI Agent API 文档

本文档描述了为支持通过 chrome-devtools-mcp 进行 AI agent 自动化而添加的 API 和增强功能。

## 概述

Fabritor 编辑器现在在 `window.fabritor` 处暴露了一个全面的 API，用于程序化控制，同时提供稳定的 DOM 选择器用于 UI 自动化。

## 1. 全局 API (`window.fabritor`)

全局 API 提供对编辑器的直接访问，无需依赖 DOM 操作。

### 基本结构

```typescript
window.fabritor = {
  version: '3.0.0',
  canvas: CanvasAPI,
  actions: ActionsAPI,
  history: HistoryAPI,
  events: EventsAPI,
  export: ExportAPI,
  isReady(): boolean
}
```

### Canvas API - 查询画布

```javascript
// 获取所有对象
const objects = window.fabritor.canvas.getObjects();
// 返回: [{ id, type, left, top, width, height, ... }, ...]

// 按类型获取对象
const textObjects = window.fabritor.canvas.getObjectsByType('f-text');
const imageObjects = window.fabritor.canvas.getObjectsByType('f-image');

// 获取当前选中的对象
const selected = window.fabritor.canvas.getActiveObject();

// 根据 ID 获取对象
const obj = window.fabritor.canvas.getObjectById('obj_1234567890_1');

// 获取画布尺寸
const dims = window.fabritor.canvas.getDimensions();
// 返回: { width, height }

// 获取缩放级别
const zoom = window.fabritor.canvas.getZoom();

// 获取完整画布状态
const state = window.fabritor.canvas.getState();
// 返回: { width, height, zoom, objectCount, selectedIds }
```

### Actions API - 操作对象

```javascript
// 选中一个对象
window.fabritor.actions.selectObject('obj_1234567890_1');

// 选中多个对象
window.fabritor.actions.selectObjects(['obj_1', 'obj_2', 'obj_3']);

// 取消所有选中
window.fabritor.actions.deselectAll();

// 删除一个对象
window.fabritor.actions.deleteObject('obj_1234567890_1');

// 删除多个对象
window.fabritor.actions.deleteObjectIds(['obj_1', 'obj_2']);

// 设置单个属性
window.fabritor.actions.setObjectProperty('obj_123', 'left', 100);
window.fabritor.actions.setObjectProperty('obj_123', 'textAlign', 'left');

// 设置多个属性
window.fabritor.actions.setObjectProperties('obj_123', {
  left: 100,
  top: 200,
  opacity: 0.8
});

// 批量更新指定类型的所有对象
// 示例：将所有文本对象设置为左对齐
window.fabritor.actions.updateObjectsByType('f-text', { textAlign: 'left' });

// 示例：设置所有文本对象的X坐标
window.fabritor.actions.updateObjectsByType('f-text', { left: 20 });

// 复制对象
window.fabritor.actions.duplicateObject('obj_123');

// 移动图层顺序
window.fabritor.actions.moveObject('obj_123', 'up');      // 向上移动一层
window.fabritor.actions.moveObject('obj_123', 'down');    // 向下移动一层
window.fabritor.actions.moveObject('obj_123', 'front');  // 移到顶层
window.fabritor.actions.moveObject('obj_123', 'back');   // 移到底层

// 组合对象
window.fabritor.actions.groupObjectIds(['obj_1', 'obj_2']);

// 取消组合
window.fabritor.actions.ungroupObject('obj_group_id');

// 清空画布
window.fabritor.actions.clearCanvas();
```

### History API - 撤销/重做

```javascript
// 撤销上一步操作
window.fabritor.history.undo();

// 重做
window.fabritor.history.redo();

// 清空历史
window.fabritor.history.clear();

// 获取历史状态
const historyState = window.fabritor.history.getState();
// 返回: { canUndo: boolean, canRedo: boolean, size: number }
```

### Events API - 订阅画布事件

```javascript
// 订阅事件
window.fabritor.events.on('object:modified', (data) => {
  console.log('对象已修改:', data);
});

window.fabritor.events.on('selection:created', (data) => {
  console.log('已创建选择:', data);
});

// 取消订阅
const callback = (data) => console.log(data);
window.fabritor.events.on('object:added', callback);
window.fabritor.events.off('object:added', callback);

// 订阅一次
window.fabritor.events.once('object:removed', (data) => {
  console.log('对象被删除（仅一次）');
});

// 触发自定义事件
window.fabritor.events.emit('custom:event', { data: 'value' });
```

可用事件：
- `object:added` - 对象添加到画布
- `object:modified` - 对象被修改
- `object:removed` - 对象被删除
- `object:selected` - 对象被选中
- `object:deselected` - 对象取消选中
- `selection:created` - 创建选择
- `selection:updated` - 更新选择
- `selection:cleared` - 清除选择
- `fabritor:object:modified` - 自定义修改事件
- `fabritor:group` - 对象组合
- `fabritor:ungroup` - 取消组合

### Export API - 导出画布

```javascript
// 导出为图片
const imgDataUrl = window.fabritor.export.toImg({
  format: 'png',  // 或 'jpeg'
  quality: 1
});

// 导出为 SVG
const svgDataUrl = window.fabritor.export.toSvg();

// 导出为 JSON
const json = window.fabritor.export.toJSON();

// 从 JSON 加载
await window.fabritor.export.loadFromJSON(json);
```

## 2. DOM 选择器 (`data-testid`)

为 AI agent 可以定位的 UI 元素提供稳定的选择器。

### 面板元素

```javascript
// 线条工具
document.querySelector('[data-testid="fabritor-btn-line-line"]');
document.querySelector('[data-testid="fabritor-btn-line-dash-line"]');
document.querySelector('[data-testid="fabritor-btn-line-arrow-line-1"]');
document.querySelector('[data-testid="fabritor-btn-line-arrow-line-2"]');

// 形状工具
document.querySelector('[data-testid="fabritor-btn-shape-rect"]');
document.querySelector('[data-testid="fabritor-btn-shape-circle"]');
document.querySelector('[data-testid="fabritor-btn-shape-triangle"]');
// ... 更多
```

### 设置器元素

```javascript
// 通用设置器
document.querySelector('[data-testid="fabritor-btn-align-left"]');
document.querySelector('[data-testid="fabritor-btn-align-right"]');
document.querySelector('[data-testid="fabritor-btn-align-center"]');
document.querySelector('[data-testid="fabritor-btn-align-top"]');
document.querySelector('[data-testid="fabritor-btn-align-bottom"]');
document.querySelector('[data-testid="fabritor-btn-center"]');

// 位置设置器
document.querySelector('[data-testid="fabritor-input-width"]');
document.querySelector('[data-testid="fabritor-input-height"]');
document.querySelector('[data-testid="fabritor-input-x"]');
document.querySelector('[data-testid="fabritor-input-y"]');
document.querySelector('[data-testid="fabritor-input-angle"]');

// 控制按钮
document.querySelector('[data-testid="fabritor-btn-lock"]');
document.querySelector('[data-testid="fabritor-btn-copy"]');
document.querySelector('[data-testid="fabritor-btn-delete"]');

// 文本对齐
document.querySelector('[data-testid="fabritor-text-align"]');
```

## 3. 对象类型列表

画布支持以下对象类型：

### 基础图形

| 类型 | 类型标识 | 说明 |
|------|----------|------|
| 文本框 | `f-text` | 文字对象，支持多行、样式 |
| 图片 | `f-image` | 图片对象，支持边框、裁剪、滤镜 |
| 矩形 | `rect` | 矩形对象 |
| 圆形 | `circle` | 圆形对象 |
| 三角形 | `triangle` | 三角形对象 |
| 椭圆 | `ellipse` | 椭圆对象 |
| 多边形 | `polygon` | 多边形对象 |

### 线条类

| 类型 | 类型标识 | 说明 |
|------|----------|------|
| 直线 | `f-line` | 直线对象 |
| 箭头线 | `f-arrow` | 带箭头的直线 |
| 三角箭头线 | `f-tri-arrow` | 带三角形箭头的直线 |

### 路径类

| 类型 | 类型标识 | 说明 |
|------|----------|------|
| SVG 路径 | `path` | SVG 路径对象，支持自定义形状 |

### 组合类

| 类型 | 类型标识 | 说明 |
|------|----------|------|
| 分组 | `group` | 多个对象的组合 |

### 特殊对象

| 类型 | 类型标识 | 说明 |
|------|----------|------|
| 画布背景 | `fabritor-sketch` | 画布背景矩形，不可选中 |

## 4. 对象属性列表

### 通用属性

所有对象都支持以下属性：

| 属性名 | 类型 | 说明 | 可设置 |
|--------|------|------|--------|
| `id` | string | 对象唯一 ID | 不可设置 |
| `type` | string | 对象类型 | 不可设置 |
| `left` | number | X 坐标位置 | ✓ |
| `top` | number | Y 坐标位置 | ✓ |
| `width` | number | 宽度 | ✓ |
| `height` | number | 高度 | ✓ |
| `scaleX` | number | X 轴缩放比例 | ✓ |
| `scaleY` | number | Y 轴缩放比例 | ✓ |
| `angle` | number | 旋转角度 (度) | ✓ |
| `opacity` | number | 透明度 (0-1) | ✓ |
| `fill` | string/Gradient | 填充颜色 | ✓ |
| `stroke` | string | 描边颜色 | ✓ |
| `strokeWidth` | number | 描边宽度 | ✓ |
| `flipX` | boolean | 水平翻转 | ✓ |
| `flipY` | boolean | 垂直翻转 | ✓ |
| `visible` | boolean | 是否可见 | ✓ |
| `selectable` | boolean | 是否可选中 | ✓ |

### 文本对象 (`f-text`) 特有属性

| 属性名 | 类型 | 说明 | 可设置 |
|--------|------|------|--------|
| `text` | string | 文本内容 | ✓ |
| `fontFamily` | string | 字体名称 | ✓ |
| `fontSize` | number | 字体大小 | ✓ |
| `fontWeight` | string | 字体粗细 (`normal`/`bold`) | ✓ |
| `fontStyle` | string | 字体样式 (`normal`/`italic`) | ✓ |
| `textAlign` | string | 文本对齐 (`left`/`center`/`right`/`justify`) | ✓ |
| `lineHeight` | number | 行高 | ✓ |
| `charSpacing` | number | 字符间距 | ✓ |
| `underline` | boolean | 下划线 | ✓ |
| `overline` | boolean | 上划线 | ✓ |
| `linethrough` | boolean | 删除线 | ✓ |
| `styles` | object | 多行文本样式 | ✓ |

### 图片对象 (`f-image`) 特有属性

| 属性名 | 类型 | 说明 | 可设置 |
|--------|------|------|--------|
| `src` | string | 图片 URL | ✓ |
| `imageSource` | string | 图片源数据 | 不可设置 |
| `imageBorder` | object | 图片边框配置 | ✓ |

图片边框配置 (`imageBorder`)：
| 属性名 | 类型 | 说明 |
|--------|------|------|
| `stroke` | string | 边框颜色 |
| `strokeWidth` | number | 边框宽度 |
| `borderRadius` | number | 圆角半径 |
| `strokeDashArray` | array | 虚线样式 |

### 线条对象 (`f-line`, `f-arrow`, `f-tri-arrow`) 特有属性

| 属性名 | 类型 | 说明 | 可设置 |
|--------|------|------|--------|
| `x1` | number | 起点 X 坐标 | ✓ |
| `y1` | number | 起点 Y 坐标 | ✓ |
| `x2` | number | 终点 X 坐标 | ✓ |
| `y2` | number | 终点 Y 坐标 | ✓ |
| `strokeLineCap` | string | 线端样式 (`butt`/`round`/`square`) | ✓ |
| `strokeDashArray` | array | 虚线样式 | ✓ |

### 路径对象 (`path`) 特有属性

| 属性名 | 类型 | 说明 | 可设置 |
|--------|------|------|--------|
| `path` | object | SVG 路径数据 | ✓ |
| `sub_type` | string | 路径子类型 | 不可设置 |

### 对象 ID 系统

画布上的每个对象都有一个唯一的、稳定的 ID，在操作期间保持不变。

```javascript
// 对象自动获得 ID，如: 'obj_1234567890_1'

// 获取所有对象及其 ID
const objects = window.fabritor.canvas.getObjects();
objects.forEach(obj => {
  console.log(obj.id, obj.type);
});

// 使用 ID 在其他操作中引用对象
window.fabritor.actions.setObjectProperty('obj_1234567890_1', 'left', 100);
```

## 使用示例

### 示例 1：将所有文本对象左对齐

```javascript
const textObjects = window.fabritor.canvas.getObjectsByType('f-text');
textObjects.forEach(obj => {
  window.fabritor.actions.setObjectProperty(obj.id, 'textAlign', 'left');
});
// 或使用批量操作:
window.fabritor.actions.updateObjectsByType('f-text', { textAlign: 'left' });
```

### 示例 2：设置所有文本对象的 X 坐标

```javascript
window.fabritor.actions.updateObjectsByType('f-text', { left: 20 });
```

### 示例 3：查找并修改特定对象

```javascript
const objects = window.fabritor.canvas.getObjects();
const target = objects.find(obj => obj.text === 'Hello World');
if (target) {
  window.fabritor.actions.setObjectProperties(target.id, {
    fontSize: 60,
    fill: '#FF0000'
  });
}
```

### 示例 4：监听变化

```javascript
window.fabritor.events.on('object:modified', (data) => {
  console.log('对象已修改:', data);
});
```

### 示例 5：修改后导出

```javascript
// 进行修改
window.fabritor.actions.updateObjectsByType('f-text', { fontSize: 40 });

// 导出
const img = window.fabritor.export.toImg();
// 保存图片或发送到服务器
```


