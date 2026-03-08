# Fabritor JSON 解析规则

## 概述

Fabritor 基于 Fabric.js 构建，使用 JSON 格式进行画布状态的保存和加载。通过 JSON 格式，可以：
- 导出设计结果为模板
- 加载模板快速恢复设计
- 实现撤销/重做功能

## JSON 结构

### 根级属性

```json
{
  "version": "5.3.0",
  "fabritor_schema_version": 3,
  "objects": [...],
  "clipPath": {...},
  "background": "#ddd"
}
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `version` | string | Fabric.js 版本号 |
| `fabritor_schema_version` | number | Fabritor 架构版本号（当前为 3） |
| `objects` | array | 画布上的所有对象数组 |
| `clipPath` | object | 画布裁剪路径（通常为 sketch 矩形） |
| `background` | string | 画布背景色 |

## 自定义属性列表

以下属性会在 JSON 导出时被保留（定义在 `FABRITOR_CUSTOM_PROPS`）：

- `id` - 对象唯一标识
- `fabritor_desc` - 对象描述
- `selectable` - 是否可选择
- `hasControls` - 是否显示控制点
- `sub_type` - 子类型（如 'rough' 手绘风格）
- `imageSource` - 图片来源信息
- `imageBorder` - 图片边框配置
- `oldArrowInfo` - 箭头信息

## Sketch（画布）对象

画布对象是 `id` 为 `fabritor-sketch` 的矩形对象：

```json
{
  "type": "rect",
  "left": 0,
  "top": 0,
  "width": 1242,
  "height": 1660,
  "fill": "#ffffff",
  "id": "fabritor-sketch",
  "fabritor_desc": "我的画板 by fabritor",
  "selectable": false,
  "hasControls": false
}
```

### Sketch 特殊属性

- `id`: 固定为 `"fabritor-sketch"`
- `fabritor_desc`: 画布描述文本（导出时用作文件名）
- `selectable`: 始终为 `false`
- `hasControls`: 始终为 `false`

## 对象类型

### 1. FText（文字）

**类型**: `"f-text"`

**基础属性**:
```json
{
  "type": "f-text",
  "left": 100,
  "top": 100,
  "width": 500,
  "height": 80,
  "fill": "#000000",
  "fontWeight": "normal",
  "fontSize": 50,
  "lineHeight": 1.3,
  "textAlign": "center",
  "fontFamily": "AlibabaPuHuiTi",
  "text": "文字内容",
  "charSpacing": 0,
  "splitByGrapheme": true,
  "opacity": 1,
  "angle": 0,
  "scaleX": 1,
  "scaleY": 1
}
```

**文字样式** (`styles` 数组格式):
```json
{
  "styles": [
    {"line": 0, "char": 0, "style": {"fontWeight": "bold"}},
    {"line": 1, "char": 2, "style": {"fill": "#ff0000"}}
  ]
}
```

**波浪形文字** (`path` 属性):
```json
{
  "path": {
    "type": "path",
    "path": [["M", 0, 0], ["Q", 50, -50, 100, 0]],
    "pathStartOffset": 0,
    "pathSide": "left",
    "pathAlign": "center"
  }
}
```

| 属性 | 说明 |
|------|------|
| `fontFamily` | 字体名称（必须从预设列表中选择） |
| `fontSize` | 字号 |
| `fill` | 文字颜色（支持渐变对象） |
| `textAlign` | 对齐方式：left/center/right |
| `fontWeight` | 字重：normal/bold |
| `fontStyle` | 字体样式：normal/italic |
| `underline` | 下划线 |
| `linethrough` | 删除线 |
| `lineHeight` | 行高 |
| `charSpacing` | 字间距 |
| `splitByGrapheme` | 中文处理标志（始终为 true） |

### 2. FImage（图片）

**类型**: `"f-image"`

**基础结构**:
```json
{
  "type": "f-image",
  "left": 100,
  "top": 100,
  "objects": [
    {
      "type": "image",
      "src": "data:image/png;base64,...",
      "width": 500,
      "height": 500,
      "originX": "center",
      "originY": "center"
    },
    {
      "type": "rect",
      "width": 500,
      "height": 500,
      "fill": "#00000000",
      "stroke": "#ff0000",
      "strokeWidth": 5,
      "rx": 20,
      "ry": 20,
      "originX": "center",
      "originY": "center"
    }
  ],
  "imageBorder": {
    "stroke": "#ff0000",
    "strokeWidth": 5,
    "borderRadius": 20,
    "strokeDashArray": null
  },
  "opacity": 1,
  "angle": 0
}
```

**图片边框配置** (`imageBorder`):
```json
{
  "stroke": "#ff0000",        // 边框颜色
  "strokeWidth": 5,           // 边框粗细
  "borderRadius": 20,         // 圆角半径
  "strokeDashArray": null      // 虚线数组，如 [5, 5]
}
```

**图片滤镜** (通过 `src` 对象的 `filters` 属性):
```json
{
  "filters": [
    {
      "type": "Grayscale"
    }
    // 或 "Sepia", "Blur", "Brightness", "Contrast" 等
  ]
}
```

### 3. FLine（线条）

**类型**: `"f-line"`

```json
{
  "type": "f-line",
  "x1": 100,
  "y1": 100,
  "x2": 300,
  "y2": 300,
  "stroke": "#000000",
  "strokeWidth": 5,
  "strokeDashArray": null,
  "strokeLineCap": "butt",
  "strokeLineJoin": "miter",
  "left": 200,
  "top": 200,
  "opacity": 1
}
```

| 属性 | 说明 |
|------|------|
| `x1`, `y1` | 起点坐标 |
| `x2`, `y2` | 终点坐标 |
| `stroke` | 线条颜色 |
| `strokeWidth` | 线条粗细 |
| `strokeDashArray` | 虚线数组（如 [10, 5] 表示 10px 实线 5px 虚线） |
| `strokeLineCap` | 线帽样式：butt/round |

### 4. FArrow（箭头）

**类型**: `"f-arrow"`

```json
{
  "type": "f-arrow",
  "x1": 100,
  "y1": 100,
  "x2": 300,
  "y2": 300,
  "stroke": "#000000",
  "strokeWidth": 5,
  "strokeDashArray": null,
  "strokeLineCap": "butt",
  "strokeLineJoin": "miter",
  "oldArrowInfo": {
    "left": -28,
    "top": -15,
    "bottom": 15,
    "strokeWidth": 5
  }
}
```

**oldArrowInfo** 保存箭头头部渲染信息：
- `left`: 箭头头部相对于终点的 X 偏移
- `top`: 箭头顶部 Y 偏移
- `bottom`: 箭头底部 Y 偏移
- `strokeWidth`: 渲染时的线宽

### 5. FTriArrow（三角箭头）

**类型**: `"f-tri-arrow"`

结构与 FArrow 相同，但箭头头部为三角形：

```json
{
  "type": "f-tri-arrow",
  "x1": 100,
  "y1": 100,
  "x2": 300,
  "y2": 300,
  "stroke": "#000000",
  "strokeWidth": 5,
  "oldArrowInfo": {
    "left": -24,
    "top": -16,
    "bottom": 16,
    "strokeWidth": 5
  }
}
```

### 6. 基础形状

**类型**: `"rect"`, `"circle"`, `"triangle"`, `"polygon"`, `"ellipse"`

```json
{
  "type": "rect",
  "left": 100,
  "top": 100,
  "width": 200,
  "height": 150,
  "fill": "#ff0000",
  "stroke": "#000000",
  "strokeWidth": 2,
  "rx": 10,
  "ry": 10,
  "opacity": 1,
  "angle": 0
}
```

| 属性 | 说明 |
|------|------|
| `fill` | 填充颜色（支持渐变） |
| `stroke` | 描边颜色 |
| `strokeWidth` | 描边粗细 |
| `rx`, `ry` | 圆角半径（仅 rect） |

### 7. Path（画笔路径）

**类型**: `"path"`

```json
{
  "type": "path",
  "path": [["M", 100, 100], ["L", 150, 150], ["Q", 200, 200, 250, 150]],
  "stroke": "#000000",
  "strokeWidth": 3,
  "fill": null,
  "strokeLineCap": "round",
  "strokeLineJoin": "round",
  "sub_type": "rough"  // 可选：表示手绘风格
}
```

**sub_type**:
- 未设置：普通画笔路径
- `"rough"`：手绘风格路径

### 8. Group（组合）

**类型**: `"group"`

```json
{
  "type": "group",
  "left": 100,
  "top": 100,
  "objects": [
    // 包含的子对象
  ],
  "sub_type": "rough"  // 可选
}
```

## 通用对象属性

所有对象都支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `left` | number | X 坐标 |
| `top` | number | Y 坐标 |
| `width` | number | 宽度 |
| `height` | number | 高度 |
| `scaleX` | number | 水平缩放 |
| `scaleY` | number | 垂直缩放 |
| `angle` | number | 旋转角度（度） |
| `flipX` | boolean | 水平翻转 |
| `flipY` | boolean | 垂直翻转 |
| `opacity` | number | 透明度（0-1） |
| `shadow` | object/null | 阴影配置 |

**阴影配置**:
```json
{
  "shadow": {
    "color": "#000000",
    "blur": 10,
    "offsetX": 5,
    "offsetY": 5"
  }
}
```

## 渐变填充

对象可以设置线性或径向渐变：

### 线性渐变

```json
{
  "fill": {
    "type": "linear",
    "gradientUnits": "percentage",
    "coords": {
      "x1": 0,
      "y1": 1,
      "x2": 1,
      "y2": 0
    },
    "colorStops": [
      { "offset": 0, "color": "#667eea" },
      { "offset": 1, "color": "#764ba2" }
    ]
  }
}
```

### 径向渐变

```json
{
  "fill": {
    "type": "radial",
    "gradientUnits": "percentage",
    "coords": {
      "x1": 0.5,
      "y1": 0.5,
      "x2": 0.5,
      "y2": 0.5,
      "r1": 0,
      "r2": 1
    },
    "colorStops": [
      { "offset": 0, "color": "#f6d365" },
      { "offset": 1, "color": "#fda085" }
    ]
  }
}
```

### 角度与坐标映射

| 角度 | coords |
|------|--------|
| 45° | {x1: 0, y1: 1, x2: 1, y2: 0} |
| 90° | {x1: 0, y1: 0, x2: 1, y2: 0} |
| 135° | {x1: 0, y1: 0, x2: 1, y2: 1} |
| 180° | {x1: 0, y1: 0, x2: 0, y2: 1} |

## 版本控制

**schema_version**: 用于检测 JSON 格式的兼容性

- 当前版本：3
- 加载时如果版本不匹配，会显示警告并拒绝加载

## 使用示例

### 导出 JSON

```javascript
const json = editor.canvas2Json();
const jsonStr = JSON.stringify(json, null, 2);
```

### 加载 JSON

```javascript
await editor.loadFromJSON(jsonString, true);
```

参数说明：
- 第一个参数：JSON 对象或字符串
- 第二个参数：是否显示错误提示
- 加载过程中会自动加载字体（如果 `LOAD_JSON_IGNORE_LOAD_FONT` 为 false）

### 模板保存与加载

导出时使用 sketch 的 `fabritor_desc` 属性作为文件名：
```javascript
const name = sketch.fabritor_desc; // "我的画板 by fabritor"
downloadFile(jsonStr, 'json', name);
```

## 注意事项

1. **字体加载**：文字对象的字体必须从预设列表中选择，加载 JSON 时会自动加载所需字体
2. **图片数据**：图片以 base64 格式存储在 `src` 属性中
3. **自定义对象序列化**：自定义对象通过重写 `toObject` 和 `fromObject` 方法实现序列化
4. **性能考虑**：大量对象导出时建议压缩，避免传输过大的 JSON 文件


## html定位
JSON展示/修改控件
- json-panel-display - 只读模式的JSON展示区域（pre标签）
- json-panel-textarea - 编辑模式的JSON输入框（TextArea）
按钮ID
- json-panel-btn-copy - 复制按钮
- json-panel-btn-edit - 编辑按钮（非编辑模式显示）
- json-panel-btn-cancel - 取消按钮（编辑模式显示）
- json-panel-btn-apply - 应用按钮（编辑模式显示）
这些ID使用了统一的命名规范 json-panel-*，便于通过JavaScript或其他自动化工具进行定位和操作