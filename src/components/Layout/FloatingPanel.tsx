// src/components/Layout/FloatingPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Paper, Box, IconButton, Typography, Divider } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

interface FloatingPanelProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  onClose?: () => void;
  zIndex?: number;
  bringToFront: () => void;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  minWidth = 300,
  minHeight = 200,
  onClose,
  zIndex = 1,
  bringToFront,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [previousSize, setPreviousSize] = useState(initialSize);
  const [previousPosition, setPreviousPosition] = useState(initialPosition);
  
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle panel dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    bringToFront();
    
    if (isMaximized) return;
    
    setIsDragging(true);
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Handle panel resizing
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    if (e.button !== 0) return; // Only left mouse button
    e.stopPropagation();
    bringToFront();
    
    if (isMaximized) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    } else if (isResizing && resizeDirection && !isMaximized) {
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;

      let newWidth = size.width;
      let newHeight = size.height;
      let newX = position.x;
      let newY = position.y;

      if (resizeDirection.includes('e')) {
        newWidth = Math.max(minWidth, e.clientX - rect.left);
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(minHeight, e.clientY - rect.top);
      }
      if (resizeDirection.includes('w')) {
        const deltaX = rect.left - e.clientX;
        newWidth = Math.max(minWidth, size.width + deltaX);
        if (newWidth !== size.width) {
          newX = position.x - deltaX;
        }
      }
      if (resizeDirection.includes('n')) {
        const deltaY = rect.top - e.clientY;
        newHeight = Math.max(minHeight, size.height + deltaY);
        if (newHeight !== size.height) {
          newY = position.y - deltaY;
        }
      }

      setSize({ width: newWidth, height: newHeight });
      if (resizeDirection.includes('w') || resizeDirection.includes('n')) {
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setSize(previousSize);
      setPosition(previousPosition);
      setIsMaximized(false);
    } else {
      setPreviousSize(size);
      setPreviousPosition(position);
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setPosition({ x: 20, y: 20 });
      setIsMaximized(true);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection, dragOffset, position, size, isMaximized]);

  return (
    <Paper
      ref={panelRef}
      elevation={3}
      sx={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '250px' : `${size.width}px`,
        height: isMinimized ? '40px' : `${size.height}px`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 1,
        zIndex,
        transition: 'height 0.2s ease-in-out',
      }}
    >
      {/* Header / Title bar */}
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        <DragIndicatorIcon sx={{ mr: 1 }} />
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          {title}
        </Typography>
        <IconButton
          size="small"
          onClick={handleMinimize}
          sx={{ color: 'primary.contrastText', p: 0.5 }}
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleMaximize}
          sx={{ color: 'primary.contrastText', p: 0.5 }}
        >
          {isMaximized ? <CloseFullscreenIcon fontSize="small" /> : <OpenInFullIcon fontSize="small" />}
        </IconButton>
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: 'primary.contrastText', p: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          display: isMinimized ? 'none' : 'flex',
          flexDirection: 'column',
          height: isMinimized ? 0 : '100%',
        }}
      >
        {children}
      </Box>
      
      {/* Resize handles - only show when not minimized or maximized */}
      {!isMinimized && !isMaximized && (
        <>
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 16,
              height: 16,
              cursor: 'nwse-resize',
              zIndex: 2,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 16,
              height: 16,
              cursor: 'nesw-resize',
              zIndex: 2,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: 16,
              height: 16,
              cursor: 'nesw-resize',
              zIndex: 2,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 16,
              height: 16,
              cursor: 'nwse-resize',
              zIndex: 2,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 0,
              left: 16,
              height: 8,
              cursor: 's-resize',
              zIndex: 2,
            }}
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 16,
              width: 8,
              top: 16,
              cursor: 'e-resize',
              zIndex: 2,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 16,
              width: 8,
              top: 16,
              cursor: 'w-resize',
              zIndex: 2,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              top: 0,
              left: 16,
              height: 8,
              cursor: 'n-resize',
              zIndex: 2,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
        </>
      )}
    </Paper>
  );
};

export default FloatingPanel;