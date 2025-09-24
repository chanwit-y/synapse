import { useSortable } from "@dnd-kit/sortable";
// import { MoveIcon } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { CSS } from '@dnd-kit/utilities';
import { Bold, Italic, Underline } from "lucide-react";

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


	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			onAddNewItem(id)
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

	return <div className={`gap-1 px-2 mx-2 
		focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
		ref={setNodeRef}
		style={style}
		{...attributes}
	>
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
			className=" outline-none rounded-md  w-full "
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
				<div className="flex items-center justify-start">
					<div 
						className="p-0.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={applyBoldFormatting}
					>
						<Bold size={20} />
					</div>
					<div 
						className="p-0.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={applyItalicFormatting}
					>
						<Italic size={20} />
					</div>
					<div 
						className="p-0.5 hover:bg-gray-100 rounded-md cursor-pointer"
						onClick={applyUnderlineFormatting}
					>
						<Underline size={20} />
					</div>
				</div>
			</div>
		)}
	</div>
})

BlockInput.displayName = "BlockInput";
export default BlockInput;