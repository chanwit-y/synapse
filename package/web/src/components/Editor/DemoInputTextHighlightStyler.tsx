import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Type, Palette, X } from 'lucide-react';

interface TextSegment {
  text: string;
  styles: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
    backgroundColor: string;
    fontSize: string;
  };
}

interface Selection {
  start: number;
  end: number;
  text: string;
}

const DemoRichTextInputStyler: React.FC = () => {
  const [inputSegments, setInputSegments] = useState<TextSegment[]>([
    { 
      text: "This is sample text in a rich input. Highlight any part to style it!", 
      styles: { bold: false, italic: false, underline: false, color: '#000000', backgroundColor: '#ffffff', fontSize: '16px' }
    }
  ]);
  
  const [textareaSegments, setTextareaSegments] = useState<TextSegment[]>([
    { 
      text: "This is sample text in a rich textarea. You can highlight text here and apply different styles like bold, italic, colors, and more.", 
      styles: { bold: false, italic: false, underline: false, color: '#000000', backgroundColor: '#ffffff', fontSize: '16px' }
    }
  ]);
  
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [activeField, setActiveField] = useState<'input' | 'textarea' | null>(null);
  
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    color: '#000000',
    backgroundColor: '#ffffff',
    fontSize: '16px'
  });
  
  const inputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Convert segments to plain text
  const segmentsToText = (segments: TextSegment[]) => {
    return segments.map(segment => segment.text).join('');
  };

  // Convert plain text back to segments (when typing)
  const textToSegments = (text: string, existingSegments: TextSegment[]): TextSegment[] => {
    const existingText = segmentsToText(existingSegments);
    
    if (text === existingText) return existingSegments;
    
    // Simple case: if text is completely different, create new segment
    if (text.length === 0) return [];
    
    // If text is longer, assume addition at the end
    if (text.length > existingText.length && text.startsWith(existingText)) {
      const newText = text.slice(existingText.length);
      return [
        ...existingSegments,
        { 
          text: newText, 
          styles: { bold: false, italic: false, underline: false, color: '#000000', backgroundColor: '#ffffff', fontSize: '16px' }
        }
      ];
    }
    
    // For other cases, create a single segment with default styles
    return [{ 
      text, 
      styles: { bold: false, italic: false, underline: false, color: '#000000', backgroundColor: '#ffffff', fontSize: '16px' }
    }];
  };

  const handleTextSelection = (element: HTMLDivElement, fieldType: 'input' | 'textarea') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    
    if (selectedText.trim()) {
      // Calculate popover position
      const rect = element.getBoundingClientRect();
      const x = rect.left + (rect.width / 2);
      const y = rect.top - 10;
      
      // Calculate text position within the segments
      const fullText = fieldType === 'input' ? segmentsToText(inputSegments) : segmentsToText(textareaSegments);
      const start = fullText.indexOf(selectedText);
      const end = start + selectedText.length;
      
      setCurrentSelection({ start, end, text: selectedText });
      setActiveField(fieldType);
      setPopoverPosition({ x, y });
      setShowPopover(true);
      
      console.log('Selected text:', selectedText);
    } else {
      setShowPopover(false);
      setCurrentSelection(null);
    }
  };

  const applyStyles = () => {
    if (!currentSelection || !activeField) return;

    const segments = activeField === 'input' ? inputSegments : textareaSegments;
    const setSegments = activeField === 'input' ? setInputSegments : setTextareaSegments;
    
    const newSegments = applyStylesToSegments(segments, currentSelection.start, currentSelection.end, textStyles);
    setSegments(newSegments);
    
    console.log('Applied styles:', textStyles);
    console.log('Updated segments:', newSegments);
    
    // Close popover
    setShowPopover(false);
    setCurrentSelection(null);
  };

  const applyStylesToSegments = (
    segments: TextSegment[], 
    start: number, 
    end: number, 
    newStyles: typeof textStyles
  ): TextSegment[] => {
    const fullText = segmentsToText(segments);
    let currentPos = 0;
    const newSegments: TextSegment[] = [];
    
    for (const segment of segments) {
      const segmentStart = currentPos;
      const segmentEnd = currentPos + segment.text.length;
      
      if (segmentEnd <= start || segmentStart >= end) {
        // Segment is outside selection
        newSegments.push(segment);
      } else if (segmentStart >= start && segmentEnd <= end) {
        // Segment is completely inside selection
        newSegments.push({
          text: segment.text,
          styles: newStyles
        });
      } else {
        // Segment is partially inside selection
        if (segmentStart < start && segmentEnd > start) {
          // Split at start
          const beforeText = segment.text.slice(0, start - segmentStart);
          const afterText = segment.text.slice(start - segmentStart);
          
          newSegments.push({
            text: beforeText,
            styles: segment.styles
          });
          
          if (segmentEnd <= end) {
            // Rest of segment is in selection
            newSegments.push({
              text: afterText,
              styles: newStyles
            });
          } else {
            // Need to split again at end
            const selectedText = afterText.slice(0, end - start);
            const remainingText = afterText.slice(end - start);
            
            newSegments.push({
              text: selectedText,
              styles: newStyles
            });
            newSegments.push({
              text: remainingText,
              styles: segment.styles
            });
          }
        } else if (segmentStart < end && segmentEnd > end) {
          // Split at end
          const selectedText = segment.text.slice(0, end - segmentStart);
          const afterText = segment.text.slice(end - segmentStart);
          
          newSegments.push({
            text: selectedText,
            styles: newStyles
          });
          newSegments.push({
            text: afterText,
            styles: segment.styles
          });
        }
      }
      
      currentPos = segmentEnd;
    }
    
    return newSegments;
  };

  const renderSegments = (segments: TextSegment[]) => {
    return segments.map((segment, index) => {
      const style: React.CSSProperties = {
        color: segment.styles.color,
        backgroundColor: segment.styles.backgroundColor,
        fontSize: segment.styles.fontSize,
        fontWeight: segment.styles.bold ? 'bold' : 'normal',
        fontStyle: segment.styles.italic ? 'italic' : 'normal',
        textDecoration: segment.styles.underline ? 'underline' : 'none',
      };
      
      return (
        <span key={index} style={style}>
          {segment.text}
        </span>
      );
    });
  };

  const handleContentChange = (content: string, fieldType: 'input' | 'textarea') => {
    const segments = fieldType === 'input' ? inputSegments : textareaSegments;
    const setSegments = fieldType === 'input' ? setInputSegments : setTextareaSegments;
    
    const newSegments = textToSegments(content, segments);
    setSegments(newSegments);
  };

  const toggleStyle = (styleType: keyof Pick<typeof textStyles, 'bold' | 'italic' | 'underline'>) => {
    setTextStyles(prev => ({
      ...prev,
      [styleType]: !prev[styleType]
    }));
  };

  const updateStyle = (styleType: keyof typeof textStyles, value: string) => {
    setTextStyles(prev => ({
      ...prev,
      [styleType]: value
    }));
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
        setCurrentSelection(null);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg relative">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Rich Text Editor with Live Style Application
      </h1>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Instructions: Highlight any text in the rich text fields below to apply styles. The text will update immediately.
        </p>
        <button
          onClick={() => console.clear()}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors"
        >
          Clear Console
        </button>
      </div>

      <div className="space-y-6">
        {/* Rich Input Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rich Text Input:
          </label>
          <div
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleContentChange(e.currentTarget.textContent || '', 'input')}
            onMouseUp={() => handleTextSelection(inputRef.current!, 'input')}
            onKeyUp={() => handleTextSelection(inputRef.current!, 'input')}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg min-h-[50px] bg-white"
            style={{ outline: 'none' }}
          >
            {renderSegments(inputSegments)}
          </div>
        </div>

        {/* Rich Textarea Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rich Text Area:
          </label>
          <div
            ref={textareaRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleContentChange(e.currentTarget.textContent || '', 'textarea')}
            onMouseUp={() => handleTextSelection(textareaRef.current!, 'textarea')}
            onKeyUp={() => handleTextSelection(textareaRef.current!, 'textarea')}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg min-h-[120px] bg-white"
            style={{ outline: 'none' }}
          >
            {renderSegments(textareaSegments)}
          </div>
        </div>
      </div>

      {/* Styling Popover */}
      {showPopover && currentSelection && (
        <div
          ref={popoverRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 min-w-80"
          style={{
            left: popoverPosition.x - 160,
            top: popoverPosition.y - 120,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800">Style Selected Text</h3>
            <button
              onClick={() => setShowPopover(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            Selected: "{currentSelection.text}"
          </div>

          {/* Text Style Buttons */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => toggleStyle('bold')}
              className={`p-2 rounded ${textStyles.bold ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-600 hover:text-white transition-colors`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => toggleStyle('italic')}
              className={`p-2 rounded ${textStyles.italic ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-600 hover:text-white transition-colors`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => toggleStyle('underline')}
              className={`p-2 rounded ${textStyles.underline ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-600 hover:text-white transition-colors`}
              title="Underline"
            >
              <Underline size={16} />
            </button>
          </div>

          {/* Color Controls */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Text Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={textStyles.color}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300"
                />
                <span className="text-xs text-gray-600">{textStyles.color}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Background</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={textStyles.backgroundColor}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300"
                />
                <span className="text-xs text-gray-600">{textStyles.backgroundColor}</span>
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-1">Font Size</label>
            <select
              value={textStyles.fontSize}
              onChange={(e) => updateStyle('fontSize', e.target.value)}
              className="w-full p-1 text-sm border border-gray-300 rounded"
            >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
            </select>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyStyles}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Apply Styles
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Select any text in the rich text fields above to apply styles. The text will be visually updated with your chosen formatting.
        </p>
      </div>
    </div>
  );
};

export default DemoRichTextInputStyler;