import Chatbot from "@/app/app/[id]/chatbot";
import Tool from "@/app/app/[id]/tool";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type Props = {
  params: {
    id: string;
  };
};

const ToolPage = async ({ params }: Props) => {
  const supabase = createServerComponentClient({ cookies });

  const { id } = params;

  const res = await supabase.from("tools").select("*").eq("id", id).single();

  if (res.error || !res.data) {
    return <p className="text-red-500">Could not find tool</p>;
  }

  if (res.data.type === "chatbot") return <Chatbot data={res.data} />;

  return <Tool data={res.data} />;
};

export default ToolPage;
