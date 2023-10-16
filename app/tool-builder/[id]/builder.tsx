"use client";

import * as R from "ramda";
import { useContext, useEffect, useRef, useState } from "react";
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
import editorConfig from "@/lib/tiptapConfig";
import { EditorContent, useEditor } from "@tiptap/react";

import suggestion from "@/components/at-mention";
import { Mention } from "@/components/at-mention/Renderer";
import { mentionRendererClass, openAiApiKeyStorageKey } from "@/lib/constants";
import {
  deleteMention,
  formatHTMLWithContent,
  formatHTMLWithMentions,
  restoreHTMLFromMentions,
  updateMentionLabel,
} from "@/lib/utils";

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

  const instructionsEditor = useEditor({
    ...editorConfig,
    extensions: [
      ...editorConfig.extensions,

      Mention.configure({
        HTMLAttributes: {
          class: mentionRendererClass,
        },
        suggestion: {
          render: suggestion.render,
          items: ({ query = "" }) => {
            return Object.values(blocks.entities).filter((block) =>
              block.label.toLowerCase().includes(query.toLowerCase())
            );
          },
        },
      }),
    ],
    content: restoreHTMLFromMentions(settings.instructions, blocks.entities),
  });

  const onBlockLabelChange = ({ id, label }: { id: string; label: string }) => {
    if (!instructionsEditor) return;

    const html = instructionsEditor.getHTML();
    const res = updateMentionLabel(html, id, label);
    instructionsEditor.commands.setContent(res);
  };

  const onBlockDelete = (id: string) => {
    console.log("on delete", id);

    if (!instructionsEditor) return;

    const html = instructionsEditor.getHTML();
    const res = deleteMention(html, id);
    instructionsEditor.commands.setContent(res);
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

    const rawInstructions =
      instructionsEditor?.getHTML() || settings.instructions;

    const { error } = await supabase.from("tools").upsert({
      id: data.id,
      name,
      description,
      settings: {
        ...settings,
        instructions: formatHTMLWithMentions(rawInstructions),
      },
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

  const [response, setResponse] = useState("");

  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setResponse("");

    const rawInstructions =
      instructionsEditor?.getHTML() || settings.instructions;
    const prompt = formatHTMLWithContent(rawInstructions, blocks.contents);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        apiKey: localStorage.getItem(openAiApiKeyStorageKey),
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    // This data is a ReadableStream
    const data = res.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResponse((prev) => prev + chunkValue);
    }
  };

  return (
    <main className="w-screen min-h-screen flex flex-col">
      <Header toolData={data} />

      <div className="grow flex gap-0">
        <div className="w-full flex flex-col gap-8 items-center border-r-2 p-4">
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
                      id={blockId}
                      onLabelChange={onBlockLabelChange}
                      onDelete={onBlockDelete}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeBlockId ? (
                    <BlockItem
                      id={activeBlockId}
                      onLabelChange={onBlockLabelChange}
                      onDelete={onBlockDelete}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}

          <Button
            onClick={generateResponse}
            className="w-full bg-blue-500 hover:bg-blue-700"
          >
            Test
          </Button>

          {response && (
            <div className="whitespace-pre-wrap my-6 w-full">{response}</div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-4 w-[400px]">
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

            <EditorContent
              editor={instructionsEditor}
              className="border border-input rounded-md p-2 bg-white"
              style={{
                width: "100%",
                maxWidth: "100%",
                minHeight: "100px",
              }}
            />
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
