import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { forwardRef, useState, type ElementRef } from "react";
import BlockItem from "./BlockItem";


type BlockProps = {
	id: string;
}
const Block = forwardRef<ElementRef<"div">, BlockProps>(({ id }) => {

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

	return (<DndContext
		collisionDetection={closestCenter}
		onDragEnd={handleDragEnd}
	>
		<SortableContext
			items={items.map((item) => item.id)}
			strategy={verticalListSortingStrategy}
		>
			{items.map((item) => (
				<BlockItem key={item.id} id={item.id} color={item.color}>
					{item.content}
				</BlockItem>
			))}
		</SortableContext>
	</DndContext>)
})

Block.displayName = "Block";

export default Block;