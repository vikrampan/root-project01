// src/components/tubesheet/hooks/useTubeManagement.ts
/*
Custom hook that:
- Manages tube data and state
- Handles add/remove operations
- Tracks counts and sections
- Optimizes tube position lookups
*/
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Tube, Point } from '../types';

export const useTubeManagement = () => {
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [currentSection, setCurrentSection] = useState(1);
  const [lastTubeNumber, setLastTubeNumber] = useState(0);

  const tubeMap = useMemo(() => {
    const map = new Map<string, Tube>();
    tubes.forEach(tube => {
      map.set(`${tube.position.x}-${tube.position.y}`, tube);
    });
    return map;
  }, [tubes]);

  const handleTubeAction = useCallback((point: Point, toolId: string) => {
    const key = `${point.x}-${point.y}`;
    const existingTube = tubeMap.get(key);

    setTubes(prev => {
      switch (toolId) {
        case 'add-single':
          if (!existingTube) {
            setLastTubeNumber(prev => prev + 1);
            return [...prev, {
              id: `tube-${Date.now()}`,
              position: point,
              status: 'active',
              number: lastTubeNumber + 1,
              section: currentSection
            }];
          }
          return prev;

        case 'remove-single':
          if (existingTube) {
            return prev.map(t => 
              t.id === existingTube.id ? { ...t, status: 'removed' } : t
            );
          }
          return prev;

        case 'select':
          if (existingTube) {
            return prev.map(t => ({
              ...t,
              status: t.id === existingTube.id ? 
                (t.status === 'selected' ? 'active' : 'selected') : 
                t.status
            }));
          }
          return prev;

        default:
          return prev;
      }
    });
  }, [tubeMap, currentSection, lastTubeNumber]);

  const activeTubeCount = useMemo(() => 
    tubes.filter(t => t.status === 'active').length,
  [tubes]);

  const selectedTubeCount = useMemo(() => 
    tubes.filter(t => t.status === 'selected').length,
  [tubes]);

  return {
    tubes,
    tubeMap,
    activeTubeCount,
    selectedTubeCount,
    currentSection,
    handleTubeAction,
    setCurrentSection
  };
};