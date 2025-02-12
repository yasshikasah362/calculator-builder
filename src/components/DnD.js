import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useCalculatorStore from "../store";

const DraggableComponent = ({ component }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: component.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="p-2 bg-gray-200 rounded shadow-md"
    >
      {component.label}
    </div>
  );
};

const DnD = () => {
  const { components, updateComponents } = useCalculatorStore();

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (active.id !== over.id) {
          const oldIndex = components.findIndex((c) => c.id === active.id);
          const newIndex = components.findIndex((c) => c.id === over.id);
          updateComponents(arrayMove(components, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext items={components}>
        <div className="grid grid-cols-4 gap-2">
          {components.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DnD;
