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
import Link from "next/link";

export const ToolPreviewCard = () => {
  return (
    <Link href="/tool-builder/1">
      <Card className="col=span-1">
        <CardHeader className="p-4">
          <div className="flex gap-6 items-center justify-between">
            <CardTitle className="text-xl">Card Title</CardTitle>

            <Button size="icon" variant="ghost" className="w-6 h-6">
              <ExternalLinkIcon className="w-4 h-4" />
            </Button>
          </div>

          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
