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
    return <p className="text-red-500">Could not find tool</p>;
  }

  return <Builder data={res.data} />;
};

export default ToolBuilderPage;
