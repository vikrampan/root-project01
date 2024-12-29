// src/components/tubesheet/types/index.ts
/*
Type definitions including:
- Point coordinates
- Tube properties and status
- Tool configurations
- Component prop interfaces
*/
export interface Point {
    x: number;
    y: number;
  }
  
  export interface Tube {
    id: string;
    position: Point;
    status: 'active' | 'removed' | 'selected';
    number?: number;
    section?: number;
    direction?: number;
  }
  
  export interface TubePointProps {
    point: Point;
    tube?: Tube;
    onClick: () => void;
  }
  
  export interface TubeGridProps {
    tubes: Map<string, Tube>;
    onPointClick: (point: Point) => void;
    selectedTool: string;
    scale: number;
  }
  
  export interface QuadrantProps {
    screenNumber: number;
    children: React.ReactNode;
    onMaximize?: () => void;
  }
  
  export interface ViewControlsProps {
    showCrosshair: boolean;
    showGrid: boolean;
    onToggleCrosshair: () => void;
    onToggleGrid: () => void;
  }
  
  export interface ZoomControlsProps {
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
  }