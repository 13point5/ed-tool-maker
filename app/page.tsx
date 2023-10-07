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
import { useBlocksStore } from "@/lib/blocksStore";

export enum BlockType {
  shortText = "shortText",
  longText = "longText",
}

export type BlockData = {
  id: string;
  type: BlockType;
  label: string;
};

type BlocksState = {
  ids: BlockData["id"][];
  entities: Record<BlockData["id"], BlockData>;
};

const getBlockIndexById = (blocks: BlockData["id"][], id: string) => {
  return blocks.findIndex((blockId) => blockId === id);
};

export default function Home() {
  const [prompt, setPrompt] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { activeBlockId, setActiveBlockId, data, moveBlock } = useBlocksStore();

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveBlockId(active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over?.id || !active.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      moveBlock({ activeId, overId });
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

      <div className="flex flex-col gap-0 w-[700px] border-red-200 mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.ids}
            strategy={verticalListSortingStrategy}
          >
            {data.ids.map((blockId) => (
              <SortableItem key={blockId} data={data.entities[blockId]} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeBlockId ? (
              <BlockItem data={data.entities[activeBlockId]} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Button className="mt-6" color="primary">
        Generate
      </Button>
    </main>
  );
}
