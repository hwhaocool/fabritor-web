# Fabritor AI Agent API Documentation

This document describes the API and enhancements made to support AI agent automation via chrome-devtools-mcp.

## Overview

The Fabritor editor now exposes a comprehensive API at `window.fabritor` for programmatic control, along with stable DOM selectors for UI automation.

## 1. Global API (`window.fabritor`)

The global API provides direct access to the editor without relying on DOM manipulation.

### Basic Structure

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

### Canvas API - Querying the Canvas

```javascript
// Get all objects
const objects = window.fabritor.canvas.getObjects();
// Returns: [{ id, type, left, top, width, height, ... }, ...]

// Get objects by type
const textObjects = window.fabritor.canvas.getObjectsByType('f-text');
const imageObjects = window.fabritor.canvas.getObjectsByType('f-image');

// Get currently selected object
const selected = window.fabritor.canvas.getActiveObject();

// Get object by ID
const obj = window.fabritor.canvas.getObjectById('obj_1234567890_1');

// Get canvas dimensions
const dims = window.fabritor.canvas.getDimensions();
// Returns: { width, height }

// Get zoom level
const zoom = window.fabritor.canvas.getZoom();

// Get full canvas state
const state = window.fabritor.canvas.getState();
// Returns: { width, height, zoom, objectCount, selectedIds }
```

### Actions API - Manipulating Objects

```javascript
// Select an object
window.fabritor.actions.selectObject('obj_1234567890_1');

// Select multiple objects
window.fabritor.actions.selectObjects(['obj_1', 'obj_2', 'obj_3']);

// Deselect all
window.fabritor.actions.deselectAll();

// Delete an object
window.fabritor.actions.deleteObject('obj_1234567890_1');

// Delete multiple objects
window.fabritor.actions.deleteObjectIds(['obj_1', 'obj_2');

// Set a single property
window.fabritor.actions.setObjectProperty('obj_123', 'left', 100);
window.fabritor.actions.setObjectProperty('obj_123', 'textAlign', 'left');

// Set multiple properties
window.fabritor.actions.setObjectProperties('obj_123', {
  left: 100,
  top: 200,
  opacity: 0.8
});

// Batch update all objects of a type
// Example: Set all text objects to left alignment
window.fabritor.actions.updateObjectsByType('f-text', { textAlign: 'left' });

// Example: Set X coordinate of all text objects
window.fabritor.actions.updateObjectsByType('f-text', { left: 20 });

// Duplicate an object
window.fabritor.actions.duplicateObject('obj_123');

// Move object in layer order
window.fabritor.actions.moveObject('obj_123', 'up');      // One layer up
window.fabritor.actions.moveObject('obj_123', 'down');    // One layer down
window.fabritor.actions.moveObject('obj_123', 'front');  // To top
window.fabritor.actions.moveObject('obj_123', 'back');   // To bottom

// Group objects
window.fabritor.actions.groupObjectIds(['obj_1', 'obj_2']);

// Ungroup
window.fabritor.actions.ungroupObject('obj_group_id');

// Clear the canvas
window.fabritor.actions.clearCanvas();
```

### History API - Undo/Redo

```javascript
// Undo last action
window.fabritor.history.undo();

// Redo
window.fabritor.history.redo();

// Clear history
window.fabritor.history.clear();

// Get history state
const historyState = window.fabritor.history.getState();
// Returns: { canUndo: boolean, canRedo: boolean, size: number }
```

### Events API - Subscribe to Canvas Events

```javascript
// Subscribe to events
window.fabritor.events.on('object:modified', (data) => {
  console.log('Object modified:', data);
});

window.fabritor.events.on('selection:created', (data) => {
  console.log('Selection created:', data);
});

// Unsubscribe
const callback = (data) => console.log(data);
window.fabritor.events.on('object:added', callback);
window.fabritor.events.off('object:added', callback);

// Subscribe once
window.fabritor.events.once('object:removed', (data) => {
  console.log('Object removed once');
});

// Trigger custom event
window.fabritor.events.emit('custom:event', { data: 'value' });
```

