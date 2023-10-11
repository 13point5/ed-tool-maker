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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { SortableItem } from "@/components/Block/SortableItem";
import { BlockItem } from "@/components/Block/Item";
import { useBlocksStore } from "@/lib/blocksStore";
import { UserMenu } from "@/components/UserMenu";
import { Separator } from "@/components/ui/separator";

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
    <main className="w-screen h-screen grid grid-cols-12">
      <div className="col-span-full border-b-2 p-4 flex gap-4 items-center justify-between w-full">
        <div className="flex gap-4 items-center">
          <h2 className="text-xl font-bold">ETM</h2>

          <div className="text-slate-300">|</div>

          <h3 className="text-lg font-semibold">GPT-3</h3>
        </div>

        <UserMenu />
      </div>

      <div className="col-span-8 overflow-auto flex flex-col gap-6 items-center border-r-2 p-4">
        <div className="flex flex-col gap-0 grow w-full">
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

        <Button className="" color="primary">
          Generate
        </Button>
      </div>

      <div className="col-auto overflow-auto flex flex-col gap-4 p-4 min-w-[500px]">
        <h4 className="text-lg font-semibold">Tool Design</h4>
      </div>
    </main>
  );
}
