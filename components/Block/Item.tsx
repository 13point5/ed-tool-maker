import { useState, LegacyRef, forwardRef } from "react";

import { BlockData, BlockType } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBlocksStore } from "@/lib/blocksStore";
import { EditIcon, GripHorizontalIcon, PlusIcon } from "lucide-react";

type Props = {
  data: BlockData;
  style?: Object;
};

const Item = forwardRef(
  ({ data, ...props }: Props, ref: LegacyRef<HTMLDivElement>) => {
    const { type, label } = data;

    const { updateBlockLabel } = useBlocksStore();

    const [editingLabel, setEditingLabel] = useState(false);

    return (
      <div
        {...props}
        className="p-4 pt-0 pb-8 hover:bg-slate-100 rounded-md w-full relative flex flex-col items-center group cursor-default"
        ref={ref}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-7 invisible group-hover:visible cursor-move"
        >
          <GripHorizontalIcon className="h-5" />
        </Button>

        <div className="space-y-2 w-full">
          <div className="flex gap-4 items-center">
            <Label className="my-0">{label}</Label>

            {!editingLabel && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 invisible group-hover:visible"
                onClick={(e) => {
                  console.log("sup");
                  e.preventDefault();
                  setEditingLabel(true);
                }}
              >
                <EditIcon className="w-4 h-4" />
              </Button>
            )}

            {editingLabel && (
              <div className="flex gap-2 items-center">
                <Button variant="secondary" size="sm">
                  Save
                </Button>

                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {type === BlockType.longText && <Textarea />}
          {type === BlockType.shortText && <Input />}
        </div>

        <div className="flex gap-4 items-center justify-center absolute -bottom-4 inset-x-0 invisible group-hover:visible">
          <Button variant="outline" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" /> Short Input
          </Button>

          <Button variant="outline" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" /> Long Input
          </Button>
        </div>
      </div>
    );
  }
);

Item.displayName = "Item";

export const BlockItem = Item;
