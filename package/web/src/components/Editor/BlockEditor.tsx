import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { forwardRef, useState, type ElementRef } from "react";
import BlockInput from "./BlockInput";


type BlockProps = {
	id?: string;
}
const BlockEditor = forwardRef<ElementRef<"div">, BlockProps>(() => {

	const [items, setItems] = useState([
		{ id: '1', content: '1', color: '#ff6b6b', command: '' },
		{ id: '2', content: '2', color: '#4ecdc4', command: '' },
		{ id: '3', content: '3', color: '#45b7d1', command: '' },
		{ id: '4', content: '4', color: '#96ceb4', command: '' },
		{ id: '5', content: '5', color: '#feca57', command: '' },
		{ id: '6', content: '6', color: '#ff9ff3', command: '' },
		{ id: '7', content: '7', color: '#54a0ff', command: '' },
	]);

	const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

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

	const handleAddNewItem = (currentId: string) => {
		const currentIndex = items.findIndex(item => item.id === currentId);
		const newItem = {
			id: Date.now().toString(), // Simple ID generation
			content: '',
			color: '#f0f0f0', // Default color
			command: 'p' as const // Default to paragraph
		};

		// Insert new item after the current item
		const newItems = [...items];
		newItems.splice(currentIndex + 1, 0, newItem);
		setItems(newItems);

		// Set the new item to be focused after the component renders
		setTimeout(() => {
			setFocusedItemId(newItem.id);
			// Clear focus state after a short delay to avoid re-focusing
			setTimeout(() => {
				setFocusedItemId(null);
			}, 100);
		}, 0);
	};

	return (<div className="h-dvh"><DndContext
		collisionDetection={closestCenter}
		onDragEnd={handleDragEnd}
	>
		<SortableContext
			items={items.map((item) => item.id)}
			strategy={verticalListSortingStrategy}
		>
			{items.map((item) => (
				<BlockInput
					key={item.id}
					id={item.id}
					onAddNewItem={handleAddNewItem}
					shouldFocus={focusedItemId === item.id}
				/>
				// <BlockItem
				// 	key={item.id}
				// 	id={item.id}
				// 	color={item.color}
				// 	isEditing={editingItemId === item.id}
				// 	command={item.command as any}
				// 	onEditMode={(id) => {
				// 		setEditingItemId(id);
				// 	}}
				// 	onAddNewItem={handleAddNewItem} />
			))}
		</SortableContext>
	</DndContext>
	<pre>{JSON.stringify(items, null, 2)}</pre>
	</div>
	)
})

BlockEditor.displayName = "Block";

export default BlockEditor;