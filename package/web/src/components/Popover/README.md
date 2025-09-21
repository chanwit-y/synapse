# Popover Components

A comprehensive set of flexible and accessible popover components for React applications.

## Features

- 🎯 **Smart Positioning**: Automatic positioning with collision detection
- 📱 **12 Placement Options**: Top, bottom, left, right with start/center/end alignments
- ♿ **Accessible**: Built with accessibility in mind
- 🎨 **Customizable**: Fully customizable styling with CSS classes
- 🔧 **TypeScript**: Full TypeScript support with comprehensive types
- ⚡ **Performant**: Optimized for performance with minimal re-renders
- 🎭 **Animated**: Smooth animations with CSS transitions
- 🖱️ **Interactive**: Click outside to close, escape key support
- 🔌 **Portal Support**: Renders to document body to avoid z-index issues

## Installation

The components are already included in your project. Simply import them:

```tsx
import { Popover, PopoverTrigger, PopoverContent } from './components/Popover';
```

## Basic Usage

```tsx
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './components/Popover';

function MyComponent() {
  return (
    <Popover>
      <PopoverTrigger>
        Click me
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <h3>Popover Title</h3>
          <p>This is the popover content.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

## Components

### Popover

The root component that manages the popover state.

**Props:**
- `placement?: PopoverPlacement` - Position of the popover (default: 'bottom')
- `offset?: number` - Distance from trigger element (default: 8)
- `closeOnClickOutside?: boolean` - Close when clicking outside (default: true)
- `closeOnEscape?: boolean` - Close when pressing escape (default: true)
- `defaultOpen?: boolean` - Initial open state (default: false)
- `onOpenChange?: (isOpen: boolean) => void` - Callback when open state changes

### PopoverTrigger

The element that triggers the popover when clicked.

**Props:**
- `asChild?: boolean` - Render as child element instead of button (default: false)
- `className?: string` - Additional CSS classes

### PopoverContent

The content container that appears when the popover is open.

**Props:**
- `className?: string` - Additional CSS classes
- `style?: React.CSSProperties` - Inline styles
- `sideOffset?: number` - Additional offset from trigger (default: 8)
- `align?: 'start' | 'center' | 'end'` - Content alignment (default: 'center')
- `avoidCollisions?: boolean` - Avoid viewport collisions (default: true)

### PopoverContentInline

Alternative content component that renders inline instead of using a portal.

## Placement Options

```tsx
type PopoverPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';
```

## Advanced Usage

### Custom Trigger

```tsx
<Popover>
  <PopoverTrigger asChild>
    <button className="custom-button">
      Custom Trigger
    </button>
  </PopoverTrigger>
  <PopoverContent>
    Content here
  </PopoverContent>
</Popover>
```

### Controlled State

```tsx
function ControlledPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger>
        {isOpen ? 'Close' : 'Open'} Popover
      </PopoverTrigger>
      <PopoverContent>
        <p>Popover is {isOpen ? 'open' : 'closed'}</p>
      </PopoverContent>
    </Popover>
  );
}
```

### Form in Popover

```tsx
<Popover>
  <PopoverTrigger>Settings</PopoverTrigger>
  <PopoverContent className="w-80">
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <button type="submit">
          Save
        </button>
      </div>
    </form>
  </PopoverContent>
</Popover>
```

### Using the Hook Directly

```tsx
import { usePopover } from './components/Popover';

function CustomPopover() {
  const popover = usePopover({
    placement: 'top',
    offset: 12,
    onOpenChange: (isOpen) => console.log('Popover is', isOpen ? 'open' : 'closed')
  });

  return (
    <div>
      <button ref={popover.triggerRef} onClick={popover.toggle}>
        Custom Trigger
      </button>
      
      {popover.isOpen && (
        <div
          ref={popover.contentRef}
          style={{
            position: 'fixed',
            left: popover.position.x,
            top: popover.position.y,
            zIndex: 50
          }}
          className="bg-white border rounded shadow-lg p-4"
        >
          Custom content
        </div>
      )}
    </div>
  );
}
```

## Styling

The components use Tailwind CSS classes by default, but you can customize them:

```tsx
<PopoverContent className="bg-blue-50 border-blue-200 text-blue-900">
  Custom styled content
</PopoverContent>
```

### CSS Custom Properties

You can also use CSS custom properties for theming:

```css
.my-popover {
  --popover-bg: #ffffff;
  --popover-border: #e5e7eb;
  --popover-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## Accessibility

The components are built with accessibility in mind:

- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Screen reader compatible
- ✅ Escape key to close
- ✅ Click outside to close

## API Reference

### Types

```typescript
type PopoverPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface PopoverProps {
  children: ReactNode;
  placement?: PopoverPlacement;
  offset?: number;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  avoidCollisions?: boolean;
}
```

## Examples

Check out `PopoverExample.tsx` for comprehensive examples of all features and use cases.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to contribute improvements or report issues. The components are designed to be extensible and customizable.
