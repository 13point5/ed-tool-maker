"use client";

import { Database } from "@/app/database.types";
import { Button } from "@/components/ui/button";
import { BlockData, BlockType, BlocksState } from "@/lib/blocksStore";
import { Block } from "./block";
import { useState } from "react";
import { formatHTMLWithContent, restoreHTMLFromMentions } from "@/lib/utils";
import { openAiApiKeyStorageKey } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

type ValuesByIdState = BlocksState["data"]["contents"];

const getInitialValuesState = (blocks: BlockData[]): ValuesByIdState => {
  const result: ValuesByIdState = {};

  blocks.forEach((block) => {
    result[block.id] = "";
  });

  return result;
};

const getBlocksById = (
  blocks: BlockData[]
): BlocksState["data"]["entities"] => {
  const res: BlocksState["data"]["entities"] = {};

  blocks.forEach((block) => {
    res[block.id] = block;
  });

  return res;
};

type Props = {
  data: Database["public"]["Tables"]["tools"]["Row"];
};

const Tool = ({ data }: Props) => {
  console.log("data", data);

  // @ts-ignore
  const blocks: BlockData[] = data.data?.blocks || [];

  const instructions = restoreHTMLFromMentions(
    // @ts-ignore
    data.settings?.instructions || "",
    getBlocksById(blocks)
  );

  const [valuesById, setValuesById] = useState<ValuesByIdState>(
    getInitialValuesState(blocks)
  );

  const handleBlockValueChange = (id: BlockData["id"], value: string) => {
    setValuesById((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const [response, setResponse] = useState("");

  const generateResponse = async (prompt: string) => {
    setResponse("");

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

  const [generating, setGenerating] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setGenerating(true);

    try {
      const prompt = formatHTMLWithContent(instructions, valuesById);
      await generateResponse(prompt);
      toast.success("Generated successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto p-4 max-w-md flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-bold">{data.name}</h1>
        <p className="text-center text-md text-muted-foreground">
          {data.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {blocks.map((block) => (
          <Block
            block={block}
            key={block.id}
            onValueChange={handleBlockValueChange}
          />
        ))}

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700">
          {generating ? (
            <>
              <Loader2Icon className="animate-spin mr-2" /> Generating
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </form>

      {response && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Output</h2>

            <div className="whitespace-pre-wrap my-6 w-full">{response}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tool;
