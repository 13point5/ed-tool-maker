import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditIcon, ExternalLinkIcon, LinkIcon } from "lucide-react";

export const ToolPreviewCard = () => {
  return (
    <Card className="col=span-1">
      <CardHeader className="p-4">
        <div className="flex gap-6 items-center justify-between">
          <CardTitle className="text-xl">Card Title</CardTitle>

          <div className="space-x-2">
            <Button size="icon" variant="ghost" className="w-6 h-6">
              <EditIcon className="w-4 h-4" />
            </Button>

            <Button size="icon" variant="ghost" className="w-6 h-6">
              <ExternalLinkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardDescription>Card Description</CardDescription>
      </CardHeader>
    </Card>
  );
};
