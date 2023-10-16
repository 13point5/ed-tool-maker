"use client";

import { ChatMessage } from "@/app/app/[id]/chatbot/message";
import { MenuButton } from "@/app/app/[id]/tool/menu-button";
import { Database } from "@/app/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useChat } from "ai/react";
import { openAiApiKeyStorageKey } from "@/lib/constants";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

type Props = {
  data: Database["public"]["Tables"]["tools"]["Row"];
};

const Chatbot = ({ data }: Props) => {
  console.log("data", data);

  // @ts-ignore
  const instructions = data.settings?.instructions;

  // const arr = [...Array(10).keys()];
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        // @ts-ignore
        model: data.settings?.model || "gpt-3.5-turbo",
        apiKey: localStorage.getItem(openAiApiKeyStorageKey) || "",
        // @ts-ignore
        temperature: data.settings?.temperature || 1,
      },
      initialMessages: instructions
        ? [
            {
              id: nanoid(),
              role: "system",
              content: instructions,
            },
          ]
        : [],
      onError: (error) => {
        if (!localStorage.getItem(openAiApiKeyStorageKey)) {
          toast.error("Please add your OpenAI API key in the user menu", {
            position: "bottom-center",
          });
        } else {
          toast.error(error.message, {
            position: "bottom-center",
          });
        }
      },
    });

  const handleChat: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!localStorage.getItem(openAiApiKeyStorageKey)) {
      toast.error("Please add your OpenAI API key in the user menu", {
        position: "bottom-center",
      });
      return;
    }
    handleSubmit(e);
  };

  return (
    <div className="mx-auto p-4 pt-16 pb-8 flex flex-col items-center gap-6 static h-screen max-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-bold">{data.name}</h1>
        <p className="text-center text-md text-muted-foreground">
          {data.description}
        </p>
      </div>

      <MenuButton />

      <div className="h-full max-w-lg w-full flex flex-col gap-0 overflow-hidden p-2">
        <div className="grow overflow-auto">
          {messages.map(
            (message, index) =>
              message.role !== "system" && (
                <div key={index}>
                  <ChatMessage
                    role={message.role}
                    content={message.content}
                    // content={
                    //   "In a small, picturesque village nestled between rolling hills and dense forests, there lived a young girl named Eliza. She was known far and wide for her remarkable ability to communicate with animals. It was a talent that had been passed down through her family for generations, and it was said that her ancestors could even talk to the birds and beasts of the wild.\nEliza's life was simple and content, spent amidst the serene beauty of her village. She had a special bond with a wise old owl named Oliver, who lived in a hollowed-out tree near her home. They would spend hours chatting about the world, its secrets, and the stories of the creatures that inhabited the woods.\nOne day, as Eliza and Oliver conversed, a shadow fell over them, and they looked up to see a magnificent falcon perched on a nearby branch. The falcon introduced herself as Talon, and she had heard about Eliza's remarkable gift. She had come with an urgent message from the king of the neighboring kingdom.\nEliza, with her heart full of determination, agreed to accompany Talon to the neighboring kingdom. She bid her family and friends farewell and set out on an incredible adventure, riding atop Talon's powerful wings. As they approached the kingdom, they could see the signs of the dragon's devastation – burnt fields, destroyed villages, and terrified people."
                    // }
                  />

                  {index < messages.length - 1 && (
                    <Separator className="my-4 md:my-8" />
                  )}
                </div>
              )
          )}
        </div>

        <form className="flex gap-4" onSubmit={handleChat}>
          <Input
            placeholder="type your message here"
            value={input}
            onChange={handleInputChange}
          />

          <Button type="submit" size="icon" className="h-full">
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
