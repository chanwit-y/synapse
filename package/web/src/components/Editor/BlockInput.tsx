import { useSortable } from "@dnd-kit/sortable";
// import { MoveIcon } from "lucide-react";
import { forwardRef, useCallback, useRef, useState } from "react";
import { CSS } from '@dnd-kit/utilities';

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


type BlockInputProps = {
	id: string
	onAddNewItem: (currentId: string) => void;
}

const BlockInput = forwardRef<HTMLDivElement, BlockInputProps>(({ id, onAddNewItem }) => {

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

	const inputRef = useRef<HTMLDivElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	// Popover state
	const [showPopover, setShowPopover] = useState<boolean>(false);
	const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
	const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
	const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });


	// Convert segments to plain text
	const segmentsToText = (segments: TextSegment[]) => {
		return segments.map(segment => segment.text).join('');
	};

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
			setCurrentSelection(null);
		}, 200);
	};

	const handleTextSelection = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;
		const selectedText = selection?.toString();


		if (selectedText.trim()) {
			const rect = inputRef.current?.getBoundingClientRect();
			if (rect) {
				console.log(e)
				const x = e.screenX ;
				const y = e.screenY ;
				// const x = e.screenX + 100;
				// const y = e.screenY - 110;

				// Calculate text position within the segments
				// const fullText = segmentsToText(inputSegments);
				// const start = fullText.indexOf(selectedText);
				// const end = start + selectedText.length;

				// setCurrentSelection({ start, end, text: selectedText });
				// setActiveField(fieldType);
				setPopoverPosition({ x, y });
				showPopoverWithAnimation();
			}
		} else {
			hidePopover();
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
			className=" outline-none rounded-md p-0.5 w-full "
			contentEditable
			suppressContentEditableWarning
			onMouseUp={handleTextSelection}
			onKeyDown={handleKeyDown}
		/>
		{/* {showPopover && currentSelection && ( */}
		{showPopover && (
			<div
				ref={popoverRef}
				className={`fixed bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 min-w-80 transition-all duration-200 ease-in-out ${isPopoverVisible
					? 'opacity-100 scale-100 translate-y-0'
					: 'opacity-0 scale-95 translate-y-2'
					}`}

				style={{
					left: popoverPosition.x - 180,
					top: popoverPosition.y - 60,
				}}
			>
				<div className=" w-4 h-4 bg-white  absolute rotate-45 bottom-[-6px] left-6" />
				toolbar
			</div>
		)}
	</div>
})

BlockInput.displayName = "BlockInput";
export default BlockInput;