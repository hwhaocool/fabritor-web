import { fabric } from 'fabric';
import { uuid } from '@/utils';

export const loadSvgFromString = async (string) => {
  return new Promise((resolve) => {
    fabric.loadSVGFromString(string, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);
      resolve(svg);
    });
  });
}

export const loadSvgFromUrl = async (url) => {
  return new Promise((resolve) => {
    fabric.loadSVGFromURL(url, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);
      resolve(svg);
    });
  });
}

export const createPathFromSvg = async (options) => {
  const { svgString, canvas, width, height, ...rest } = options || {};

  const svg = await loadSvgFromString(svgString) as fabric.Path;

  // If width and height are specified, scale the SVG to those dimensions
  if (width && height) {
    // Calculate the scale factor based on the current dimensions
    const scale = Math.min(
      width / (svg.width || 1),
      height / (svg.height || 1)
    );
    svg.scale(scale);
  }

  svg.set({
    ...rest,
    id: uuid()
  });

  canvas.viewportCenterObject(svg);
  canvas.add(svg);
  canvas.setActiveObject(svg);
  canvas.requestRenderAll();

  return svg;
}