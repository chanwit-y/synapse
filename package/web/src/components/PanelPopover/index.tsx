import { Bot, ChevronRight, Heading, List, ListOrdered, Palette } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../../components"
import { Input } from "./Input"
import { PreviewColorIcon } from "./PreviewColorIcon"
type Props = {
  children: React.ReactNode
}

type MenuItem = {
  category: string;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  hasSubmenu?: boolean;
  submenu?: {
    title: string;
    items: {
      icon: React.ReactNode;
      label: string;
      color?: string;
      shortcut?: string;
      onClick?: () => void;
    }[];
  }[];
  onClick?: () => void;
};

const items: MenuItem[] = [
  {
    category: 'Transform',
    icon: <Heading size={16} />,
    label: 'Heading 1',
    hasSubmenu: false,
    submenu: []
  },
  {
    category: 'Transform',
    icon: <Heading size={16} />,
    label: 'Heading 2',
    hasSubmenu: false,
    submenu: []
  },
  {
    category: 'Transform',
    icon: <Heading size={16} />,
    label: 'Heading 3',
    hasSubmenu: false,
    submenu: []
  },
  {
    category: 'Style',
    icon: <Palette size={16} />,
    label: 'Color',
    hasSubmenu: true,
    submenu: [
      {
        title: 'Text color',
        items: [
          {
            icon: <PreviewColorIcon className="text-gray-900">A</PreviewColorIcon>,
            label: 'Default text',
            onClick: () => console.log('Default text')
          },
          {
            icon: <PreviewColorIcon className="text-gray-500">A</PreviewColorIcon>,
            label: 'Gray text',
            onClick: () => console.log('Gray text')
          },
          {
            icon: <PreviewColorIcon className="text-amber-700">A</PreviewColorIcon>,
            label: 'Brown text',
            onClick: () => console.log('Brown text')
          },
          {
            icon: <PreviewColorIcon className="text-orange-500">A</PreviewColorIcon>,
            label: 'Orange text',
            onClick: () => console.log('Orange text')
          },
          {
            icon: <PreviewColorIcon className="text-yellow-500">A</PreviewColorIcon>,
            label: 'Yellow text',
            onClick: () => console.log('Yellow text')
          },
          {
            icon: <PreviewColorIcon className="text-green-500">A</PreviewColorIcon>,
            label: 'Green text',
            onClick: () => console.log('Green text')
          },
          {
            icon: <PreviewColorIcon className="text-blue-500">A</PreviewColorIcon>,
            label: 'Blue text',
            onClick: () => console.log('Blue text')
          },
          {
            icon: <PreviewColorIcon className="text-purple-500">A</PreviewColorIcon>,
            label: 'Purple text',
            onClick: () => console.log('Purple text')
          },
          {
            icon: <PreviewColorIcon className="text-pink-500">A</PreviewColorIcon>,
            label: 'Pink text',
            onClick: () => console.log('Pink text')
          },
          {
            icon: <PreviewColorIcon className="text-red-500">A</PreviewColorIcon>,
            label: 'Red text',
            onClick: () => console.log('Red text')
          },
        ]
      },
      {
        title: 'Background color',
        items: [
          {
            icon: <PreviewColorIcon className="bg-white border border-gray-300 rounded">A</PreviewColorIcon>,
            label: 'Default background',
            onClick: () => console.log('Default background')
          },
          {
            icon: <PreviewColorIcon className="bg-gray-200 rounded">A</PreviewColorIcon>,
            label: 'Gray background',
            onClick: () => console.log('Gray background')
          },
          {
            icon: <PreviewColorIcon className="bg-amber-100 rounded">A</PreviewColorIcon>,
            label: 'Brown background',
            onClick: () => console.log('Brown background')
          },
          {
            icon: <PreviewColorIcon className="bg-orange-100 rounded">A</PreviewColorIcon>,
            label: 'Orange background',
            onClick: () => console.log('Orange background')
          },
          {
            icon: <PreviewColorIcon className="bg-yellow-100 rounded">A</PreviewColorIcon>,
            label: 'Yellow background',
            onClick: () => console.log('Yellow background')
          },
          {
            icon: <PreviewColorIcon className="bg-green-100 rounded">A</PreviewColorIcon>,
            label: 'Green background',
            onClick: () => console.log('Green background')
          },
        ]
      }
    ]
  },
  {
    category: 'Format',
    icon: <List size={16} />,
    label: 'List format',
    hasSubmenu: true,
    submenu: [
      {
        title: 'Lists',
        items: [
          { icon: <List size={16} />, label: 'Bulleted list', onClick: () => console.log('Bullet list') },
          { icon: <ListOrdered size={16} />, label: 'Numbered list', onClick: () => console.log('Number list') },
        ]
      }
    ]
  },
  // {
  //   category: 'Actions',
  //   icon: <Link size={16} />,
  //   label: 'Copy link to block',
  //   shortcut: 'Alt+⌘+L',
  //   onClick: () => console.log('Copy link')
  // },
  // {
  //   category: 'Actions',
  //   icon: <Copy size={16} />,
  //   label: 'Duplicate',
  //   shortcut: 'Ctrl+D',
  //   onClick: () => console.log('Duplicate')
  // },
  // {
  //   category: 'Actions',
  //   icon: <Move size={16} />,
  //   label: 'Move to',
  //   shortcut: 'Ctrl+⇧+P',
  //   onClick: () => console.log('Move to')
  // },
  // {
  //   category: 'Actions',
  //   icon: <Trash2 size={16} />,
  //   label: 'Delete',
  //   shortcut: 'Del',
  //   onClick: () => console.log('Delete')
  // },
]

