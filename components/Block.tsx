import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GripHorizontalIcon, PlusIcon, UploadCloudIcon } from "lucide-react";

export const Block = () => {
  return (
    <div className="p-4 pt-0 pb-8 hover:bg-slate-100 rounded-md w-full relative flex flex-col items-center group">
      <Button
        variant="ghost"
        size="icon"
        className="w-7 h-7 invisible group-hover:visible"
      >
        <GripHorizontalIcon className="h-5" />
      </Button>

      <div className="space-y-2 w-full">
        <Label className="my-0">Prompt</Label>
        <Textarea />
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
};
