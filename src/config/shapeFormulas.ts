import { ShapePathFormulasKeys, ShapePathFormula } from '@/types/shape';

export const SHAPE_PATH_FORMULAS: Record<ShapePathFormulasKeys, ShapePathFormula> = {
  [ShapePathFormulasKeys.ROUND_RECT]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 0.5],
    relative: 'left',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const radius = Math.min(width, height) * value;
      return `M ${radius} 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height - radius} Q ${width} ${height} ${width - radius} ${height} L ${radius} ${height} Q 0 ${height} 0 ${height - radius} L 0 ${radius} Q 0 0 ${radius} 0 Z`;
    }
  },
  [ShapePathFormulasKeys.CUT_RECT_DIAGONAL]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 0.9],
    relative: 'right',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const radius = Math.min(width, height) * value;
      return `M 0 ${height - radius} L 0 0 L ${width - radius} 0 L ${width} ${radius} L ${width} ${height} L ${radius} ${height} Z`;
    }
  },
  [ShapePathFormulasKeys.CUT_RECT_SINGLE]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 0.9],
    relative: 'right',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const radius = Math.min(width, height) * value;
      return `M 0 ${height} L 0 0 L ${width - radius} 0 L ${width} ${radius} L ${width} ${height} Z`;
    }
  },
  [ShapePathFormulasKeys.CUT_RECT_SAMESIDE]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 0.5],
    relative: 'left',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const radius = Math.min(width, height) * value;
      return `M 0 ${radius} L ${radius} 0 L ${width - radius} 0 L ${width} ${radius} L ${width} ${height} L 0 ${height} Z`;
    }
  },
  [ShapePathFormulasKeys.ROUND_RECT_DIAGONAL]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 1],
    relative: 'right',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const radius = Math.min(width, height) * value;
      return `M 0 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height} L ${radius} ${height} Q 0 ${height} 0 ${height - radius} L 0 0 Z`;
    }
  },
  [ShapePathFormulasKeys.ROUND_RECT_SINGLE]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 1],
    relative: 'right',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const radius = Math.min(width, height) * value;
      return `M 0 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height} L 0 ${height} L 0 0 Z`;
    }
  },
  [ShapePathFormulasKeys.ROUND_RECT_SAMESIDE]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 0.5],
    relative: 'left',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const radius = Math.min(width, height) * value;
      return `M 0 ${radius} Q 0 0 ${radius} 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height} L 0 ${height} Z`;
    }
  },
  [ShapePathFormulasKeys.MESSAGE]: {
    formula: (width: number, height: number) => {
      const arrowWidth = width * 0.2;
      const arrowheight = height * 0.2;
      return `M 0 0 L ${width} 0 L ${width} ${height - arrowheight} L ${width / 2} ${height - arrowheight} L ${width / 2 - arrowWidth} ${height} L ${width / 2 - arrowWidth} ${height - arrowheight} L 0 ${height - arrowheight} Z`;
    }
  },
  [ShapePathFormulasKeys.ROUND_MESSAGE]: {
    formula: (width: number, height: number) => {
      const radius = Math.min(width, height) * 0.125;
      const arrowWidth = width * 0.2;
      const arrowheight = height * 0.2;
      return `M 0 ${radius} Q 0 0 ${radius} 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height - radius - arrowheight} Q ${width} ${height - arrowheight} ${width - radius} ${height - arrowheight} L ${width / 2} ${height - arrowheight} L ${width / 2 - arrowWidth} ${height} L ${width / 2 - arrowWidth} ${height - arrowheight} L ${radius} ${height - arrowheight} Q 0 ${height - arrowheight} 0 ${height - radius - arrowheight} L 0 ${radius} Z`;
    }
  },
  [ShapePathFormulasKeys.L]: {
    editable: true,
    defaultValue: 0.25,
    range: [0.1, 0.9],
    relative: 'left',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const lineWidth = Math.min(width, height) * value;
      return `M 0 0 L 0 ${height} L ${width} ${height} L ${width} ${height - lineWidth} L ${lineWidth} ${height - lineWidth} L ${lineWidth} 0 Z`;
    }
  },
  [ShapePathFormulasKeys.RING_RECT]: {
    editable: true,
    defaultValue: 0.25,
    range: [0.1, 0.45],
    relative: 'left',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const lineWidth = Math.min(width, height) * value;
      return `M 0 0 ${width} 0 ${width} ${height} L 0 ${height} L 0 0 Z M ${lineWidth} ${lineWidth} L ${lineWidth} ${height - lineWidth} L ${width - lineWidth} ${height - lineWidth} L ${width - lineWidth} ${lineWidth} Z`;
    }
  },
  [ShapePathFormulasKeys.PLUS]: {
    editable: true,
    defaultValue: 0.25,
    range: [0.1, 0.9],
    relative: 'center',
    getBaseSize: (width: number, height: number) => Math.min(width, height),
    formula: (width: number, height: number, value: number) => {
      const lineWidth = Math.min(width, height) * value;
      return `M ${width / 2 - lineWidth / 2} 0 L ${width / 2 - lineWidth / 2} ${height / 2 - lineWidth / 2} L 0 ${height / 2 - lineWidth / 2} L 0 ${height / 2 + lineWidth / 2} L ${width / 2 - lineWidth / 2} ${height / 2 + lineWidth / 2} L ${width / 2 - lineWidth / 2} ${height} L ${width / 2 + lineWidth / 2} ${height} L ${width / 2 + lineWidth / 2} ${height / 2 + lineWidth / 2} L ${width} ${height / 2 + lineWidth / 2} L ${width} ${height / 2 - lineWidth / 2} L ${width / 2 + lineWidth / 2} ${height / 2 - lineWidth / 2} L ${width / 2 + lineWidth / 2} 0 Z`;
    }
  },
  [ShapePathFormulasKeys.TRIANGLE]: {
    editable: true,
    defaultValue: 0.5,
    range: [0, 1],
    relative: 'left',
    getBaseSize: (width: number) => width,
    formula: (width: number, height: number, value: number) => {
      const vertex = width * value;
      return `M ${vertex} 0 L 0 ${height} L ${width} ${height} Z`;
    }
  },
  [ShapePathFormulasKeys.PARALLELOGRAM_LEFT]: {
    editable: true,
    defaultValue: 0.25,
    range: [0, 0.9],
    relative: 'left',
    getBaseSize: (width: number) => width,
    formula: (width: number, height: number, value: number) => {
      const point = width * value;
      return `M ${point} 0 L ${width} 0 L ${width - point} ${height} L 0 ${height} Z`;
    }
  },
  [ShapePathFormulasKeys.PARALLELOGRAM_RIGHT]: {
    editable: true,
    defaultValue: 0.25,
    range: [0, 0.9],
    relative: 'right',
    getBaseSize: (width: number) => width,
    formula: (width: number, height: number, value: number) => {
      const point = width * value;
      return `M 0 0 L ${width - point} 0 L ${width} ${height} L ${point} ${height} Z`;
    }
  },
  [ShapePathFormulasKeys.TRAPEZOID]: {
    editable: true,
    defaultValue: 0.25,
    range: [0, 0.5],
    relative: 'left',
    getBaseSize: (width: number) => width,
    formula: (width: number, height: number, value: number) => {
      const point = width * value;
      return `M ${point} 0 L ${width - point} 0 L ${width} ${height} L 0 ${height} Z`;
    }
  },
  [ShapePathFormulasKeys.BULLET]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 1],
    relative: 'top',
    getBaseSize: (width: number, height: number) => height,
    formula: (width: number, height: number, value: number) => {
      const point = height * value;
      return `M ${width / 2} 0 L 0 ${point} L 0 ${height} L ${width} ${height} L ${width} ${point} Z`;
    }
  },
  [ShapePathFormulasKeys.INDICATOR]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 0.9],
    relative: 'right',
    getBaseSize: (width: number) => width,
    formula: (width: number, height: number, value: number) => {
      const point = width * value;
      return `M ${width} ${height / 2} L ${width - point} 0 L 0 0 L ${point} ${height / 2} L 0 ${height} L ${width - point} ${height} Z`;
    }
  },
};
