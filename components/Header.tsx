import { Database } from "@/app/database.types";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  toolData?: Database["public"]["Tables"]["tools"]["Row"];
};

export default function Header({ toolData }: Props) {
  return (
    <div className="border-b-2 p-4 flex gap-4 items-center justify-between w-full h-fit">
      <div className="flex gap-4 items-center">
        <Link href="/">
          <h2 className="text-xl font-bold">ETM</h2>
        </Link>

        {toolData && (
          <>
            <div className="text-slate-300">|</div>

            <h3 className="text-lg font-semibold">{toolData.name}</h3>

            <Button size="sm" variant="outline" className="">
              <ExternalLinkIcon className="w-4 h-4 mr-1" /> Preview
            </Button>
          </>
        )}
      </div>

      <UserMenu />
    </div>
  );
}
