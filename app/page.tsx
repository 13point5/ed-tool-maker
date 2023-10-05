"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloudIcon } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  const handlePromptChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    const { value } = e.target;

    setPrompt(value);
  };

  return (
    <main className="flex flex-col gap-4 p-4 items-center min-h-screen w-screen">
      <h1 className="text-3xl font-semibold tracking-tight">Ed Tool Maker</h1>

      <div className="flex gap-4 w-full h-full grow">
        <div className="flex flex-col gap-4 grow">
          <h4 className="text-xl font-semibold tracking-tight">Builder</h4>
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea value={prompt} onChange={handlePromptChange} />
          </div>
          <Button>Generate</Button>
        </div>

        <div className="flex flex-col gap-4 grow">
          <h4 className="text-xl font-semibold tracking-tight">Preview</h4>

          <div className="space-y-2">
            <Label>File Input</Label>
            <Button variant="outline">
              <UploadCloudIcon className="mr-2" /> Upload File
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Text Input</Label>
            <Textarea />
          </div>

          <Button>Test</Button>
        </div>
      </div>
    </main>
  );
}
