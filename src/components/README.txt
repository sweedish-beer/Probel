# Floating Panel System Documentation

This document explains the floating panel system implemented in the Probel application, which allows multiple resizable, draggable panels to be open simultaneously.

## System Components

The system consists of the following components:

### 1. FloatingPanel Component (`src/components/Layout/FloatingPanel.tsx`)

The base component that provides the floating window functionality:

- **Draggable**: Users can move panels by dragging the title bar
- **Resizable**: Panels can be resized from any edge or corner
- **Window Controls**: Minimize, maximize, and close buttons
- **Z-index Management**: Brings panels to the front when clicked

### 2. PanelManager Component (`src/components/Layout/PanelManager.tsx`)

Manages all the floating panels:

- **Panel Creation**: Provides interfaces to create different types of panels
- **Z-index Handling**: Ensures the active panel is always on top
- **Panel Removal**: Handles closing panels
- **Panel Collection**: Keeps track of all open panels

### 3. Panel Wrapper Components

Each main feature has a panel wrapper to properly fit into the floating panel system:

- **NotePanel**: Wraps the NotePage component
- **FlowchartPanel**: Wraps the FlowchartPage component
- **AIChatPanel**: Wraps the AIChatPage component

### 4. MainLayoutWithPanels Component

A replacement for the original MainLayout that uses the panel system.

## Usage Instructions

### Creating Panels

The user can create new panels in two ways:

1. **Using the Speed Dial**: Click the floating action button in the bottom right corner to access the menu.
2. **Using the Quick Buttons**: Click one of the buttons in the bottom left corner.

### Panel Interaction

- **Move**: Drag the title bar to reposition the panel.
- **Resize**: Drag any edge or corner to resize the panel.
- **Minimize**: Click the minimize button to collapse the panel to just its title bar.
- **Maximize**: Click the maximize button to expand the panel to fill the workspace.
- **Close**: Click the X button to close the panel.
- **Focus**: Click anywhere on a panel to bring it to the front.

## Future Enhancements

Possible future improvements to the panel system:

1. **Layout Persistence**: Save panel positions and sizes between sessions
2. **Snap-to-Grid**: Make panels align neatly with each other
3. **Panel Grouping**: Allow panels to be tabbed together
4. **Panel Presets**: Create predefined layouts of multiple panels
5. **Context Awareness**: Have panels that are aware of each other's content

## Implementation Notes

- The floating panel system completely replaces the previous sidebar navigation.
- The core functionality is independent of the specific panel content, making it easy to add new panel types.
- The system is responsive and should work well on both desktop and tablet devices.
- Each panel maintains its own state, so you can have multiple instances of the same panel type.