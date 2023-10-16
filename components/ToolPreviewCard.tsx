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
import { getProjectTypeLabel } from "@/lib/constants";
import Link from "next/link";

type ToolRow = Database["public"]["Tables"]["tools"]["Row"];

type Props = {
  id: ToolRow["id"];
  name: ToolRow["name"];
  description: ToolRow["description"];
  type: ToolRow["type"];
};

const bgColors: Record<string, string> = {
  tool: "bg-blue-200",
  chatbot: "bg-green-300",
};

export const ToolPreviewCard = ({ id, name, description, type }: Props) => {
  return (
    <Link href={`/tool-builder/${id}`}>
      <Card className="col=span-1 h-full">
        <CardHeader className="p-4">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-xl">{name}</CardTitle>

            <div
              className={`py-1 px-2 rounded-md ${
                bgColors[type] || "bg-gray-300"
              } w-fit text-xs`}
            >
              {getProjectTypeLabel(type)}
            </div>
          </div>

          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
