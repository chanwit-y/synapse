import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';

interface DraggableItemProps {
	id: string;
	children: React.ReactNode;
	color: string;
}

// Move icon component
const MoveIcon = () => (
	<svg 
		width="20" 
		height="20" 
		viewBox="0 0 24 24" 
		fill="currentColor"
		style={{ cursor: 'grab' }}
	>
		<path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"/>
	</svg>
);

const SortableItem = ({ id, children, color }: DraggableItemProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		backgroundColor: color,
		padding: '20px',
		margin: '8px',
		borderRadius: '8px',
		userSelect: 'none' as const,
		color: 'white',
		fontWeight: 'bold',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		minHeight: '60px',
		border: '2px solid rgba(255,255,255,0.2)',
	};

	const handleStyle = {
		display: 'flex',
		alignItems: 'center',
		padding: '4px',
		borderRadius: '4px',
		backgroundColor: 'rgba(255,255,255,0.2)',
		transition: 'background-color 0.2s',
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<div style={{ flex: 1 }}>
				{children}
			</div>
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
		</div>
	);
};


export const DemoDnd = () => {
	const [items, setItems] = useState([
		{ id: '1', content: '1', color: '#ff6b6b' },
		{ id: '2', content: '2', color: '#4ecdc4' },
		{ id: '3', content: '3', color: '#45b7d1' },
		{ id: '4', content: '4', color: '#96ceb4' },
		{ id: '5', content: '5', color: '#feca57' },
		{ id: '6', content: '6', color: '#ff9ff3' },
		{ id: '7', content: '7', color: '#54a0ff' },
	]);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		
		if (!over) return;

		if (active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	return (
		<DndContext 
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<div style={{ padding: '20px' }}>
				<h2 style={{ marginBottom: '20px', color: '#333' }}>Drag and Drop Editor</h2>
				
				<SortableContext 
					items={items.map(item => item.id)} 
					strategy={verticalListSortingStrategy}
				>
					<div style={{ 
						display: 'flex', 
						flexDirection: 'column', 
						gap: '8px',
						backgroundColor: 'rgba(0,0,0,0.05)',
						padding: '20px',
						margin: '10px',
						borderRadius: '12px',
						border: '2px dashed #ccc',
						minHeight: '200px'
					}}>
						{items.map((item) => (
							<SortableItem 
								key={item.id} 
								id={item.id} 
								color={item.color}
							>
								Item {item.content}
							</SortableItem>
						))}
					</div>
				</SortableContext>
			</div>
		</DndContext>
	)
}