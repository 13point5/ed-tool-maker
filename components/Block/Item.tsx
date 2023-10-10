import { useState, LegacyRef, forwardRef } from "react";

import { BlockData, BlockType } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBlocksStore } from "@/lib/blocksStore";
import {
  EditIcon,
  GripHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type Props = {
  listeners?: SyntheticListenerMap | undefined;
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  data: BlockData;
  style?: Object;
};

const Item = forwardRef(
  (
    { data, listeners, setActivatorNodeRef, ...props }: Props,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const { type, label, id } = data;

    const { updateBlockLabel, insertBlockBelow, deleteBlock } =
      useBlocksStore();

    const [editingLabel, setEditingLabel] = useState(false);
    const [tempLabel, setTempLabel] = useState(label);

    const handleEdit = () => {
      setEditingLabel(true);
    };

    const handleTempLabelChange: React.ChangeEventHandler<HTMLInputElement> = (
      e
    ) => {
      setTempLabel(e.target.value);
    };

    const handleSave = () => {
      updateBlockLabel({ id, label: tempLabel });
      setEditingLabel(false);
    };

    const handleCancel = () => {
      setTempLabel(label);
      setEditingLabel(false);
    };

    const handleAddShortInput = () => {
      insertBlockBelow({ currentBlockId: id, type: BlockType.shortText });
    };

    const handleAddLongInput = () => {
      insertBlockBelow({ currentBlockId: id, type: BlockType.longText });
    };

    const handleDelete = () => {
      deleteBlock(id);
    };

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
          ref={setActivatorNodeRef}
          {...listeners}
        >
          <GripHorizontalIcon className="h-5" />
        </Button>

        <div className="space-y-2 w-full">
          <div className="flex gap-4 items-center">
            {!editingLabel && (
              <>
                <Label className="my-0">{label}</Label>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-5 invisible group-hover:visible"
                    onClick={handleEdit}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-5 invisible group-hover:visible"
                    onClick={handleDelete}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            {editingLabel && (
              <>
                <Input
                  className="bg-transparent w-full h-8"
                  defaultValue={tempLabel}
                  onChange={handleTempLabelChange}
                />

                <div className="flex gap-2 items-center">
                  <Button
                    size="xs"
                    className="bg-blue-500 hover:bg-blue-700 h-8"
                    onClick={handleSave}
                  >
                    Save
                  </Button>

                  <Button
                    variant="outline"
                    size="xs"
                    className="text-red-500 hover:text-red-500 h-8"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>

          {type === BlockType.longText && <Textarea />}
          {type === BlockType.shortText && <Input />}
        </div>

        <div className="flex gap-4 items-center justify-center absolute -bottom-4 inset-x-0 invisible group-hover:visible">
          <Button variant="outline" size="sm" onClick={handleAddShortInput}>
            <PlusIcon className="mr-2 h-4 w-4" /> Short Input
          </Button>

          <Button variant="outline" size="sm" onClick={handleAddLongInput}>
            <PlusIcon className="mr-2 h-4 w-4" /> Long Input
          </Button>
        </div>
      </div>
    );
  }
);

Item.displayName = "Item";

export const BlockItem = Item;
