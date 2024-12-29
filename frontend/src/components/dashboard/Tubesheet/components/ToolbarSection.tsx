// src/components/dashboard/Tubesheet/components/ToolbarSection.tsx
import React, { memo } from 'react';
import { ToolbarGroup, Tool } from '../types';
import { ToolButton } from './ToolButton';

interface ToolbarSectionProps {
  group: ToolbarGroup;
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

export const ToolbarSection = memo(({ group, selectedTool, onToolSelect }: ToolbarSectionProps) => (
  <div className="flex items-center gap-2 border-r border-[#2A2A2A] pr-4 last:border-r-0">
    <div className="flex items-center gap-1">
      {group.tools.map((tool: Tool) => (
        <ToolButton
          key={tool.id}
          tool={tool}
          isSelected={selectedTool === tool.id}
          onClick={() => onToolSelect(tool.id)}
        />
      ))}
    </div>
  </div>
));

ToolbarSection.displayName = 'ToolbarSection';

