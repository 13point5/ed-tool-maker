import ChatbotBuilder from "@/app/tool-builder/[id]/chatbot-builder";
import Builder from "./builder";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

const ToolBuilderPage = async ({ params }: Props) => {
  const supabase = createServerComponentClient({ cookies });

  const { id } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const res = await supabase.from("tools").select("*").eq("id", id).single();

  if (res.error || !res.data) {
    return <p className="text-red-500 text-center p-8">Could not find tool</p>;
  }

  if (res.data.created_by !== user.id) {
    return (
      <p className="text-red-500 text-center p-8">
        You do not have permission to edit this tool
      </p>
    );
  }

  if (res.data.type === "chatbot") return <ChatbotBuilder data={res.data} />;

  return <Builder data={res.data} />;
};

export default ToolBuilderPage;
