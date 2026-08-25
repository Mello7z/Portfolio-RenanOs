import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { safeStorage } from '../../utils/storage';
import { APPS, APP_ORDER, getLocalizedApp } from './AppsConfig';
import { AppIcon } from './AppIcon';
import type { AppId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Position {
  x: number;
  y: number;
}

interface DesktopIconsProps {
  onOpen: (id: AppId) => void;
  resetTrigger?: number; // Used to signal layout reset
}

// Helper to generate default 2-column layout (Alinhado em Filas Perfeitas)
export function getDefaultTwoColumnPositions(): Record<string, Position> {
  const items = APP_ORDER.filter((id) => APPS[id].onDesktop);
  const posMap: Record<string, Position> = {};

  const colWidth = 90;
  const rowHeight = 88;
  const startX = 20;
  const startY = 48;

  items.forEach((id, index) => {
    const col = index % 2; // 2 fileiras bem alinhadas
    const row = Math.floor(index / 2);

    posMap[id] = {
      x: startX + col * colWidth,
      y: startY + row * rowHeight,
    };
  });

  return posMap;
}

export function DesktopIcons({ onOpen, resetTrigger }: DesktopIconsProps) {
  const { language } = useLanguage();
  const items = APP_ORDER.filter((id) => APPS[id].onDesktop);

  const [positions, setPositions] = useState<Record<string, Position>>(() => {
    const saved = safeStorage.getItem('renanos_desktop_icon_positions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all desktop items have a position
        const defaults = getDefaultTwoColumnPositions();
        return { ...defaults, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved icon positions', e);
      }
    }
    return getDefaultTwoColumnPositions();
  });

  // Track dragging state
  const [draggingId, setDraggingId] = useState<AppId | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number }>({
    mouseX: 0,
    mouseY: 0,
    initialX: 0,
    initialY: 0,
  });
  const hasMovedRef = useRef<boolean>(false);

  // Save positions when changed
  useEffect(() => {
    safeStorage.setItem('renanos_desktop_icon_positions', JSON.stringify(positions));
  }, [positions]);

  // Reset positions if resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      const fresh = getDefaultTwoColumnPositions();
      setPositions(fresh);
      safeStorage.setItem('renanos_desktop_icon_positions', JSON.stringify(fresh));
    }
  }, [resetTrigger]);

  function handleMouseDown(e: MouseEvent, id: AppId) {
    if (e.button !== 0) return; // Only left click drags
    e.stopPropagation();

    const currentPos = positions[id] || { x: 20, y: 56 };
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
    };
    hasMovedRef.current = false;
    setDraggingId(id);
  }

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!draggingId) return;

      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        hasMovedRef.current = true;
      }

      const newX = Math.max(10, Math.min(window.innerWidth - 80, dragStartRef.current.initialX + deltaX));
      const newY = Math.max(45, Math.min(window.innerHeight - 100, dragStartRef.current.initialY + deltaY));

      setPositions((prev) => ({
        ...prev,
        [draggingId]: { x: newX, y: newY },
      }));
    }

    function handleMouseUp() {
      if (draggingId) {
        // Snap to clean grid rows and columns
        setPositions((prev) => {
          const current = prev[draggingId];
          if (!current) return prev;
          const gridX = Math.max(20, Math.round((current.x - 20) / 90) * 90 + 20);
          const gridY = Math.max(48, Math.round((current.y - 48) / 88) * 88 + 48);
          return {
            ...prev,
            [draggingId]: { x: gridX, y: gridY },
          };
        });
        setDraggingId(null);
      }
    }

    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId]);

  function handleClick(id: AppId) {
    if (!hasMovedRef.current) {
      onOpen(id);
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {items.map((id) => {
        const meta = getLocalizedApp(id, language);
        const pos = positions[id] || { x: 20, y: 56 };
        const isDragging = draggingId === id;

        return (
          <div
            key={id}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            }}
            onMouseDown={(e) => handleMouseDown(e, id)}
            onClick={() => handleClick(id)}
            className={`absolute top-0 left-0 pointer-events-auto group flex flex-col items-center gap-1 rounded-2xl p-2 w-[76px] cursor-grab active:cursor-grabbing transition-shadow duration-150 ${
              isDragging ? 'z-30 opacity-90 scale-105' : 'hover:z-20'
            }`}
          >
            <span className="grid size-12 place-items-center rounded-2xl border border-amber-500/35 bg-[#0e111a]/80 text-amber-400 backdrop-blur-md shadow-xl transition-all duration-200 group-hover:scale-110 group-hover:border-amber-400 group-hover:bg-[#161c2d] group-hover:shadow-[0_0_22px_rgba(251,191,36,0.4)]">
              <AppIcon appId={id} className="size-6" />
            </span>
            <span className="font-mono text-[11px] font-semibold tracking-wide text-zinc-200 text-center leading-tight [text-shadow:0_1px_4px_rgba(0,0,0,0.95)] group-hover:text-amber-300">
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
