"use client";

import { Database } from "@/app/database.types";
import { Button } from "@/components/ui/button";
import { BlockData, BlockType, BlocksState } from "@/lib/blocksStore";
import { Block } from "./block";
import { useState } from "react";
import { formatHTMLWithContent, restoreHTMLFromMentions } from "@/lib/utils";

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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const res = formatHTMLWithContent(instructions, valuesById);
    console.log("res", res);
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
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Tool;
