import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KanbanBoard({ 
  columns,
  onUpdate,
  className 
}) {
  const [data, setData] = useState(columns);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = data.find(col => col.id === source.droppableId);
    const destCol = data.find(col => col.id === destination.droppableId);

    const sourceItems = [...sourceCol.items];
    const destItems = source.droppableId === destination.droppableId 
      ? sourceItems 
      : [...destCol.items];

    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    const newData = data.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, items: sourceItems };
      }
      if (col.id === destination.droppableId) {
        return { ...col, items: destItems };
      }
      return col;
    });

    setData(newData);
    onUpdate?.(newData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={cn('flex gap-6 overflow-x-auto pb-4', className)}>
        {data.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1 }}
            className="flex-shrink-0 w-80"
          >
            <div className="bg-gray-50 rounded-2xl p-4">
              {/* Column header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', column.color || 'bg-indigo-500')} />
                  <h3 className="font-bold text-gray-900">{column.title}</h3>
                  <span className="text-sm text-gray-500">({column.items.length})</span>
                </div>
                
                <button className="w-6 h-6 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'space-y-3 min-h-[200px] rounded-xl p-2 transition-colors',
                      snapshot.isDraggingOver && 'bg-indigo-50'
                    )}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              'bg-white rounded-xl p-4 shadow-sm',
                              snapshot.isDragging && 'shadow-xl rotate-2'
                            )}
                          >
                            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </motion.div>
        ))}
      </div>
    </DragDropContext>
  );
}