import { forwardRef, useCallback, useRef, useState, type ElementRef, type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';


type BlockItemProps = {
	id: string;
	children: ReactNode;
	color: string;
	onEditMode: (id: string) => void;
}

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

const BlockItem = forwardRef<ElementRef<"div">, BlockItemProps>(
	({
		id,
		children,
		color,
		onEditMode,
	}) => {
		const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

		const inputRef = useRef<HTMLInputElement>(null)

		const [isEditing, setIsEditing] = useState(false)

		const handleClickEditor = useCallback(() => {
			setIsEditing(true)
			inputRef.current?.focus()
			onEditMode(id)
		}, [id])

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? 0.5 : 1,
			borderRadius: '4px',
			userSelect: 'none' as const,
			fontWeight: 'bold',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			border: '2px solid rgba(255,255,255,0.2)',
		};

		const handleStyle = {
			display: 'flex',
			alignItems: 'center',
			borderRadius: '4px',
			backgroundColor: 'rgba(255,255,255,0.2)',
			transition: 'background-color 0.2s',
		};

		return (<div
			ref={setNodeRef}
			style={style}
			className='gap-1 p-2 mx-2'
			onClick={handleClickEditor}
			{...attributes}>
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
			<div className="flex gap-1 flex-1 items-center">
				<div>[^]</div>
				{isEditing && <input
					type="text"
					ref={inputRef}
					className="bg-transparent focus-visible:border-none focus-visible:outline-none"
				/>}
				{/* {children} */}
			</div>
		</div>)
	})

BlockItem.displayName = "BlockItem";

export default BlockItem;