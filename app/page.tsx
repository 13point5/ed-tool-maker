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

  const [activeId, setActiveId] = useState<BlockData["id"] | null>(null);
  const [blocks, setBlocks] = useState<BlocksState>({
    ids: ["1", "2", "3"],
    entities: {
      "1": {
        id: "1",
        type: BlockType.shortText,
        label: "Short Input 1",
      },
      "2": {
        id: "2",
        type: BlockType.longText,
        label: "Long Input 1",
      },
      "3": {
        id: "3",
        type: BlockType.shortText,
        label: "Short Input 2",
      },
    },
  });

  const handleUpdateBlockLabel = (id: string, label: string) => {
    setBlocks((state) => {
      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: {
            ...state.entities[id],
            label,
          },
        },
      };
    });
  };

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
      setBlocks((state) => {
        const items = state.ids;

        const oldIndex = getBlockIndexById(items, activeId);
        const newIndex = getBlockIndexById(items, overId);

        const newIds = arrayMove(items, oldIndex, newIndex);

        return {
          ...state,
          ids: newIds,
        };
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
            items={blocks.ids}
            strategy={verticalListSortingStrategy}
          >
            {blocks.ids.map((blockId) => (
              <SortableItem key={blockId} data={blocks.entities[blockId]} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? <BlockItem data={blocks.entities[activeId]} /> : null}
          </DragOverlay>
        </DndContext>

        <Button className="w-full mt-10" color="primary">
          Generate
        </Button>
      </div>
    </main>
  );
}
