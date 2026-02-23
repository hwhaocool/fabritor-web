import { Flex, Tag, Collapse, Empty } from 'antd';
import Title from '@/fabritor/components/Title';
import LineTypeList from './line-type-list';
import ShapeTypeList from './shape-type-list';
import RoughTypeList from './rough-type-list';
import { drawArrowLine, drawLine, drawTriArrowLine } from '@/editor/objects/line';
import createRect from '@/editor/objects/rect';
import createShape from '@/editor/objects/shape';
import { useContext } from 'react';
import { GloablStateContext } from '@/context';
import { createPathFromSvg } from '@/editor/objects/path';
import Center from '@/fabritor/components/Center';
import { useTranslation } from '@/i18n/utils';
import { PATH_SHAPE_LIBRARY } from '@/config/pathShapeLibrary';
import type { PathShapeItem } from '@/types/shape';

console.log('PATH_SHAPE_LIBRARY:', PATH_SHAPE_LIBRARY);

export default function ShapePanel () {
  const { editor, roughSvg } = useContext(GloablStateContext);
  const { t } = useTranslation();

  const addLine = (item) => {
    const { type, options = {} } = item;
    const canvas = editor.canvas;
    switch (type) {
      case 'f-line':
        drawLine({ ...options, canvas });
        break;
      case 'f-arrow':
        drawArrowLine({ ...options, canvas });
        break;
      case 'f-tri-arrow':
        drawTriArrowLine({ ...options, canvas });
        break;
      default:
        break;
    }
  }

  const addShape = (item) => {
    const { key, elem, options } = item;
    const canvas = editor.canvas;
    switch(key) {
      case 'rect':
      case 'rect-r':
        createRect({ ...options, canvas });
        break;
      case 'star':
      case 'heart':
        createPathFromSvg({ svgString: elem, canvas, sub_type: key, strokeWidth: 20 });
        break;
      default:
        createShape(item.shape, { ...options, canvas });
        break;
    }
  }

  const addRough = (item) => {
    const { key, options } = item;
    const canvas = editor.canvas;
    let svg;
    switch (key) {
      case 'rough-line':
        svg = roughSvg.line(0, 0, 300, 0, options);
        break;
      case 'rough-rect':
        svg = roughSvg.rectangle(0, 0, 400, 400, options);
        break;
      case 'rough-circle':
        svg = roughSvg.circle(0, 0, 300, options);
        break;
      case 'rough-ellipse':
        svg = roughSvg.ellipse(0, 0, 300, 150, options);
        break;
      case 'rough-right-angle':
        svg = roughSvg.polygon([[0, 0], [0, 300], [300, 300]], options);
        break;
      case 'rough-diamond':
        svg = roughSvg.polygon([[0, 150], [150, 300], [300, 150], [150, 0]], options);
      default:
        break;
    }

    console.log(svg)
    const svgString = `<svg fill="none" xmlns="http://www.w3.org/2000/svg">${svg.innerHTML}</svg>`
    createPathFromSvg({ svgString, canvas, sub_type: 'rough' });
  }

  const addPathShape = (item: PathShapeItem, category: string) => {
    const { path, viewBox, special } = item;
    const canvas = editor.canvas;

    // Create SVG string
    const svgString = `<svg viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" xmlns="http://www.w3.org/2000/svg">${special ?
      `<path fill="#555555" d="${path}" />` :
      `<path fill="#555555" d="${path}" />`
    }</svg>`;

    createPathFromSvg({
      svgString,
      canvas,
      sub_type: category,
      width: 200,
      height: 200
    });
  }

  const getCategoryTranslation = (category: string) => {
    return t(`panel.material.${category}`, category);
  }

  const getItemName = (item: PathShapeItem, category: string, index: number) => {
    const name = item.name || `${getCategoryTranslation(category)} - ${index + 1}`;
    console.log('getItemName:', { name, item, category, index });
    return name;
  }

  return (
    <div className="fabritor-panel-wrapper">
      <Title>{t('panel.material.line')}</Title>
      <Flex gap={10} wrap="wrap" justify="space-around">
        {
          LineTypeList.map(item => (
            <div
              key={item.key}
              onClick={() => { addLine(item) }}
              className="fabritor-panel-shape-item"
              data-testid={`fabritor-btn-line-${item.key}`}
            >
              <img src={`data:image/svg+xml,${encodeURIComponent(item.svg)}`} alt="" style={{ width: 48, height: 48 }} />
            </div>
          ))
        }
      </Flex>
      <Title>{t('panel.material.shape')}</Title>
      <Flex gap={10} wrap="wrap" justify="space-around">
        {
          ShapeTypeList.map(item => (
            <div
              key={item.key}
              onClick={() => { addShape(item) }}
              className="fabritor-panel-shape-item"
              data-testid={`fabritor-btn-shape-${item.key}`}
            >
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.elem)}`} style={{ width: 64, height: 64 }} />
            </div>
          ))
        }
      </Flex>
      <Title>{t('panel.material.path_shapes')}</Title>
      <Collapse
        items={PATH_SHAPE_LIBRARY.map(category => ({
          key: category.type,
          label: getCategoryTranslation(category.type),
          children: (
            <Flex gap={10} wrap="wrap" justify="space-around">
              {category.children.map((item: PathShapeItem, index: number) => (
                <div
                  key={`${category.type}-${index}`}
                  onClick={() => { addPathShape(item, category.type) }}
                  className="fabritor-panel-shape-item"
                  title={getItemName(item, category.type, index)}
                  data-testid={`fabritor-btn-path-${category.type}-${index}`}
                >
                  <img
                    src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                      `<svg viewBox="0 0 ${item.viewBox[0]} ${item.viewBox[1]}" xmlns="http://www.w3.org/2000/svg"><path fill="#555555" d="${item.path}" /></svg>`
                    )}`}
                    style={{ width: 48, height: 48 }}
                    alt={getItemName(item, category.type, index)}
                  />
                </div>
              ))}
            </Flex>
          ),
        }))}
        defaultActiveKey={[]}
      />
      <Title>
        <div style={{ position: 'relative' }}>
          <span>{t('panel.material.hand_drawn')}</span>
          <Tag color='#f50' style={{ position: 'absolute', right: -48, top: -5, padding: '0 4px' }}>beta</Tag>
        </div>
      </Title>
      <Flex gap={10} wrap="wrap" justify="space-around">
        {
          RoughTypeList.map(item => (
            <div
              key={item.key}
              onClick={() => { addRough(item) }}
              className="fabritor-panel-shape-item"
              data-testid={`fabritor-btn-rough-${item.key}`}
            >
              <Center style={{ width: 64, height: 64 }}>
                <img src={item.elem} style={{ width: 64 }} />
              </Center>
            </div>
          ))
        }
      </Flex>
    </div>
  )
}
