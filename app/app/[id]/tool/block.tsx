import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BlockData, BlockType } from "@/lib/blocksStore";

type Props = {
  block: BlockData;
  onValueChange: (id: BlockData["id"], value: string) => void;
};

export const Block = ({ block, onValueChange }: Props) => {
  if (block.type === BlockType.shortText) {
    return (
      <div className="flex flex-col gap-4">
        <Label>{block.label}</Label>
        <Input onChange={(e) => onValueChange(block.id, e.target.value)} />
      </div>
    );
  }

  if (block.type === BlockType.longText) {
    return (
      <div className="flex flex-col gap-4">
        <Label>{block.label}</Label>
        <Textarea onChange={(e) => onValueChange(block.id, e.target.value)} />
      </div>
    );
  }

  return null;
};
