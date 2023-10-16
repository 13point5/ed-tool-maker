"use client";

import { Database } from "@/app/database.types";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import * as R from "ramda";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

type Props = {
  data: Database["public"]["Tables"]["tools"]["Row"];
};

type ToolSettings = {
  instructions: string;
  model: string;
};

enum FormStatus {
  Idle,
  Loading,
  Error,
  Success,
}

const ChatbotBuilder = ({ data }: Props) => {
  console.log("data", data);

  const supabase = createClientComponentClient<Database>();

  const [name, setName] = useState(data.name || "");
  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const [description, setDescription] = useState(data.description || "");
  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setDescription(e.target.value);
  };

  const [settings, setSettings] = useState<ToolSettings>(
    (data.settings as ToolSettings) || {
      instructions: "",
      model: "gpt-3.5-turbo",
    }
  );

  const handleInstructionsChange: React.ChangeEventHandler<
    HTMLTextAreaElement
  > = (e) => {
    setSettings((prev) =>
      R.mergeDeepRight(prev, {
        instructions: e.target.value,
      })
    );
  };

  const handleModelChange = (value: string) => {
    setSettings((prev) =>
      R.mergeDeepRight(prev, {
        model: value,
      })
    );
  };

  const [saveStatus, setSaveStatus] = useState<FormStatus>(FormStatus.Idle);
  const handleSave: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    setSaveStatus(FormStatus.Loading);

    const { error } = await supabase.from("tools").upsert({
      id: data.id,
      name,
      description,
      settings,
    });

    if (error) {
      console.error(error);
      setSaveStatus(FormStatus.Error);
      toast.error("Error saving tool", {
        position: "bottom-center",
      });
      return;
    }

    setSaveStatus(FormStatus.Success);
    toast.success("Saved!", {
      position: "bottom-center",
    });
  };

  return (
    <main className="w-screen min-h-screen flex flex-col">
      <Header toolData={data} />

      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={handleNameChange} />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input value={description} onChange={handleDescriptionChange} />
        </div>

        <div className="space-y-2">
          <Label>Model</Label>
          <Select value={settings.model} onValueChange={handleModelChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT 3.5</SelectItem>
              <SelectItem value="gpt-3.5-turbo-16k">
                GPT 3.5 16K Context
              </SelectItem>
              <SelectItem value="gpt-4">GPT 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Instructions</Label>
          <Textarea
            value={settings.instructions}
            onChange={handleInstructionsChange}
          />
        </div>

        <Button
          className="w-full bg-blue-500 hover:bg-blue-700"
          color="primary"
          onClick={handleSave}
        >
          {saveStatus === FormStatus.Loading && (
            <>
              <Loader2Icon className="animate-spin mr-2" /> Saving
            </>
          )}

          {saveStatus !== FormStatus.Loading && (
            <>
              <SaveIcon className="mr-2 w-4 h-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </main>
  );
};

export default ChatbotBuilder;
