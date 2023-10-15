import Dashboard from "@/app/dashboard/components/dashboard";
import { Database } from "@/app/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const data = await supabase.from("tools").select("*");

  return <Dashboard tools={data.data || []} />;
};

export default DashboardPage;
