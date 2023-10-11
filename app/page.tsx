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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      <div className="col-start-1 col-end-8 overflow-auto flex flex-col gap-8 items-center border-r-2 p-4">
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

        <Button className="w-full bg-blue-500 hover:bg-blue-700">
          Generate
        </Button>
      </div>

      <div className="col-start-8 col-end-13 overflow-auto flex flex-col gap-4 p-4 w-full">
        <h4 className="text-lg font-semibold">Tool Design</h4>

        <div className="space-y-2">
          <Label>Instructions</Label>
          <Textarea />
        </div>

        <div className="space-y-2">
          <Label>Model</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">GPT 3.5</SelectItem>
              <SelectItem value="dark">GPT 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full bg-blue-500 hover:bg-blue-700"
          color="primary"
        >
          Save
        </Button>
      </div>
    </main>
  );
}
