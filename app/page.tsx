"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Block } from "@/components/Block";

enum BlockType {
  shortText = "shortText",
  longText = "longText",
}

type BlockData = {
  id: string;
  type: BlockType;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");

  const [blocks, setBlocks] = useState<BlockData[]>([]);

  const handlePromptChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    const { value } = e.target;

    setPrompt(value);
  };

  return (
    <main className="flex flex-col gap-4 p-4 items-center w-screen">
      <h1 className="text-3xl font-semibold tracking-tight">Ed Tool Maker</h1>

      <div className="flex flex-col gap-2 w-[700px] border-red-200 mx-auto">
        <Block />
        <Block />

        <Button className="w-full mt-10" color="primary">
          Generate
        </Button>
      </div>
    </main>
  );
}
