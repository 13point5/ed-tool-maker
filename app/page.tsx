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
import { ToolPreviewCard } from "@/components/ToolPreviewCard";
import { PlusIcon } from "lucide-react";

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
    <main className="w-screen h-screen flex flex-col">
      <Header />

      <div className="space-y-4 p-4">
        <div className="flex gap-4 items-center">
          <h2 className="text-xl font-bold">Tools</h2>

          <Button size="sm" className="bg-blue-500 hover:bg-blue-700">
            <PlusIcon className="mr-1 w-5 h-5" /> Create Tool
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(Array(10).keys()).map((i) => (
            <ToolPreviewCard key={i} />
          ))}
          d
        </div>
      </div>
    </main>
  );
}
