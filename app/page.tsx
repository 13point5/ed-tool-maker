"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { SortableItem } from "@/components/Block/SortableItem";
import { BlockItem } from "@/components/Block/Item";

enum BlockType {
  shortText = "shortText",
  longText = "longText",
}

export type BlockData = {
  id: string;
  type: BlockType;
};

const getBlockIndexById = (blocks: BlockData[], id: string) => {
  return blocks.findIndex((block) => block.id === id);
};

export default function Home() {
  const [prompt, setPrompt] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState<BlockData["id"] | null>(null);
  const [blocks, setBlocks] = useState<BlockData[]>([
    {
      id: "1",
      type: BlockType.shortText,
    },
    {
      id: "2",
      type: BlockType.shortText,
    },
    {
      id: "3",
      type: BlockType.shortText,
    },
  ]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveId(active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over?.id || !active.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      setBlocks((items) => {
        const oldIndex = getBlockIndexById(items, activeId);
        const newIndex = getBlockIndexById(items, overId);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handlePromptChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    const { value } = e.target;

    setPrompt(value);
  };

  return (
    <main className="flex flex-col gap-4 p-4 items-center w-screen">
      <h1 className="text-3xl font-semibold tracking-tight">Ed Tool Maker</h1>

      <div className="flex flex-col gap-4 w-[700px] border-red-200 mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((block) => (
              <SortableItem key={block.id} id={block.id} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? <BlockItem id={activeId} /> : null}
          </DragOverlay>
        </DndContext>

        <Button className="w-full mt-10" color="primary">
          Generate
        </Button>
      </div>
    </main>
  );
}
