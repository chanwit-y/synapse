import React, { useState } from 'react';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  type PopoverPlacement 
} from './index';

export const PopoverExample: React.FC = () => {
  const [placement, setPlacement] = useState<PopoverPlacement>('bottom');

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Popover Components</h1>
        <p className="text-gray-600">
          A collection of flexible and accessible popover components for React.
        </p>
      </div>

      {/* Basic Example */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Basic Popover</h2>
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Click me
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Basic Popover</h3>
                <p className="text-sm text-gray-600">
                  This is a basic popover with some content. It will automatically position itself
                  to avoid going off-screen.
                </p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                    Cancel
                  </button>
                  <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
                    Confirm
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Placement Examples */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Placement Options</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <label className="text-sm font-medium text-gray-700">Choose placement:</label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as PopoverPlacement)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="top">Top</option>
              <option value="top-start">Top Start</option>
              <option value="top-end">Top End</option>
              <option value="bottom">Bottom</option>
              <option value="bottom-start">Bottom Start</option>
              <option value="bottom-end">Bottom End</option>
              <option value="left">Left</option>
              <option value="left-start">Left Start</option>
              <option value="left-end">Left End</option>
              <option value="right">Right</option>
              <option value="right-start">Right Start</option>
              <option value="right-end">Right End</option>
            </select>
          </div>
          
          <div className="flex justify-center">
            <Popover placement={placement}>
              <PopoverTrigger className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                {placement} placement
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Placement: {placement}
                  </h3>
                  <p className="text-sm text-gray-600">
                    This popover is positioned using the "{placement}" placement.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Custom Styling */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Custom Styling</h2>
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 shadow-lg">
              Styled Popover
            </PopoverTrigger>
            <PopoverContent className="w-96 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h3 className="font-semibold text-purple-900">Custom Styled Popover</h3>
                </div>
                <p className="text-purple-700 text-sm leading-relaxed">
                  You can fully customize the appearance of popovers using CSS classes.
                  This example uses a gradient background and custom colors.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white bg-opacity-50 rounded text-xs text-purple-800">
                    Feature 1
                  </div>
                  <div className="p-2 bg-white bg-opacity-50 rounded text-xs text-purple-800">
                    Feature 2
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Form Example */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Form in Popover</h2>
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              Quick Settings
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <form className="space-y-4">
                <h3 className="font-medium text-gray-900">Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
                    Enable notifications
                  </label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-indigo-500 text-white text-sm hover:bg-indigo-600 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Multiple Popovers */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Multiple Popovers</h2>
        <div className="flex justify-center space-x-4">
          <Popover>
            <PopoverTrigger className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Popover 1
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">First Popover</h3>
                <p className="text-sm text-gray-600">
                  This is the first popover. Multiple popovers can be used independently.
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Popover 2
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">Second Popover</h3>
                <p className="text-sm text-gray-600">
                  This is the second popover. Each maintains its own state.
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
              Popover 3
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">Third Popover</h3>
                <p className="text-sm text-gray-600">
                  This is the third popover. They can all be open at the same time.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <div className="prose prose-sm max-w-none">
          <p className="mb-4">
            The Popover components provide a flexible way to display contextual content.
            Here's how to use them:
          </p>
          
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { Popover, PopoverTrigger, PopoverContent } from './components';

<Popover placement="bottom" offset={8}>
  <PopoverTrigger>
    Click me
  </PopoverTrigger>
  <PopoverContent>
    <div>Your content here</div>
  </PopoverContent>
</Popover>`}
          </pre>

          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Automatic positioning with collision detection</li>
              <li>12 different placement options</li>
              <li>Click outside to close</li>
              <li>Escape key to close</li>
              <li>Fully customizable styling</li>
              <li>TypeScript support</li>
              <li>Accessible by default</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
