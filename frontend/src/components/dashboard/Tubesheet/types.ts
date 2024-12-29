// src/components/dashboard/Tubesheet/types.ts
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface Tube {
  id: string;
  position: Point;
  status: 'active' | 'removed' | 'selected';
  number?: number;
  section: number;
}

export interface Tool {
  id: string;
  icon: LucideIcon;
  label: string;
}

export interface ToolbarGroup {
  id: string;
  label: string;
  tools: Tool[];
}

export interface ToolButtonProps {
  tool: Tool;
  isSelected: boolean;
  onClick: () => void;
}

export interface TubeGridProps {
  tubes: Map<string, Tube>;
  onPointClick: (point: Point) => void;
  selectedTool: string;
  scale: number;
}

export interface TubePointProps {
  point: Point;
  tube?: Tube;
  onClick: () => void;
}

export interface QuadrantProps {
  screenNumber: number;
  children: ReactNode;
  onMaximize: () => void;
}