// src/components/dashboard/Tubesheet/components/Toolbar.tsx
import React, { memo } from 'react';
import { TOOLBAR_GROUPS } from '../constants';
import { ToolbarSection } from './ToolbarSection';
import { ToolbarGroup } from '../types';

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const Toolbar = memo(({ selectedTool, onToolSelect }: ToolbarProps) => (
  <div className="bg-[#242424] border-b border-[#2A2A2A] p-2 shadow-lg">
    <div className="flex items-center gap-4">
      {TOOLBAR_GROUPS.map((group: ToolbarGroup) => (
        <ToolbarSection
          key={group.id}
          group={group}
          selectedTool={selectedTool}
          onToolSelect={onToolSelect}
        />
      ))}
    </div>
  </div>
));

Toolbar.displayName = 'Toolbar';

export default Toolbar;