Available Events:
- `object:added` - Object added to canvas
- `object:modified` - Object modified
- `object:removed` - Object removed
- `object:selected` - Object selected
- `object:deselected` - Object deselected
- `selection:created` - Selection created
- `selection:updated` - Selection updated
- `selection:cleared` - Selection cleared
- `fabritor:object:modified` - Custom modification event
- `fabritor:group` - Objects grouped
- `fabritor:ungroup` - Group ungrouped

### Export API - Export Canvas

```javascript
// Export as image
const imgDataUrl = window.fabritor.export.toImg({
  format: 'png',  // or 'jpeg'
  quality: 1
});

// Export as SVG
const svgDataUrl = window.fabritor.export.toSvg();

// Export as JSON
const json = window.fabritor.export.toJSON();

// Load from JSON
await window.fabritor.export.loadFromJSON(json);
```

## 2. DOM Selectors (`data-testid`)

Stable selectors for UI elements that AI agents can target.

### Panel Elements

```javascript
// Line tools
document.querySelector('[data-testid="fabritor-btn-line-line"]');
document.querySelector('[data-testid="fabritor-btn-line-dash-line"]');
document.querySelector('[data-testid="fabritor-btn-line-arrow-line-1"]');
document.querySelector('[data-testid="fabritor-btn-line-arrow-line-2"]');

// Shape tools
document.querySelector('[data-testid="fabritor-btn-shape-rect"]');
document.querySelector('[data-testid="fabritor-btn-shape-circle"]');
document.querySelector('[data-testid="fabritor-btn-shape-triangle"]');
// ... and more
```

### Setter Elements

```javascript
// Common setters
document.querySelector('[data-testid="fabritor-btn-align-left"]');
document.querySelector('[data-testid="fabritor-btn-align-right"]');
document.querySelector('[data-testid="fabritor-btn-align-center"]');
document.querySelector('[data-testid="fabritor-btn-align-top"]');
document.querySelector('[data-testid="fabritor-btn-align-bottom"]');
document.querySelector('[data-testid="fabritor-btn-center"]');

// Position setters
document.querySelector('[data-testid="fabritor-input-width"]');
document.querySelector('[data-testid="fabritor-input-height"]');
document.querySelector('[data-testid="fabritor-input-x"]');
document.querySelector('[data-testid="fabritor-input-y"]');
document.querySelector('[data-testid="fabritor-input-angle"]');

// Control buttons
document.querySelector('[data-testid="fabritor-btn-lock"]');
document.querySelector('[data-testid="fabritor-btn-copy"]');
document.querySelector('[data-testid="fabritor-btn-delete"]');

// Text alignment
document.querySelector('[data-testid="fabritor-text-align"]');
```

## 3. Object ID System

Every object on the canvas has a unique, stable ID that persists across operations.

```javascript
// Objects automatically get IDs like: 'obj_1234567890_1'

// Get all objects with their IDs
const objects = window.fabritor.canvas.getObjects();
objects.forEach(obj => {
  console.log(obj.id, obj.type);
});

// Use ID to reference object in other operations
window.fabritor.actions.setObjectProperty('obj_1234567890_1', 'left', 100);
```

## Example Use Cases

### Example 1: Align All Text Objects to Left

```javascript
const textObjects = window.fabritor.canvas.getObjectsByType('f-text');
textObjects.forEach(obj => {
  window.fabritor.actions.setObjectProperty(obj.id, 'textAlign', 'left');
});
// Or use batch:
window.fabritor.actions.updateObjectsByType('f-text', { textAlign: 'left' });
```

### Example 2: Set X Coordinate of All Text Objects

```javascript
window.fabritor.actions.updateObjectsByType('f-text', { left: 20 });
```

### Example 3: Find and Modify Specific Object

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

### Example 4: Monitor Changes

```javascript
window.fabritor.events.on('object:modified', (data) => {
  console.log('Object modified:', data);
});
```

### Example 5: Export After Modifications

```javascript
// Make changes
window.fabritor.actions.updateObjectsByType('f-text', { fontSize: 40 });

// Export
const img = window.fabritor.export.toImg();
// Save img or send to server
```

## Implementation Files

- `src/api/types.ts` - Type definitions
- `src/api/index.ts` - API implementation
- `src/api/objectId.ts` - Object ID generation system
- `src/editor/index.tsx` - Editor initialization with ID system
- `src/fabritor/index.tsx` - Main component with API exposure
