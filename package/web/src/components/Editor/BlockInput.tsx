import { forwardRef, useCallback, useRef, useState } from "react";

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
}

const BlockInput = forwardRef<HTMLDivElement, BlockInputProps>(({ }) => {
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
				const x = e.screenX + 100;
				const y = e.screenY - 110;

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

	return <>
		<div
			ref={inputRef}
			className=" outline-none rounded-md bg-amber-700 p-2 w-ful"
			contentEditable
			suppressContentEditableWarning
			onMouseUp={handleTextSelection}
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
					top: popoverPosition.y - 50,
				}}
			>
				<div className=" w-4 h-4 bg-white  absolute rotate-45 bottom-[-6px] left-6" />
				toolbar
			</div>
		)}
	</>
})

BlockInput.displayName = "BlockInput";
export default BlockInput;