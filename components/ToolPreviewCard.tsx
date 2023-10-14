import { Database } from "@/app/database.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

type ToolRow = Database["public"]["Tables"]["tools"]["Row"];

type Props = {
  id: ToolRow["id"];
  name: ToolRow["name"];
  description: ToolRow["description"];
};

export const ToolPreviewCard = ({ id, name, description }: Props) => {
  return (
    <Link href={`/tool-builder/${id}`}>
      <Card className="col=span-1 h-full">
        <CardHeader className="p-4">
          <div className="flex gap-6 items-center justify-between">
            <CardTitle className="text-xl">{name}</CardTitle>

            <Button size="icon" variant="ghost" className="w-6 h-6">
              <ExternalLinkIcon className="w-4 h-4" />
            </Button>
          </div>

          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
