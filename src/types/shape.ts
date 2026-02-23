// 形状路径公式键名枚举
export enum ShapePathFormulasKeys {
  ROUND_RECT = 'round_rect',
  CUT_RECT_DIAGONAL = 'cut_rect_diagonal',
  CUT_RECT_SINGLE = 'cut_rect_single',
  CUT_RECT_SAMESIDE = 'cut_rect_sameside',
  ROUND_RECT_DIAGONAL = 'round_rect_diagonal',
  ROUND_RECT_SINGLE = 'round_rect_single',
  ROUND_RECT_SAMESIDE = 'round_rect_sameside',
  MESSAGE = 'message',
  ROUND_MESSAGE = 'round_message',
  L = 'l_shape',
  RING_RECT = 'ring_rect',
  PLUS = 'plus',
  TRIANGLE = 'triangle',
  PARALLELOGRAM_LEFT = 'parallelogram_left',
  PARALLELOGRAM_RIGHT = 'parallelogram_right',
  TRAPEZOID = 'trapezoid',
  BULLET = 'bullet',
  INDICATOR = 'indicator',
}

// 形状公式配置接口
export interface ShapePathFormula {
  editable?: boolean;
  defaultValue?: number;
  range?: [number, number];
  relative?: 'left' | 'right' | 'top' | 'center';
  getBaseSize?: (width: number, height: number) => number;
  formula: (width: number, height: number, value?: number) => string;
}

// 路径列表项接口
export interface PathListItem {
  type: string;
  children: PathShapeItem[];
}

export interface PathShapeItem {
  viewBox: [number, number];
  path: string;
  pathFormula?: ShapePathFormulasKeys;
  special?: boolean;
  outlined?: boolean;
}

// 箭头类型接口
export interface ArrowType {
  key: string;
  type: 'f-line' | 'f-arrow' | 'f-tri-arrow';
  svg: string;
  options?: Record<string, any>;
}

// 形状类型接口
export interface ShapeType {
  key: string;
  elem: string;
  shape?: any;
  options?: Record<string, any>;
  sub_type?: string;
}

// 手绘类型接口
export interface RoughType {
  key: string;
  elem: string;
  options?: Record<string, any>;
}
