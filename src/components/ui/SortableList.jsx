import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SortableList({ 
  items,
  onReorder,
  renderItem,
  className 
}) {
  const [list, setList] = useState(items);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newList = Array.from(list);
    const [removed] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, removed);

    setList(newList);
    onReorder?.(newList);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sortable-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'space-y-2 transition-colors',
              snapshot.isDraggingOver && 'bg-indigo-50/50 rounded-xl p-2',
              className
            )}
          >
            {list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow',
                      snapshot.isDragging && 'shadow-2xl rotate-2 scale-105'
                    )}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        {renderItem(item, index)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}