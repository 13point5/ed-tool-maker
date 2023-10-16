"use client";

import { Database } from "@/app/database.types";

type Props = {
  data: Database["public"]["Tables"]["tools"]["Row"];
};

const Chatbot = ({ data }: Props) => {
  console.log("data", data);
  return <div>Chatbot</div>;
};

export default Chatbot;