const PanelPopover = ({
  children
}: Props) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const [, setIsPopoverOpen] = useState(false);

  const handleItemClick = (item: MenuItem, index: number, event: React.MouseEvent) => {
    if (item.hasSubmenu) {
      const rect = event.currentTarget.getBoundingClientRect();
      setSubmenuPosition({
        x: rect.right + 8,
        y: rect.top
      });
      setActiveSubmenu(index);
    } else {
      item.onClick?.();
      setActiveSubmenu(null);
    }
  };

  const handleMouseEnter = (item: MenuItem, index: number, event: React.MouseEvent) => {
    if (item.hasSubmenu) {
      const rect = event.currentTarget.getBoundingClientRect();
      setSubmenuPosition({
        x: rect.right + 8,
        y: rect.top
      });
      setActiveSubmenu(index);
    } else {
      // Hide submenu when hovering over items without submenu
      setActiveSubmenu(null);
    }
  };

  // const handleMenuItemMouseLeave = () => {
  //   // Close submenu when leaving any menu item
  //   // Small delay to allow moving to submenu if it exists
  //   setTimeout(() => {
  //     setActiveSubmenu(null);
  //   }, 100);
  // };

  // const handlePopoverMouseLeave = () => {
  //   // Close submenu when leaving the main popover, but only if not hovering over submenu
  //   setTimeout(() => {
  //     setActiveSubmenu(null);
  //   }, 150); // Small delay to allow moving to submenu
  // };

  const handleSubmenuMouseEnter = () => {
    // Keep submenu open when entering it
  };

  const handleSubmenuMouseLeave = () => {
    // Close submenu when leaving it
    setTimeout(() => {
      setActiveSubmenu(null);
    }, 500);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setActiveSubmenu(null);
    }
  };

  return (
    <>
      <Popover placement="bottom-start" onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger className="text-sm font-medium text-gray-700 transition-colors">
          {children}
        </PopoverTrigger>
        <PopoverContent
          className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
          style={{ padding: '8px' }}
        // onMouseLeave={handlePopoverMouseLeave}
        >
          <div>
            {/* Search input */}
            {/* Search input */}
            <Input />

            {/* Menu items */}
            <div className="border-t border-gray-100">
              {/* <div className="py-1">
                <div className="text-xs text-gray-500 py-1 px-2 font-bold">Bulleted list</div>
              </div> */}

              {items.map((item, index) => (
                <button
                  key={index}
                  className="px-2 cursor-pointer w-full flex items-center py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md transition-colors"
                  onClick={(e) => handleItemClick(item, index, e)}
                  onMouseEnter={(e) => handleMouseEnter(item, index, e)}
                >
                  <span className="mr-1">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronRight size={14} className="text-gray-400" />
                  )}
                  {item.shortcut && !item.hasSubmenu && (
                    <span className="text-xs text-gray-400">{item.shortcut}</span>
                  )}
                </button>
              ))}

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button className="px-2 cursor-pointer w-full flex items-center py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md transition-colors">
                  <Bot size={16} className="mr-1" />
                  <span className="flex-1 text-left">Ask AI</span>
                  <span className="text-xs text-gray-400">Ctrl+J</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 mt-1 px-3 py-2">
              <div className="text-xs text-gray-500">
                Last edited by <span className="font-medium">Kukiat Wangtaphan</span>
              </div>
              <div className="text-xs text-gray-400">Today at 5:47 PM</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Submenu */}
      {activeSubmenu !== null && items[activeSubmenu]?.submenu && (
        <div
          className="fixed z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          style={{
            left: submenuPosition.x,
            top: submenuPosition.y,
            maxHeight: '400px'
          }}
          onMouseEnter={handleSubmenuMouseEnter}
          onMouseLeave={handleSubmenuMouseLeave}
        >
          <div className="overflow-y-auto max-h-96 p-1" style={{ padding: '8px' }}>
            {items[activeSubmenu].submenu?.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="py-1">
                  <div className="text-xs text-gray-500 py-1 px-2 font-bold">{section.title}</div>
                </div>
                {section.items.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    className="px-2 cursor-pointer w-full flex items-center py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md transition-colors"
                    onClick={() => {
                      subItem.onClick?.();
                      setActiveSubmenu(null);
                    }}
                  >
                    <span className="mr-1">{subItem.icon}</span>
                    <span className="flex-1 text-left">{subItem.label}</span>
                    {subItem.shortcut && (
                      <span className="text-xs text-gray-400">{subItem.shortcut}</span>
                    )}
                  </button>
                ))}
                {sectionIndex < items[activeSubmenu].submenu!.length - 1 && (
                  <div className="border-t border-gray-100 my-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
};

export default PanelPopover;
