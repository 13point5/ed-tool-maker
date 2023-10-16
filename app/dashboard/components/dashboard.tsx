"use client";

import Header from "@/components/Header";
import { ToolPreviewCard } from "@/components/ToolPreviewCard";
import { Database } from "@/app/database.types";
import { CreateToolButton } from "@/app/dashboard/components/create-tool-button";

type Props = {
  tools: Database["public"]["Tables"]["tools"]["Row"][];
};

export default function Dashboard({ tools }: Props) {
  return (
    <main className="w-screen min-h-screen flex flex-col">
      <Header />

      <div className="space-y-4 p-4">
        <div className="flex gap-4 items-center">
          <h2 className="text-xl font-bold">Tools</h2>

          <CreateToolButton />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolPreviewCard
              key={tool.id}
              id={tool.id}
              name={tool.name}
              description={tool.description}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
