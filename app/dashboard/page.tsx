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

  // where created_by = user.id
  const data = await supabase
    .from("tools")
    .select("*")
    .filter("created_by", "eq", user.id);

  return <Dashboard tools={data.data || []} />;
};

export default DashboardPage;
