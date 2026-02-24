# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 工具使用
1. 使用 pnpm
2. 支持 chrome-devtools-mcp

## Common Commands

- `pnpm start` - Start development server at http://localhost:3000
- `pnpm build` - Production build
- `pnpm eslint` - Lint JavaScript/TypeScript files in src/
- `pnpm eslint:fix` - Auto-fix ESLint issues
- `pnpm stylelint` - Lint CSS/SCSS/Less files
- `pnpm stylelint:fix` - Auto-fix stylelint issues

## Architecture Overview

This is a React application built with the Ice framework (Alibaba's framework), providing a creative image editor based on fabric.js.

### Core Architecture

**Editor Class** (`src/editor/index.tsx`)
The central class that manages the fabric canvas instance. Key responsibilities:
- Canvas initialization and lifecycle
- Event handling (mouse, keyboard, selection)
- Sketch/workspace management (centering, zoom, pan)
- Export functionality (toImg, toSvg, toJSON, loadFromJSON)
- Integration with extensions (history, autosave, hotkeys)

**Custom Fabric Classes** (`src/editor/custom-objects/`)
Extended fabric.js classes with custom serialization:
- `FText` - Textbox with additional properties and styles handling
- `FImage` - Image with border, clipPath, and filter support
- `FLine` - Line with custom point management
- `FArrow` / `FTriArrow` - Arrow shapes

**Extensions** (`src/editor/extensions/`)
- `history.ts` - Undo/redo using JSON snapshots (max 100 states by default)
- `autosave.ts` - Auto-saves canvas state to localStorage
- `hotkey.ts` - Keyboard shortcuts using hotkeys-js (Ctrl+C/V/Z, Delete, Arrow keys)

**Object Creation Helpers** (`src/editor/objects/`)
Functions for creating and manipulating objects: `textbox.tsx`, `image.ts`, `line.ts`, `path.ts`, `rect.ts`, `shape.ts`, `group.ts`, `init.ts`

### State Management

**GloablStateContext** (`src/context/index.ts`)
React Context providing:
- `editor` - Editor instance
- `object` - Currently active fabric.Object
- `setActiveObject` - Function to update active object
- `isReady` - Canvas initialization state
- `roughSvg` - roughjs SVG instance for hand-drawn shapes

### UI Structure

**Main Component** (`src/fabritor/index.tsx`)
- Initializes Editor class and React Context
- Sets up canvas event handlers
- Manages canvas refs and workspace refs

**UI Components** (`src/fabritor/UI/`)
- `Header` - Logo, Toolbar, BaseInfo, Export
- `Panel` (left sidebar) - Object creation panels:
  - DesignPanel - Basic shapes
  - TextPanel - Text creation with preset fonts
  - ImagePanel - Image upload/URL
  - PaintPanel - Free drawing brushes
  - ShapePanel - Lines, arrows, polygons
  - AppPanel - Emoji, QRCode
- `Setter` (right sidebar) - Property editors based on active object type:
  - CommonSetter - Position, opacity, flip
  - TextSetter - Font style, alignment, text effects (shadow, path, pattern)
  - ImageSetter - Border, clip/crop, filters, replace
  - ShapeSetter - Line type, rough style
  - PathSetter - Path properties
  - ColorSetter - Solid colors

**Shared Components** (`src/fabritor/components/`)
- ContextMenu, ImageSelector, LocalFileSelector, FList, SliderInputNumber, etc.

### Key Patterns

**Object Type Detection**
Active object type determines which Setter panel is shown. Use `object?.type`:
- `f-text` → TextSetter
- `f-image` → ImageSetter
- `f-line`, `f-arrow`, `f-tri-arrow` → ShapeSetter/LineSetter
- `path` → PathSetter

**Canvas Events**
Custom events fired by Editor:
- `fabritor:group` / `fabritor:ungroup` - Group operations
- `fabritor:object:modified` - Manual modification trigger
- `fabritor:load:json` - After loading JSON
- `fabritor:history:undo` / `fabritor:history:redo` - History actions

**Sketch vs Canvas**
- `canvas.sketch` - The white workspace rectangle (default: 1242x1660)
- Canvas uses sketch as clipPath
- Zoom/pan operations center the sketch within viewport

**Configuration**
- `src/config.ts` - Feature flags (auto-save, hover effects, quality settings)
- `src/utils/constants.tsx` - Object defaults, font presets, custom properties list
- Custom props are preserved in JSON export via `FABRITOR_CUSTOM_PROPS`

### i18n Setup
- Uses i18next with react-i18next
- Translation files in `public/locales/{en-US,zh-CN}/`
- Fallback language: en-US
- Import and use `translate` from `src/i18n/utils` in non-React code

### Adding Custom Object Types
1. Create custom fabric class in `src/editor/custom-objects/`
2. Register in `src/editor/custom-objects/index.ts`
3. Add creation helper in `src/editor/objects/`
4. Create panel entry in appropriate Panel component
5. Create setter component in `src/fabritor/UI/setter/`
6. Update setter routing based on `object?.type`

### Font Loading
Fonts must be loaded before using them with text objects. Use `loadFont(fontFamily)` from `src/utils/index.ts`. Preset fonts are listed in `FONT_PRESET_FAMILY_LIST` in constants.
