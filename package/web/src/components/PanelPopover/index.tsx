import { Heading, List, ListOrdered } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../../components"
import { Input } from "./Input"
type Props = {
  children: React.ReactNode
}

const items: {
  category: string;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick?: () => void;
}[] = [
    {
      category: 'Text',
      icon: <Heading size={16} />,
      label: 'Heading 1',
      shortcut: '',
      onClick: () => {
        console.log('Turn into');
      }
    },
    {
      category: 'Text',
      icon: <Heading size={16} />,
      label: 'Heading 2',
      shortcut: '',
      onClick: () => {
        console.log('Turn into');
      }
    },
    {
      category: 'Text',
      icon: <Heading size={16} />,
      label: 'Heading 3',
      shortcut: '',
      onClick: () => {
        console.log('Turn into');
      }
    },
    {
      category: 'Text',
      icon: <List size={16} />,
      label: 'Bullet list',
      shortcut: '',
      onClick: () => {
        console.log('Turn into');
      }
    },
    {
      category: 'Text',
      icon: <ListOrdered size={16} />,
      label: 'Number list',
      shortcut: '',
      onClick: () => {
        console.log('Turn into');
      }
    },
  ]

const PanelPopover = ({
  children
}: Props) => {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger className="text-sm font-medium text-gray-700 transition-colors">
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-1" style={{ padding: '8px' }}>
        <div>
          {/* Search input */}
          <Input />

          {/* Menu items */}
          <div className="border-t border-gray-100">
            <div className="py-1">
              <div className="text-xs text-gray-500 py-1 px-2 font-bold">Text</div>
            </div>

            {items.map((item, index) => (
              <button
                key={index}
                className="px-2 cursor-pointer w-full flex items-center py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md transition-colors"
                onClick={item.onClick}
              >
                <span className="mr-1">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-400">{item.shortcut}</span>
                )}
              </button>
            ))}

            <div className="border-t border-gray-100 mt-1 pt-1">
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                <span className="mr-3">🤖</span>
                <span className="flex-1 text-left">Ask AI</span>
                <span className="text-xs text-gray-400">Ctrl+J</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          {/* <div className="border-t border-gray-100 mt-1 px-3 py-2">
            <div className="text-xs text-gray-500">
              Last edited by <span className="font-medium">Kukiat Wangtaphan</span>
            </div>
            <div className="text-xs text-gray-400">Today at 5:36 PM</div>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  )
};

export default PanelPopover;
