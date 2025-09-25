import { useSortable } from "@dnd-kit/sortable";
// import { MoveIcon } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { CSS } from '@dnd-kit/utilities';
import { Bold, Italic, Underline, ChevronDown, Palette, Heading1, Heading2, Heading3, Highlighter, Type, List, ListOrdered, Plus } from "lucide-react";

const MoveIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="currentColor"
		style={{ cursor: 'grab' }}
	>
		<path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" />
	</svg>
);
type BlockInputProps = {
	id: string
	onAddNewItem: (currentId: string) => void;
	shouldFocus?: boolean;
}

const BlockInput = forwardRef<HTMLDivElement, BlockInputProps>(({ id, onAddNewItem, shouldFocus = false }) => {

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

	const inputRef = useRef<HTMLDivElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	// Popover state
	const [showPopover, setShowPopover] = useState<boolean>(false);
	const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
	const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [currentSelection, setCurrentSelection] = useState<Range | null>(null);

	// Color dropdown state
	const [showColorDropdown, setShowColorDropdown] = useState<boolean>(false);

	// Font size dropdown state
	const [showFontSizeDropdown, setShowFontSizeDropdown] = useState<boolean>(false);

	// Bullet list dropdown state
	const [showBulletDropdown, setShowBulletDropdown] = useState<boolean>(false);

	// Focus the contentEditable div when shouldFocus is true
	useEffect(() => {
		if (shouldFocus && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		}
	}, [shouldFocus]);

	// Close popover when clicking outside or selecting other areas
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
				popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
				hidePopover();
			}
		};

		const handleSelectionChange = () => {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				// Check if the selection is outside our input element
				if (inputRef.current && !inputRef.current.contains(range.commonAncestorContainer)) {
					hidePopover();
				}
			}
		};

		if (showPopover) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('selectionchange', handleSelectionChange);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('selectionchange', handleSelectionChange);
		};
	}, [showPopover]);

	const showPopoverWithAnimation = () => {
		setShowPopover(true);
		// Trigger fade in after render
		setTimeout(() => setIsPopoverVisible(true), 10);
	};

	const hidePopover = () => {
		setIsPopoverVisible(false);
		setShowColorDropdown(false);
		setShowFontSizeDropdown(false);
		setShowBulletDropdown(false);
		// Hide popover after fade out animation completes
		setTimeout(() => {
			setShowPopover(false);
		}, 200);
	};

	const handleTextSelection = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;
		const selectedText = selection?.toString();

		if (selectedText.trim()) {
			const rect = inputRef.current?.getBoundingClientRect();
			if (rect) {
				const range = selection.getRangeAt(0);
				setCurrentSelection(range.cloneRange()); // Store the selection range

				const x = rect.left + 150;
				const y = rect.top - 10;

				setPopoverPosition({ x, y });
				showPopoverWithAnimation();
			}
		} else {
			hidePopover();
			setCurrentSelection(null);
		}
	}, [inputRef])



	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		// backgroundColor: color,
		opacity: isDragging ? 0.5 : 1,
		borderRadius: '4px',
		userSelect: 'none' as const,
		// fontWeight: 'bold',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		border: '2px solid rgba(255,255,255,0.2)',
	};

	const handleStyle = {
		display: 'flex',
		alignItems: 'center',
		borderRadius: '4px',
		// backgroundColor: 'rgba(255,255,255,0.2)',
		transition: 'background-color 0.2s',
	};


	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			if (e.shiftKey) {
				// Shift+Enter: Insert a new line within the current block
				e.preventDefault();

				// Insert a line break at the current cursor position
				const selection = window.getSelection();
				if (selection && selection.rangeCount > 0) {
					const range = selection.getRangeAt(0);
					const br = document.createElement('br');
					range.deleteContents();
					range.insertNode(br);

					// Move cursor after the line break
					range.setStartAfter(br);
					range.setEndAfter(br);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			} else {
				// Regular Enter: Check if we're in a list and continue formatting
				e.preventDefault();

				// Check if cursor is currently inside a list
				const selection = window.getSelection();
				let listType = null;
				let listStyle = null;

				if (selection && selection.rangeCount > 0) {
					const range = selection.getRangeAt(0);
					let currentElement = range.startContainer;

					// Traverse up the DOM to find list elements
					while (currentElement && currentElement !== inputRef.current) {
						if (currentElement.nodeType === Node.ELEMENT_NODE) {
							const element = currentElement as HTMLElement;
							if (element.tagName === 'UL') {
								listType = 'ul';
								listStyle = element.style.listStyleType || 'disc';
								break;
							} else if (element.tagName === 'OL') {
								listType = 'ol';
								break;
							} else if (element.tagName === 'LI') {
								// Continue traversing to find the parent list
								currentElement = currentElement.parentNode as Node;
								continue;
							}
						}
						currentElement = currentElement.parentNode as Node;
					}
				}

				// Create new block and apply list formatting if needed
				onAddNewItem(id);

				// If we were in a list, apply the same list formatting to the new block
				if (listType) {
					setTimeout(() => {
						// Find the newly created block that comes after the current block
						const currentBlockElement = inputRef.current?.closest('[data-rbd-draggable-id], .sortable-item') || inputRef.current?.parentElement;
						let nextBlock = null;

						if (currentBlockElement) {
							// Look for the next sibling that contains a block-input-editor
							let nextSibling = currentBlockElement.nextElementSibling;
							while (nextSibling) {
								const blockEditor = nextSibling.querySelector('.block-input-editor');
								if (blockEditor) {
									nextBlock = blockEditor as HTMLElement;
									break;
								}
								nextSibling = nextSibling.nextElementSibling;
							}
						}

						// Fallback: if we can't find the next block by traversal, find by focus state
						if (!nextBlock) {
							const allBlocks = document.querySelectorAll('.block-input-editor');
							// The newly created block should be the one that just received focus
							nextBlock = document.activeElement?.closest('.block-input-editor') as HTMLElement;

							// If that doesn't work, find the first empty block after the current one
							if (!nextBlock) {
								const currentBlockIndex = Array.from(allBlocks).indexOf(inputRef.current!);
								if (currentBlockIndex >= 0 && currentBlockIndex < allBlocks.length - 1) {
									nextBlock = allBlocks[currentBlockIndex + 1] as HTMLElement;
								}
							}
						}

						if (nextBlock) {
							nextBlock.focus();

							// Select all content in the new block
							const selection = window.getSelection();
							if (selection) {
								const range = document.createRange();
								range.selectNodeContents(nextBlock);
								selection.removeAllRanges();
								selection.addRange(range);

								// Apply the same list formatting
								if (listType === 'ul') {
									document.execCommand('insertUnorderedList', false);
									if (listStyle && listStyle !== 'disc') {
										const newLists = nextBlock.querySelectorAll('ul');
										const newList = newLists[newLists.length - 1];
										if (newList) {
											(newList as HTMLElement).style.listStyleType = listStyle;
										}
									}
								} else if (listType === 'ol') {
									document.execCommand('insertOrderedList', false);
								}

								// Position cursor at the end
								range.collapse(false);
								selection.removeAllRanges();
								selection.addRange(range);
							}
						}
					}, 50); // Small delay to ensure new block is created
				}
			}
		}
	}, [id, onAddNewItem])

	const applyBoldFormatting = useCallback(() => {
		if (!currentSelection || !inputRef.current) return;

		// Restore the selection
		const selection = window.getSelection();
		if (!selection) return;

		selection.removeAllRanges();
		selection.addRange(currentSelection);

		// Check if the selected text is already bold
		const selectedText = currentSelection.toString();
		if (!selectedText.trim()) return;

		// Use document.execCommand to apply bold formatting
		try {
			document.execCommand('bold', false);
			hidePopover();
			setCurrentSelection(null);
		} catch (error) {
			console.error('Failed to apply bold formatting:', error);
		}
	}, [currentSelection])

	const applyItalicFormatting = useCallback(() => {
		if (!currentSelection || !inputRef.current) return;

		// Restore the selection
		const selection = window.getSelection();
		if (!selection) return;

		selection.removeAllRanges();
		selection.addRange(currentSelection);

		const selectedText = currentSelection.toString();
		if (!selectedText.trim()) return;

		// Use document.execCommand to apply italic formatting
		try {
			document.execCommand('italic', false);
			hidePopover();
			setCurrentSelection(null);
		} catch (error) {
			console.error('Failed to apply italic formatting:', error);
		}
	}, [currentSelection])

	const applyUnderlineFormatting = useCallback(() => {
		if (!currentSelection || !inputRef.current) return;

		// Restore the selection
		const selection = window.getSelection();
		if (!selection) return;

		selection.removeAllRanges();
		selection.addRange(currentSelection);

		const selectedText = currentSelection.toString();
		if (!selectedText.trim()) return;

		// Use document.execCommand to apply underline formatting
		try {
			document.execCommand('underline', false);
			hidePopover();
			setCurrentSelection(null);
		} catch (error) {
			console.error('Failed to apply underline formatting:', error);
		}
	}, [currentSelection])

	const applyColorFormatting = useCallback((color: string) => {
		if (!currentSelection || !inputRef.current) return;

		// Restore the selection
		const selection = window.getSelection();
		if (!selection) return;

		selection.removeAllRanges();
		selection.addRange(currentSelection);

		const selectedText = currentSelection.toString();
		if (!selectedText.trim()) return;

		// Use document.execCommand to apply color formatting
		try {
			document.execCommand('foreColor', false, color);
			setShowColorDropdown(false);
			hidePopover();
			setCurrentSelection(null);
		} catch (error) {
			console.error('Failed to apply color formatting:', error);
		}
	}, [currentSelection])

	const applyHeadingFormatting = useCallback((headingLevel: string) => {
		if (!currentSelection || !inputRef.current) return;

		// Restore the selection
		const selection = window.getSelection();
		if (!selection) return;

		selection.removeAllRanges();
		selection.addRange(currentSelection);

		const selectedText = currentSelection.toString();
		if (!selectedText.trim()) return;

		// Use document.execCommand to apply heading formatting with proper HTML tag format
		try {
			document.execCommand('formatBlock', false, `<${headingLevel}>`);
			hidePopover();
			setCurrentSelection(null);
		} catch (error) {
			console.error('Failed to apply heading formatting:', error);
		}
	}, [currentSelection])

	const applyHighlightFormatting = useCallback(() => {
		if (!currentSelection || !inputRef.current) return;

		// Restore the selection
		const selection = window.getSelection();
		if (!selection) return;

		selection.removeAllRanges();
		selection.addRange(currentSelection);

		const selectedText = currentSelection.toString();
		if (!selectedText.trim()) return;

		// Use document.execCommand to apply highlight (background color)
		try {
			document.execCommand('backColor', false, '#ffff00'); // Yellow highlight
			hidePopover();
			setCurrentSelection(null);
		} catch (error) {
			console.error('Failed to apply highlight formatting:', error);
		}
	}, [currentSelection])

	const applyFontSizeFormatting = useCallback((fontSize: string) => {
		if (!currentSelection || !inputRef.current) return;

		// Restore the selection
		const selection = window.getSelection();
		if (!selection) return;

		selection.removeAllRanges();
		selection.addRange(currentSelection);

		const selectedText = currentSelection.toString();
		if (!selectedText.trim()) return;

		// Create a span element with the desired font size
		try {
			// Use document.execCommand to wrap the selection with a font size
			document.execCommand('fontSize', false, '7'); // Use largest size first

			// Then find the font element and replace it with a span with custom size
			const fontElements = inputRef.current.querySelectorAll('font[size="7"]');
			fontElements.forEach(fontEl => {
				const span = document.createElement('span');
				span.style.fontSize = fontSize;
				span.innerHTML = fontEl.innerHTML;
				fontEl.parentNode?.replaceChild(span, fontEl);
			});

			setShowFontSizeDropdown(false);
			hidePopover();
			setCurrentSelection(null);
		} catch (error) {
			console.error('Failed to apply font size formatting:', error);
		}
	}, [currentSelection])

	const applyBulletFormatting = useCallback((listType: string) => {
		if (!currentSelection || !inputRef.current) return;

		// Restore the selection
		const selection = window.getSelection();
		if (!selection) return;

		selection.removeAllRanges();
		selection.addRange(currentSelection);

		const selectedText = currentSelection.toString();
		if (!selectedText.trim()) return;

		try {
			// Use document.execCommand to create lists
			if (listType === 'ul' || listType.startsWith('ul-')) {
				document.execCommand('insertUnorderedList', false);

				// Apply custom list style if specified
				if (listType === 'ul-circle' || listType === 'ul-square') {
					const lists = inputRef.current.querySelectorAll('ul');
					const lastList = lists[lists.length - 1];
					if (lastList) {
						if (listType === 'ul-circle') {
							lastList.style.listStyleType = 'circle';
						} else if (listType === 'ul-square') {
							lastList.style.listStyleType = 'square';
						}
					}
				}
			} else if (listType === 'ol') {
				document.execCommand('insertOrderedList', false);
			}

			setShowBulletDropdown(false);
			hidePopover();
			setCurrentSelection(null);
		} catch (error) {
			console.error('Failed to apply bullet formatting:', error);
		}
	}, [currentSelection])

	// Color palette for text formatting
	const colorPalette = [
		'#000000', // Black
		'#374151', // Gray-700
		'#EF4444', // Red-500
		'#F97316', // Orange-500
		'#EAB308', // Yellow-500
		'#22C55E', // Green-500
		'#3B82F6', // Blue-500
		'#8B5CF6', // Violet-500
		'#EC4899', // Pink-500
	];

	// Font size options
	const fontSizes = [
		{ label: '12px', value: '12px' },
		{ label: '14px', value: '14px' },
		{ label: '16px', value: '16px' },
		{ label: '18px', value: '18px' },
		{ label: '20px', value: '20px' },
		{ label: '24px', value: '24px' },
		{ label: '28px', value: '28px' },
		{ label: '32px', value: '32px' },
	];

	// Bullet list options
	const bulletOptions = [
		{ label: 'Bullet List', value: 'ul', icon: List, symbol: '•' },
		{ label: 'Numbered List', value: 'ol', icon: ListOrdered, symbol: '1.' },
		{ label: 'Circle List', value: 'ul-circle', icon: List, symbol: '○' },
		{ label: 'Square List', value: 'ul-square', icon: List, symbol: '▪' },
	];

	return <div className={`gap-1 px-2 mx-2 
		focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
		ref={setNodeRef}
		style={style}
		{...attributes}
	>
		{/* <button onClick={() => setShowPopover(true)} className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
			<Type />
		</button> */}
		<div
			style={handleStyle}
			{...listeners}
			onMouseEnter={(e) => {
				(e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.3)';
			}}
			onMouseLeave={(e) => {
				(e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.2)';
			}}
		>
			<MoveIcon />
		</div>
		<div
			ref={inputRef}
			className=" outline-none rounded-md  w-full block-input-editor"
			contentEditable
			suppressContentEditableWarning
			onMouseUp={handleTextSelection}
			onKeyDown={handleKeyDown}
		/>
		{/* {showPopover && currentSelection && ( */}
		{showPopover && (
			<div
				ref={popoverRef}
				className={`fixed bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50  transition-all duration-200 ease-in-out ${isPopoverVisible
					? 'opacity-100 scale-100 translate-y-0'
					: 'opacity-0 scale-95 translate-y-2'
					}`}

				style={{
					left: popoverPosition.x - 180,
					top: popoverPosition.y - 40,
				}}
			>
				{/* <div className=" w-4 h-4 bg-white  absolute rotate-45 bottom-[-6px] left-6" /> */}
				<div className="flex items-center justify-start gap-1">
					{/* Text formatting buttons */}
					<div
						className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={applyBoldFormatting}
						title="Bold"
					>
						<Bold size={16} />
					</div>
					<div
						className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={applyItalicFormatting}
						title="Italic"
					>
						<Italic size={16} />
					</div>
					<div
						className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={applyUnderlineFormatting}
						title="Underline"
					>
						<Underline size={16} />
					</div>
					<div
						className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={applyHighlightFormatting}
						title="Highlight"
					>
						<Highlighter size={16} />
					</div>

					{/* Heading buttons */}
					<div className="w-px h-4 bg-gray-300 mx-1" /> {/* Separator */}
					<div
						className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={() => applyHeadingFormatting('h1')}
						title="Heading 1"
					>
						<Heading1 size={16} />
					</div>
					<div
						className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={() => applyHeadingFormatting('h2')}
						title="Heading 2"
					>
						<Heading2 size={16} />
					</div>
					<div
						className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={() => applyHeadingFormatting('h3')}
						title="Heading 3"
					>
						<Heading3 size={16} />
					</div>

					{/* Color dropdown */}
					<div className="relative">
						<div
							className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-1"
							onClick={() => setShowColorDropdown(!showColorDropdown)}
							title="Text Color"
						>
							<Palette size={16} />
							<ChevronDown size={12} className={`transition-transform ${showColorDropdown ? 'rotate-180' : ''}`} />
						</div>

						{/* Color palette dropdown */}
						{showColorDropdown && (
							<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 w-[140px] h-[100px]">
								<div className="grid grid-cols-3 gap-2 h-full">
									{colorPalette.map((color) => (
										<div
											key={color}
											className="w-6 h-6 rounded cursor-pointer border border-gray-200 hover:scale-110 transition-transform"
											style={{ backgroundColor: color }}
											onClick={() => applyColorFormatting(color)}
											title={`Apply ${color} color`}
										/>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Font size dropdown */}
					<div className="relative">
						<div
							className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-1"
							onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
							title="Font Size"
						>
							<Type size={16} />
							<ChevronDown size={12} className={`transition-transform ${showFontSizeDropdown ? 'rotate-180' : ''}`} />
						</div>

						{/* Font size options dropdown */}
						{showFontSizeDropdown && (
							<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 w-[80px] max-h-[160px] overflow-y-auto">
								<div className="flex flex-col gap-1">
									{fontSizes.map((size) => (
										<div
											key={size.value}
											className="px-2 py-1 text-sm rounded cursor-pointer hover:bg-gray-100 transition-colors text-center"
											onClick={() => applyFontSizeFormatting(size.value)}
											title={`Apply ${size.label} font size`}
										>
											{size.label}
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Bullet list dropdown */}
					<div className="relative">
						<div
							className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-1"
							onClick={() => setShowBulletDropdown(!showBulletDropdown)}
							title="List Format"
						>
							<List size={16} />
							<ChevronDown size={12} className={`transition-transform ${showBulletDropdown ? 'rotate-180' : ''}`} />
						</div>

						{/* Bullet list options dropdown */}
						{showBulletDropdown && (
							<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 w-[160px]">
								<div className="flex flex-col gap-1">
									{bulletOptions.map((option) => {
										const IconComponent = option.icon;
										return (
											<div
												key={option.value}
												className=" w-2xl px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-3"
												onClick={() => applyBulletFormatting(option.value)}
												title={option.label}
											>
												<div className="flex items-center gap-2">
													<IconComponent size={16} className="text-gray-600" />
													{/* <span className="text-lg font-bold text-gray-800 w-4 text-center">{option.symbol}</span> */}
													<span className="text-sm text-gray-700">{option.label}</span>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		)}
	</div>
})

BlockInput.displayName = "BlockInput";
export default BlockInput;