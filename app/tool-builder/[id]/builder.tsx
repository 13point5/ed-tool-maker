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
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { ExternalLinkIcon, SaveIcon } from "lucide-react";

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
    <main className="w-screen min-h-screen flex flex-col">
      <Header />

      <div className="grow flex gap-0">
        <div className="grow flex flex-col gap-8 items-center border-r-2 p-4">
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

          <Button className="w-full bg-blue-500 hover:bg-blue-700">Test</Button>
        </div>

        <div className="flex flex-col gap-4 p-4 min-w-[400px]">
          <h4 className="text-lg font-semibold">Tool Design</h4>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input />
          </div>

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

          <Button className="w-full" variant="outline">
            <SaveIcon className="mr-2 w-4 h-4" />
            Save
          </Button>

          <Button
            className="w-full bg-blue-500 hover:bg-blue-700"
            color="primary"
          >
            <ExternalLinkIcon className="mr-2 w-4 h-4" />
            Publish
          </Button>
        </div>
      </div>
    </main>
  );
}
