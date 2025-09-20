import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type ElementRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';


type BlockItemProps = {
	id: string;
	color?: string;
	isEditing: boolean;
	command: "p" | "h1" | "h2"
	onEditMode: (id: string) => void;
	onAddNewItem: (currentId: string) => void;
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
		color,
		command,
		isEditing,
		onEditMode,
		onAddNewItem,
	}) => {
		const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

		const [value, setValue] = useState("")
		const inputRef = useRef<HTMLInputElement>(null)

		// Focus input when isEditing becomes true
		useEffect(() => {
			if (isEditing) {
				setTimeout(() => {
					inputRef.current?.focus()
				}, 0)
			}
		}, [isEditing])

		const display = useMemo(() => {
			switch(command) {
				case "p":
					return <p>{value}</p>
				case "h1":
					return <h1 className="text-3xl font-bold underline">{value}</h1>
				case "h2":
					return <h2>{value}</h2>
				default: return null
			}
		}, [command, value])

	const handleClickEditor = useCallback(() => {
		onEditMode(id)
		// Use setTimeout to ensure the input is rendered before focusing
		setTimeout(() => {
			inputRef.current?.focus()
		}, 0)
	}, [id, onEditMode])



	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			onAddNewItem(id)
		}
	}, [id, onAddNewItem])

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
			backgroundColor: color,
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

		return (<div
			ref={setNodeRef}
			style={style}
			className='gap-1 px-2 mx-2'
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
				{isEditing ? <input
					type="text"
					ref={inputRef}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
					className="bg-transparent w-full focus-visible:border-none focus-visible:outline-none"
				/> : display}
			</div>
		</div>)
	})

BlockItem.displayName = "BlockItem";

export default BlockItem;