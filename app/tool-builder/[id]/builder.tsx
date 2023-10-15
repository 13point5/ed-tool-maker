"use client";

import * as R from "ramda";
import { useContext, useRef, useState } from "react";
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
import {
  BlockType,
  BlocksState,
  BlocksStoreContext,
  createBlocksStore,
} from "@/lib/blocksStore";
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
import { Loader2Icon, PlusIcon, SaveIcon } from "lucide-react";
import { Database } from "@/app/database.types";
import { StoreApi, useStore } from "zustand";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Instructions } from "@/app/tool-builder/[id]/instructions";

type Props = {
  data: Database["public"]["Tables"]["tools"]["Row"];
};

const BuilderBla = ({ data }: Props) => {
  // @ts-ignore
  const store = useRef(createBlocksStore(data.data?.blocks || [])).current;

  return (
    <BlocksStoreContext.Provider value={store}>
      <Builder data={data} />
    </BlocksStoreContext.Provider>
  );
};

export default BuilderBla;

type ToolSettings = {
  instructions: string;
  model: string;
};

enum FormStatus {
  Idle,
  Loading,
  Error,
  Success,
}

function Builder({ data }: Props) {
  const supabase = createClientComponentClient<Database>();

  const [name, setName] = useState(data.name || "");
  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const [description, setDescription] = useState(data.description || "");
  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setDescription(e.target.value);
  };

  const [settings, setSettings] = useState<ToolSettings>(
    (data.settings as ToolSettings) || {
      instructions: "",
      model: "gpt-3.5-turbo",
    }
  );

  const handleInstructionsChange: React.ChangeEventHandler<
    HTMLTextAreaElement
  > = (e) => {
    const { value } = e.target;

    setSettings((prev) =>
      R.mergeDeepRight(prev, {
        instructions: value,
      })
    );
  };

  const handleModelChange = (value: string) => {
    setSettings((prev) =>
      R.mergeDeepRight(prev, {
        model: value,
      })
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // @ts-ignore
  const store: StoreApi<BlocksState> = useContext(BlocksStoreContext);
  const {
    activeBlockId,
    setActiveBlockId,
    data: blocks,
    moveBlock,
    addFirstBlock,
  } = useStore(store);
  console.log("blocks", blocks);

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

  const [saveStatus, setSaveStatus] = useState<FormStatus>(FormStatus.Idle);
  const handleSave = async () => {
    setSaveStatus(FormStatus.Loading);

    const { error } = await supabase.from("tools").upsert({
      id: data.id,
      name,
      description,
      settings,
      data: {
        blocks: Object.values(blocks.entities),
      },
    });

    if (error) {
      console.error(error);
      setSaveStatus(FormStatus.Error);
      return;
    }

    setSaveStatus(FormStatus.Success);
    toast.success("Saved!", {
      position: "bottom-center",
    });
  };

  return (
    <main className="w-screen min-h-screen flex flex-col">
      <Header toolData={data} />

      <div className="grow flex gap-0">
        <div className="grow flex flex-col gap-8 items-center border-r-2 p-4">
          {blocks.ids.length === 0 && (
            <div className="flex gap-4 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addFirstBlock(BlockType.shortText)}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Short Input
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => addFirstBlock(BlockType.longText)}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Long Input
              </Button>
            </div>
          )}

          {blocks.ids.length > 0 && (
            <div className="flex flex-col gap-0 w-full">
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
                    <SortableItem
                      key={blockId}
                      data={blocks.entities[blockId]}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeBlockId ? (
                    <BlockItem data={blocks.entities[activeBlockId]} />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}

          <Button className="w-full bg-blue-500 hover:bg-blue-700">Test</Button>
        </div>

        <div className="flex flex-col gap-4 p-4 min-w-[400px]">
          <h4 className="text-lg font-semibold">Tool Design</h4>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={handleNameChange} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={handleDescriptionChange} />
          </div>

          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea
              value={settings.instructions}
              onChange={handleInstructionsChange}
            />

            <Instructions />
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={settings.model} onValueChange={handleModelChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT 3.5</SelectItem>
                <SelectItem value="gpt-4">GPT 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-blue-500 hover:bg-blue-700"
            color="primary"
            onClick={handleSave}
          >
            {saveStatus === FormStatus.Loading && (
              <>
                <Loader2Icon className="animate-spin mr-2" /> Saving
              </>
            )}

            {saveStatus !== FormStatus.Loading && (
              <>
                <SaveIcon className="mr-2 w-4 h-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
